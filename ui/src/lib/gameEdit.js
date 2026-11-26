// Pure helpers for changing a game that is already in progress. Used by the
// play screen (optimistic update) and by guest storage, so both agree on what
// "add a player" or "change the hole count" does to the score grid.

// Trim and collapse inner whitespace, the same way the API cleans names.
export const cleanName = (value) =>
    String(value ?? '').split(/\s+/).filter(Boolean).join(' ');

export const sameName = (a, b) => a.toLowerCase() === b.toLowerCase();

/**
 * Return a copy of `game` with a new player list and/or hole count.
 * Scores already entered are kept for every player who stays and every hole
 * that still exists; new players and new holes start empty.
 */
export function applyGameEdit(game, { players, holes } = {}) {
    const nextHoles = holes ?? game.holes;
    const nextPlayers = players ?? game.players;
    const scores = {};
    for (const player of nextPlayers) {
        const old = game.scores?.[player] ?? [];
        scores[player] = Array.from({ length: nextHoles }, (_, i) =>
            typeof old[i] === 'number' ? old[i] : null
        );
    }
    return { ...game, holes: nextHoles, players: nextPlayers, scores };
}

// True once anyone has a score on any hole.
export function hasAnyScore(game) {
    return (game.players ?? []).some(player =>
        (game.scores?.[player] ?? []).some(v => typeof v === 'number')
    );
}

// 1-based number of the first hole someone has not scored yet, or null when
// every player has a score on every hole.
export function firstOpenHole(game) {
    const players = game.players ?? [];
    for (let i = 0; i < (game.holes ?? 0); i++) {
        if (players.some(player => typeof game.scores?.[player]?.[i] !== 'number')) {
            return i + 1;
        }
    }
    return null;
}
