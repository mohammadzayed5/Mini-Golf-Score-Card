import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch, setToken, clearToken } from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on app start
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        console.log(`Checking authentication...`);
        try {
            const res = await apiFetch('/api/me');
            console.log(`/api/me response: `, res.status, res.ok);
            if (res.ok) {
                const userData = await res.json();
                console.log(`User Authenticated:`, userData);
                setUser(userData);
            } else {
                console.log(`authentication failed status:`, res.status);
                setUser(null);
            }
        } catch (error) {
            console.log(`Authentication error:`, error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        const res = await apiFetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (res.ok) {
            const data = await res.json();
            setToken(data.token);  // Store JWT token in localStorage
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
            setToken(data.token);  // Store JWT token in localStorage
            setUser(data.user);
            return { success: true };
        } else {
            const error = await res.json();
            return { success: false, error: error.error };
        }
    };

    const logout = async () => {
        await apiFetch('/api/logout', { method: 'POST' });
        clearToken();  // Remove JWT token from localStorage
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };
    console.log(`Auth state:`, {
        isAuthenticated: !!user,
        user: user?.username,
        loading
    });

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