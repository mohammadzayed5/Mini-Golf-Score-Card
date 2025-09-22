import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthPrompt from './AuthPrompt';

export default function ProtectedRoute({ children, redirectTo = '/playerSelect' }) {
    const { isAuthenticated, loading } = useAuth();
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);

    // Show loading while checking auth
    if (loading) {
        return (
            <main className="page">
                <p>Loading...</p>
            </main>
        );
    }

    // If authenticated, show the protected content
    if (isAuthenticated) {
        return children;
    }

    // If not authenticated, show auth prompt when triggered
    return (
        <>
            {/* Show a trigger that opens the auth prompt */}
            <div onClick={() => setShowAuthPrompt(true)}>
                {children}
            </div>

            {/* Show auth prompt modal */}
            {showAuthPrompt && (
                <AuthPrompt
                    onClose={() => setShowAuthPrompt(false)}
                    redirectTo={redirectTo}
                />
            )}
        </>
    );
}

// Hook for protecting individual actions (like buttons)
export function useProtectedAction() {
    const { isAuthenticated } = useAuth();
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);

    const executeProtected = (action, redirectTo = '/') => {
        if (isAuthenticated) {
            action();
        } else {
            setShowAuthPrompt(true);
        }
    };

    const AuthPromptComponent = showAuthPrompt ? (
        <AuthPrompt
            onClose={() => setShowAuthPrompt(false)}
            redirectTo={redirectTo}
        />
    ) : null;

    return { executeProtected, AuthPromptComponent };
}