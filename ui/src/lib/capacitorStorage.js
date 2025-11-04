// Cross-platform storage utility using Capacitor Preferences for iOS/Android
// Falls back to localStorage for web

import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

// Check if running on a native platform (iOS/Android)
const isNative = Capacitor.isNativePlatform();

/**
 * Set a value in storage
 * @param {string} key - Storage key
 * @param {any} value - Value to store (will be JSON stringified)
 */
export async function setItem(key, value) {
  const stringValue = JSON.stringify(value);

  if (isNative) {
    await Preferences.set({ key, value: stringValue });
  } else {
    localStorage.setItem(key, stringValue);
  }
}

/**
 * Get a value from storage
 * @param {string} key - Storage key
 * @returns {Promise<any>} - Parsed value or null if not found
 */
export async function getItem(key) {
  let stringValue;

  if (isNative) {
    const { value } = await Preferences.get({ key });
    stringValue = value;
  } else {
    stringValue = localStorage.getItem(key);
  }

  if (!stringValue) return null;

  try {
    return JSON.parse(stringValue);
  } catch (error) {
    console.warn('Failed to parse stored value:', error);
    return null;
  }
}

/**
 * Remove a value from storage
 * @param {string} key - Storage key
 */
export async function removeItem(key) {
  if (isNative) {
    await Preferences.remove({ key });
  } else {
    localStorage.removeItem(key);
  }
}

/**
 * Clear all stored values
 */
export async function clear() {
  if (isNative) {
    await Preferences.clear();
  } else {
    localStorage.clear();
  }
}

/**
 * Get all keys in storage
 * @returns {Promise<string[]>} - Array of all keys
 */
export async function keys() {
  if (isNative) {
    const { keys } = await Preferences.keys();
    return keys;
  } else {
    return Object.keys(localStorage);
  }
}

// Session storage equivalents (uses Preferences with 'session_' prefix on native)
const SESSION_PREFIX = 'session_';

/**
 * Set a session value (cleared when app restarts)
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
export async function setSessionItem(key, value) {
  const stringValue = JSON.stringify(value);

  if (isNative) {
    // On native, we prefix with 'session_' and manually clear on app restart
    await Preferences.set({ key: SESSION_PREFIX + key, value: stringValue });
  } else {
    sessionStorage.setItem(key, stringValue);
  }
}

/**
 * Get a session value
 * @param {string} key - Storage key
 * @returns {Promise<any>} - Parsed value or null if not found
 */
export async function getSessionItem(key) {
  let stringValue;

  if (isNative) {
    const { value } = await Preferences.get({ key: SESSION_PREFIX + key });
    stringValue = value;
  } else {
    stringValue = sessionStorage.getItem(key);
  }

  if (!stringValue) return null;

  try {
    return JSON.parse(stringValue);
  } catch (error) {
    console.warn('Failed to parse stored session value:', error);
    return null;
  }
}

/**
 * Remove a session value
 * @param {string} key - Storage key
 */
export async function removeSessionItem(key) {
  if (isNative) {
    await Preferences.remove({ key: SESSION_PREFIX + key });
  } else {
    sessionStorage.removeItem(key);
  }
}

/**
 * Clear all session values
 */
export async function clearSession() {
  if (isNative) {
    // Remove all keys with session prefix
    const { keys } = await Preferences.keys();
    const sessionKeys = keys.filter(k => k.startsWith(SESSION_PREFIX));
    await Promise.all(sessionKeys.map(key => Preferences.remove({ key })));
  } else {
    sessionStorage.clear();
  }
}
