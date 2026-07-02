import { getItem, setItem, removeItem } from './capacitorStorage';

export const BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '' : 'https://mini-golf-score-card.onrender.com');

const AUTH_TOKEN_KEY = 'auth_token';

/**
 * Get the JWT token from storage
 */
async function getToken() {
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
 * Check if user is authenticated (has a valid token)
 */
export async function isAuthenticated() {
    const token = await getToken();
    return !!token;
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

    // Default 15s (Render cold-start upper bound). Callers can pass a shorter
    // timeout for latency-sensitive requests (e.g. background auth check).
    const timeout = opts.timeout || 15000;
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
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
};