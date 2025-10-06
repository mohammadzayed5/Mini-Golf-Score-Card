export const BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '' : 'https://api.minigolfscoretracker.com');

/**
   * Get the JWT token from localStorage
   */
function getToken() {
    return localStorage.getItem('auth_token');
}

/**
 * Store the JWT token in localStorage
 */
export function setToken(token) {
    localStorage.setItem('auth_token', token);
}

/**
 * Remove the JWT token from localStorage
 */
export function clearToken() {
    localStorage.removeItem('auth_token');
}

/**
 * Check if user is authenticated (has a valid token)
 */
export function isAuthenticated() {
    return !!getToken();
}

/**
 * apiFetch - Fetch with automatic JWT token injection
 */
export const apiFetch = (path, opts = {}) => {
    const token = getToken();

    // Add Authorization header if token exists
    const headers = {
        ...opts.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(`${BASE}${path}`, {
        ...opts,
        headers,
        credentials: 'include'  
    });
};