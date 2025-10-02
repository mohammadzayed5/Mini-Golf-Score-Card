// Utility for managing guest data in sessionStorage vs user data in database

const STORAGE_KEYS = {
    courses: 'guest_courses',
    players: 'guest_players',
    games: 'guest_games'
};

// Get data from sessionStorage with fallback
export function getGuestData(type) {
    try {
        const data = sessionStorage.getItem(STORAGE_KEYS[type]);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.warn('Failed to load guest data:', error);
        return [];
    }
}

// Save data to sessionStorage
export function setGuestData(type, data) {
    try {
        console.log('Attempting to save:', type, data);
        sessionStorage.setItem(STORAGE_KEYS[type], JSON.stringify(data));
        const saved = sessionStorage.getItem(STORAGE_KEYS[type])
        console.log('Verification - saved data:', saved);
        if(!saved) {
            console.error('sessionStorage failed to save!')
        }

    } catch (error) {
        console.warn('Failed to save guest data:', error);
    }
}

// Add item to guest data
export function addGuestItem(type, item) {
    const currentData = getGuestData(type);
    const newId = Date.now() + Math.random(); // Generate unique temp ID
    const newItem = { ...item, id: newId };
    const newData = [...currentData, newItem];
    setGuestData(type, newData);
    return newItem;
}

// Clear all guest data (useful for testing)
export function clearGuestData() {
    Object.values(STORAGE_KEYS).forEach(key => {
        sessionStorage.removeItem(key);
    });
}