import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch, setToken, clearToken, getToken, onAuthExpired, warmUpApi, CACHED_USER_KEY } from '../lib/api';
import { getItem, setItem, removeItem } from '../lib/capacitorStorage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        // apiFetch drops the token when the API answers 401; mirror that here
        // so the UI stops showing the signed-in state.
        const unsubscribe = onAuthExpired(() => {
            if (!cancelled) setUser(null);
        });

        (async () => {
            const [cachedUser, token] = await Promise.all([
                getItem(CACHED_USER_KEY),
                getToken(),
            ]);
            if (cancelled) return;

            if (!token) {
                // Guest. Nothing to verify, so don't wait on the network at all.
                // Just start waking the API so a later sign-in doesn't pay the
                // cold start. A cached user without a token is stale; drop it.
                if (cachedUser) await removeItem(CACHED_USER_KEY);
                setLoading(false);
                warmUpApi();
                return;
            }

            // Optimistic: show the cached user immediately, verify in the
            // background. This request also wakes the API if it is asleep.
            if (cachedUser) setUser(cachedUser);
            setLoading(false);

            try {
                const res = await apiFetch('/api/me');
                if (cancelled) return;
                if (res.ok) {
                    const userData = await res.json();
                    setUser(userData);
                    await setItem(CACHED_USER_KEY, userData);
                } else if (res.status === 401) {
                    // apiFetch already cleared the token and cached user.
                    setUser(null);
                }
            } catch {
                // Network error / timeout — keep optimistic cached user, let calls retry later.
            }
        })();

        return () => {
            cancelled = true;
            unsubscribe();
        };
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
        try {
            await apiFetch('/api/logout', { method: 'POST', timeout: 8000 });
        } catch {
            // Logging out must work offline too; the token is local.
        }
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
