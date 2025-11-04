// Utility for managing guest data using cross-platform storage
import { getSessionItem, setSessionItem, removeSessionItem } from './capacitorStorage';

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
        console.log('Attempting to save:', type, data);
        await setSessionItem(STORAGE_KEYS[type], data);
        const saved = await getSessionItem(STORAGE_KEYS[type]);
        console.log('Verification - saved data:', saved);
        if(!saved) {
            console.error('Storage failed to save!')
        }
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