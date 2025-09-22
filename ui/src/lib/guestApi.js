// Enhanced API wrapper that handles guest vs user data automatically
import { apiFetch } from './api';
import { getGuestData, addGuestItem, setGuestData } from './storage';

// Check if user is authenticated by making a quick API call
async function isUserAuthenticated() {
    try {
        const res = await apiFetch('/api/me');
        return res.ok; // Returns true if authenticated, false if 401
    } catch (error) {
        return false;
    }
}

// Enhanced fetch that handles guest vs user mode automatically
export async function guestApiFetch(url, options = {}) {
    const isAuthenticated = await isUserAuthenticated();

    // For GET requests
    if (!options.method || options.method === 'GET') {
        if (isAuthenticated) {
            // User mode - use regular API
            return await apiFetch(url, options);
        } else {
            // Guest mode - return data from sessionStorage
            const pathParts = url.split('/');
            const endpoint = pathParts[pathParts.length - 2]; // e.g., 'games' from '/api/games/123'
            const id = pathParts[pathParts.length - 1]; // e.g., '123'

            let data;
            if (!isNaN(id) && id !== endpoint) {
                // Single item request (e.g., /api/games/123)
                const allItems = getGuestData(endpoint);
                data = allItems.find(item => item.id == id);
                if (!data) {
                    return {
                        ok: false,
                        status: 404,
                        json: async () => ({ error: 'Not found' })
                    };
                }
            } else {
                // List request (e.g., /api/games)
                data = getGuestData(url.split('/').pop());
            }

            // Mock a Response object
            return {
                ok: true,
                status: 200,
                json: async () => data
            };
        }
    }

    // For POST requests
    if (options.method === 'POST') {
        if (isAuthenticated) {
            // User mode - use regular API
            return await apiFetch(url, options);
        } else {
            // Guest mode - save to sessionStorage and return data
            const endpoint = url.split('/').pop();
            const requestData = JSON.parse(options.body);

            let newItem;
            if (endpoint === 'games') {
                // Special handling for games - need to create scores structure
                let players = requestData.players || [];

                // If playerIds are provided instead of players, convert them to player names
                if (requestData.playerIds && requestData.playerIds.length > 0) {
                    const guestPlayers = getGuestData('players');
                    players = requestData.playerIds.map(id => {
                        const player = guestPlayers.find(p => p.id == id);
                        return player ? player.name : `Player ${id}`;
                    });
                }

                const holes = requestData.holes || 18;
                const scores = {};
                players.forEach(player => {
                    scores[player] = new Array(holes).fill(null);
                });

                newItem = addGuestItem(endpoint, {
                    ...requestData,
                    players: players,
                    scores: scores
                });
            } else {
                newItem = addGuestItem(endpoint, requestData);
            }

            // Mock a Response object
            return {
                ok: true,
                status: 201,
                json: async () => newItem
            };
        }
    }

    // For PATCH requests (score updates)
    if (options.method === 'PATCH') {
        if (isAuthenticated) {
            // User mode - use regular API
            return await apiFetch(url, options);
        } else {
            // Guest mode - update sessionStorage data
            const pathParts = url.split('/');
            const gameId = pathParts[pathParts.indexOf('games') + 1];
            const requestData = JSON.parse(options.body);

            // Update the game in sessionStorage
            const games = getGuestData('games');
            const gameIndex = games.findIndex(g => g.id == gameId);

            if (gameIndex >= 0) {
                const game = games[gameIndex];
                if (!game.scores[requestData.player]) {
                    game.scores[requestData.player] = new Array(game.holes || 18).fill(null);
                }
                game.scores[requestData.player][requestData.hole - 1] = requestData.score;
                games[gameIndex] = game;
                setGuestData('games', games);
            }

            // Mock a successful response
            return {
                ok: true,
                status: 200,
                json: async () => ({ success: true })
            };
        }
    }

    // For DELETE requests
    if (options.method === 'DELETE') {
        if (isAuthenticated) {
            // User mode - use regular API
            return await apiFetch(url, options);
        } else {
            // Guest mode - delete from sessionStorage
            const pathParts = url.split('/');
            const endpoint = pathParts[pathParts.length - 2]; // e.g., 'players' from '/api/players/123'
            const id = pathParts[pathParts.length - 1]; // e.g., '123'

            if (!isNaN(id) && id !== endpoint) {
                // Delete item request (e.g., /api/players/123)
                const currentData = getGuestData(endpoint);
                const filteredData = currentData.filter(item => item.id != id);
                setGuestData(endpoint, filteredData);
            }

            // Mock a successful response
            return {
                ok: true,
                status: 204,
                json: async () => ({})
            };
        }
    }

    // For other methods, use regular API
    return await apiFetch(url, options);
}