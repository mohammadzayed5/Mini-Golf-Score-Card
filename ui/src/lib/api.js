export const BASE = import.meta.env.VITE_API_BASE_URL || 'https://minigolfscoretracker.com';

/**
 * apiFetch(path, opts)
 * - Guarantees we hit the right origin for the API.
 * - Example: apiFetch('/api/games', { method:'POST', ... })
 */

export const apiFetch = (path, opts) => {
    return fetch(`${BASE}${path}`, opts);
};