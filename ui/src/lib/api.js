import { getItem, setItem, removeItem } from './capacitorStorage';

// Strip trailing slashes so a BASE like "https://host/" doesn't turn every
// request into "https://host//api/...".
const RAW_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '' : 'https://mini-golf-score-card.onrender.com');
export const BASE = RAW_BASE.replace(/\/+$/, '');

const AUTH_TOKEN_KEY = 'auth_token';
export const CACHED_USER_KEY = 'cached_user';

// The API runs on a Render instance that spins down when idle and takes
// roughly 20-60s to wake (measured 22.6s). A request that lands during the
// wake-up has to wait it out; the old 15s default just failed every time.
export const COLD_START_TIMEOUT_MS = 60000;

/**
 * Get the JWT token from storage
 */
export async function getToken() {
    return await getItem(AUTH_TOKEN_KEY);
}

/**
 * Store the JWT token in storage
 */
export async function setToken(token) {
    await setItem(AUTH_TOKEN_KEY, token);
}

/**
 * Remove the JWT token from storage
 */
export async function clearToken() {
    await removeItem(AUTH_TOKEN_KEY);
}

/**
 * Check if user is authenticated (has a token stored). Purely local; the API
 * is the one that decides whether the token is still valid.
 */
export async function isAuthenticated() {
    const token = await getToken();
    return !!token;
}

// --- Token expiry notifications ---------------------------------------------
// Tokens last 24h. When the API rejects one we drop it everywhere and tell
// AuthContext so the UI stops showing "Welcome back".
const authExpiredListeners = new Set();

export function onAuthExpired(listener) {
    authExpiredListeners.add(listener);
    return () => authExpiredListeners.delete(listener);
}

export async function handleUnauthorized() {
    await clearToken();
    await removeItem(CACHED_USER_KEY);
    for (const listener of authExpiredListeners) {
        try { listener(); } catch (e) { console.error('auth-expired listener failed:', e); }
    }
}

// --- Cold-start warm-up ------------------------------------------------------
// Fire-and-forget ping so a sleeping Render instance starts waking the moment
// the app opens, not when the user reaches a screen that needs it. /api/health
// also runs SELECT 1 so Turso wakes alongside it.
let warmUpStarted = false;

export function warmUpApi() {
    if (warmUpStarted) return;
    warmUpStarted = true;
    try {
        fetch(`${BASE}/api/health`, { method: 'GET', credentials: 'omit' }).catch(() => {});
    } catch {
        // fetch itself throwing (no window, etc.) must never break startup
    }
}

/**
 * apiFetch - Fetch with automatic JWT token injection and timeout
 */
export const apiFetch = async (path, opts = {}) => {
    const token = await getToken();

    // Add Authorization header if token exists
    const headers = {
        ...opts.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Callers can pass a shorter timeout for latency-sensitive requests.
    const timeout = opts.timeout || COLD_START_TIMEOUT_MS;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Strip `timeout` from the fetch init so it doesn't hit the underlying fetch.
    const { timeout: _t, ...fetchOpts } = opts;

    try {
        const response = await fetch(`${BASE}${path}`, {
            ...fetchOpts,
            headers,
            credentials: 'include',
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        // We sent a token and the API rejected it: it has expired or been
        // revoked. Drop it so the rest of the app falls back to guest mode
        // instead of failing every call until the next reload.
        if (response.status === 401 && token) {
            await handleUnauthorized();
        }

        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
};
