import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch, setToken, clearToken } from '../lib/api';
import { getItem, setItem, removeItem } from '../lib/capacitorStorage';

const AuthContext = createContext();

const CACHED_USER_KEY = 'cached_user';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            const cachedUser = await getItem(CACHED_USER_KEY);
            if (!cancelled && cachedUser) {
                setUser(cachedUser);
            }
            setLoading(false);

            try {
                const res = await apiFetch('/api/me', { timeout: 8000 });
                if (cancelled) return;
                if (res.ok) {
                    const userData = await res.json();
                    setUser(userData);
                    await setItem(CACHED_USER_KEY, userData);
                } else if (res.status === 401) {
                    setUser(null);
                    await clearToken();
                    await removeItem(CACHED_USER_KEY);
                }
            } catch {
                // Network error / timeout — keep optimistic cached user, let calls retry later.
            }
        })();

        return () => { cancelled = true; };
    }, []);

    const login = async (username, password) => {
        const res = await apiFetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (res.ok) {
            const data = await res.json();
            await setToken(data.token);
            await setItem(CACHED_USER_KEY, data.user);
            setUser(data.user);
            return { success: true };
        } else {
            const error = await res.json();
            return { success: false, error: error.error };
        }
    };

    const register = async (username, password) => {
        const res = await apiFetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (res.ok) {
            const data = await res.json();
            await setToken(data.token);
            await setItem(CACHED_USER_KEY, data.user);
            setUser(data.user);
            return { success: true };
        } else {
            const error = await res.json();
            return { success: false, error: error.error };
        }
    };

    const logout = async () => {
        await apiFetch('/api/logout', { method: 'POST' });
        await clearToken();
        await removeItem(CACHED_USER_KEY);
        setUser(null);
    };

    const deleteAccount = async () => {
        try {
            const res = await apiFetch('/api/delete-account', { method: 'DELETE' });
            if (res.ok) {
                await clearToken();
                await removeItem(CACHED_USER_KEY);
                setUser(null);
                return { success: true };
            } else {
                const error = await res.json();
                return { success: false, error: error.error || 'Failed to delete account' };
            }
        } catch {
            return { success: false, error: 'Network error' };
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        deleteAccount,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
