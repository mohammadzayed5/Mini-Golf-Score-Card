// Enhanced API wrapper that handles guest vs user data automatically
import { apiFetch, getToken } from './api';
import { getGuestData, addGuestItem, setGuestData } from './storage';

/**
 * Route a request to the API (signed-in) or to local guest storage (guest).
 *
 * Guests never touch the network. This used to call /api/me before *every*
 * request to find out whether the user was signed in, which meant a full
 * round trip per screen and per score tap, and a 15s stall for each of them
 * whenever the Render instance was asleep. A stored token is the signal now;
 * the API tells us (401) if that token has gone stale.
 */
export async function guestApiFetch(url, options = {}) {
    const token = await getToken();

    if (token) {
        const res = await apiFetch(url, options);
        // Token expired (they last 24h). apiFetch has already dropped it, so
        // complete this action in guest mode rather than failing it.
        if (res.status !== 401) return res;
    }

    return guestFetch(url, options);
}

// Guest mode: everything below reads and writes local storage and returns a
// minimal Response-shaped object so callers can treat both paths the same.
async function guestFetch(url, options) {
    // For GET requests
    if (!options.method || options.method === 'GET') {
        const pathParts = url.split('/');
        const endpoint = pathParts[pathParts.length - 2]; // e.g., 'games' from '/api/games/123'
        const id = pathParts[pathParts.length - 1]; // e.g., '123'

        let data;
        if (((!isNaN(id) && id !== endpoint) || id === 'null')) {
            // Single item request (e.g., /api/games/123 or /api/games/null for guest)
            const allItems = await getGuestData(endpoint);
            if (id === 'null') {
                // For guest games with id=null, find the first game with null id
                data = allItems.find(item => item.id === null);
            } else {
                data = allItems.find(item => item.id == id);
            }
            if (!data) {
                return {
                    ok: false,
                    status: 404,
                    json: async () => ({ error: 'Not found' })
                };
            }
        } else {
            // List request (e.g., /api/games)
            data = await getGuestData(url.split('/').pop());
        }

        return {
            ok: true,
            status: 200,
            json: async () => data
        };
    }

    // For POST requests
    if (options.method === 'POST') {
        const endpoint = url.split('/').pop();
        const requestData = options.body ? JSON.parse(options.body) : {};

        // Only these collections exist in guest storage. Anything else (for
        // example /api/games/:id/finish) has no guest meaning; report success
        // without writing junk keys.
        if (!['games', 'players', 'courses'].includes(endpoint)) {
            return {
                ok: true,
                status: 200,
                json: async () => ({})
            };
        }

        let newItem;
        if (endpoint === 'games') {
            // Special handling for games - need to create scores structure
            let players = requestData.players || [];

            // If playerIds are provided instead of players, convert them to player names
            if (requestData.playerIds && requestData.playerIds.length > 0) {
                const guestPlayers = await getGuestData('players');
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

            // Create guest game data with null ID
            const gameData = {
                ...requestData,
                players: players,
                scores: scores,
                id: null
            };

            const currentData = await getGuestData(endpoint);
            const newData = [...currentData, gameData];
            await setGuestData(endpoint, newData);
            newItem = gameData;
        } else {
            newItem = await addGuestItem(endpoint, requestData);
        }

        return {
            ok: true,
            status: 201,
            json: async () => newItem
        };
    }

    // For PATCH requests (score updates)
    if (options.method === 'PATCH') {
        const pathParts = url.split('/');
        const gameId = pathParts[pathParts.indexOf('games') + 1];
        const requestData = JSON.parse(options.body);

        const games = await getGuestData('games');
        const gameIndex = gameId === 'null'
            ? games.findIndex(g => g.id === null)
            : games.findIndex(g => g.id == gameId);

        if (gameIndex >= 0) {
            const game = games[gameIndex];
            if (!game.scores[requestData.player]) {
                game.scores[requestData.player] = new Array(game.holes || 18).fill(null);
            }
            game.scores[requestData.player][requestData.hole - 1] = requestData.score;
            games[gameIndex] = game;
            await setGuestData('games', games);
        }

        return {
            ok: true,
            status: 200,
            json: async () => ({ success: true })
        };
    }

    // For DELETE requests
    if (options.method === 'DELETE') {
        const pathParts = url.split('/');
        const endpoint = pathParts[pathParts.length - 2]; // e.g., 'players' from '/api/players/123'
        const id = pathParts[pathParts.length - 1]; // e.g., '123'

        if (!isNaN(id) && id !== endpoint) {
            const currentData = await getGuestData(endpoint);
            const filteredData = currentData.filter(item => item.id != id);
            await setGuestData(endpoint, filteredData);
        }

        return {
            ok: true,
            status: 204,
            json: async () => ({})
        };
    }

    // Anything else has no guest equivalent; let the API answer.
    return await apiFetch(url, options);
}
