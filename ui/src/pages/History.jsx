//Place holder page for History tab
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AuthPrompt from "../components/AuthPrompt";

export default function History() {
    const { isAuthenticated } = useAuth();
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);

    if (!isAuthenticated) {
        return (
            <>
                <main className="page">
                    <h1 className="title">History</h1>
                    <div style={{
                        background: 'linear-gradient(135deg, #5eead4 0%, #14b8a6 100%)',
                        color: 'white',
                        padding: '2.5rem 2rem',
                        borderRadius: '16px',
                        marginTop: '2rem',
                        textAlign: 'center',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{
                            fontSize: '3rem',
                            marginBottom: '1rem'
                        }}>
                            🔒
                        </div>
                        <h2 style={{
                            margin: '0 0 0.5rem 0',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: 'white'
                        }}>
                            Login Required
                        </h2>
                        <p style={{
                            margin: '0 0 1.5rem 0',
                            opacity: 0.95,
                            fontSize: '1.05rem',
                            lineHeight: '1.5'
                        }}>
                            Create an account to track your game history and progress over time!
                        </p>
                        <button
                            onClick={() => setShowAuthPrompt(true)}
                            style={{
                                backgroundColor: 'white',
                                color: '#14b8a6',
                                padding: '0.875rem 2rem',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1.05rem',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                transition: 'transform 0.2s ease',
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            Sign In / Create Account
                        </button>
                    </div>
                </main>

                {showAuthPrompt && (
                    <AuthPrompt
                        onClose={() => setShowAuthPrompt(false)}
                        redirectTo="/history"
                    />
                )}
            </>
        );
    }

    return (
        <main className="page">
            <h1 className="title">History</h1>
            <p>See past games and scores here!</p>
        </main>
    );

}
