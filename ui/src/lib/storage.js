// Utility for managing guest data using cross-platform storage
import { getSessionItem, setSessionItem, removeSessionItem, getItem, setItem } from './capacitorStorage';

const STORAGE_KEYS = {
    courses: 'guest_courses',
    players: 'guest_players',
    games: 'guest_games'
};

// Get data from storage with fallback
export async function getGuestData(type) {
    try {
        const data = await getSessionItem(STORAGE_KEYS[type]);
        return data || [];
    } catch (error) {
        console.warn('Failed to load guest data:', error);
        return [];
    }
}

// Save data to storage
export async function setGuestData(type, data) {
    try {
        await setSessionItem(STORAGE_KEYS[type], data);
    } catch (error) {
        console.warn('Failed to save guest data:', error);
    }
}

// Add item to guest data
export async function addGuestItem(type, item) {
    const currentData = await getGuestData(type);
    const newId = Date.now() + Math.random(); // Generate unique temp ID
    const newItem = { ...item, id: newId };
    const newData = [...currentData, newItem];
    await setGuestData(type, newData);
    return newItem;
}

// Clear all guest data (useful for testing)
export async function clearGuestData() {
    await Promise.all(
        Object.values(STORAGE_KEYS).map(key => removeSessionItem(key))
    );
}

// --- Guest wins (persistent storage: survives app restarts on iOS and web) ---
const GUEST_WINS_KEY = 'guest_wins';
const PROCESSED_GAMES_KEY = 'guest_processed_games';

export async function getGuestWins() {
    try {
        return (await getItem(GUEST_WINS_KEY)) || {};
    } catch {
        return {};
    }
}

export async function setGuestWins(wins) {
    try {
        await setItem(GUEST_WINS_KEY, wins);
    } catch (error) {
        console.warn('Failed to save guest wins:', error);
    }
}

export async function getProcessedGames() {
    try {
        return (await getItem(PROCESSED_GAMES_KEY)) || [];
    } catch {
        return [];
    }
}

export async function setProcessedGames(games) {
    try {
        await setItem(PROCESSED_GAMES_KEY, games);
    } catch (error) {
        console.warn('Failed to save processed games:', error);
    }
}