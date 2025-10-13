//Place holder page for History tab
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../lib/api";
import { useEffect, useState } from "react";

export default function History() {
    const navigate = useNavigate();
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    useEffect(() => {
        // Check if user is authenticated (not a guest)
        if (!isAuthenticated()) {
            setShowLoginPrompt(true);
        }
    }, []);

    if (showLoginPrompt) {
        return (
            <main className="page">
                <h1 className="title">History</h1>
                <div style={{
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #f5c6cb',
                    marginTop: '1rem',
                    textAlign: 'center'
                }}>
                    <p style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 'bold' }}>
                        Login Required
                    </p>
                    <p style={{ margin: '0 0 1rem 0' }}>
                        You must log in to track your game history and progress.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            backgroundColor: '#721c24',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Go to Login
                    </button>
                </div>
            </main>
        );
    }
    else {
        






    }

    return (
        <main className="page">
            <h1 className="title">History</h1>
            <p>See past games and scores here!</p>
        </main>
    );

}