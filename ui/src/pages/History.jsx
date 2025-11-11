import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AuthPrompt from "../components/AuthPrompt";
import { apiFetch } from "../lib/api";
import AdBanner from "../components/AdBanner";

export default function History() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null); // {gameId, gameName} or null
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            loadGames();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    async function loadGames() {
        try {
            setLoading(true);
            setError("");
            const res = await apiFetch("/api/games");
            if (!res.ok) {
                throw new Error("Failed to load
                    
                    games");
            }
            const data = await res.json();
            // Sort by created_at DESC (newest first)
            const sorted = data.sort((a, b) => {
                return new Date(b.created_at) - new Date(a.created_at);
            });
            setGames(sorted);
        } catch (err) {
            console.error("Error loading games:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function calculateWinner(game) {
        if (!game.players || game.players.length === 0) return null;

        const totals = game.players.map(player => {
            const scores = game.scores?.[player] || [];
            const total = scores.reduce((sum, score) => sum + (score || 0), 0);
            return { player, total };
        });

        totals.sort((a, b) => a.total - b.total);
        const bestScore = totals[0].total;
        const winners = totals.filter(t => t.total === bestScore);

        return { winners, totals };
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    }

    async function handleDeleteGame(gameId) {
        try {
            setDeleting(true);
            const res = await apiFetch(`/api/games/${gameId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                // Remove game from list
                setGames(games.filter(g => g.id !== gameId));
                setDeleteConfirm(null);
            } else {
                setError("Failed to delete game");
            }
        } catch (err) {
            console.error("Error deleting game:", err);
            setError(err.message);
        } finally {
            setDeleting(false);
        }
    }

    // Show login prompt for unauthenticated users
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
                            Create an account to save your games and track your history over time!
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

    if (loading) {
        return (
            <main className="page">
                <h1 className="title">History</h1>
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--mint)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                    <p>Loading your games...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="page">
                <h1 className="title">History</h1>
                <div style={{
                    padding: '2rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '12px',
                    color: '#ef4444',
                    textAlign: 'center'
                }}>
                    <p>❌ {error}</p>
                    <button onClick={loadGames} className="cta" style={{ marginTop: '1rem' }}>
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    if (games.length === 0) {
        return (
            <main className="page">
                <h1 className="title">History</h1>
                <div style={{
                    textAlign: 'center',
                    padding: '3rem 2rem',
                    background: 'linear-gradient(135deg, rgba(94, 234, 212, 0.1), rgba(20, 184, 166, 0.1))',
                    borderRadius: '16px',
                    marginTop: '2rem'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏌️</div>
                    <h2 style={{ color: 'var(--mint)', marginBottom: '0.5rem' }}>No Games Yet</h2>
                    <p style={{ color: 'var(--text)', opacity: 0.8, marginBottom: '1.5rem' }}>
                        Start your first game to see it here!
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="cta"
                    >
                        ⛳ Start New Game
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="page">
            <h1 className="title">History</h1>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                color: 'var(--text)',
                opacity: 0.7
            }}>
                <p>{games.length} game{games.length !== 1 ? 's' : ''} played</p>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {games.map((game) => {
                    const result = calculateWinner(game);
                    const winners = result?.winners || [];
                    const totals = result?.totals || [];

                    return (
                        <div
                            key={game.id}
                            style={{
                                background: 'var(--card-bg)',
                                borderRadius: '12px',
                                padding: '1.25rem',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                transition: 'all 0.2s ease',
                                border: '1px solid rgba(94, 234, 212, 0.2)',
                                position: 'relative'
                            }}
                        >
                            {/* Delete button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteConfirm({ gameId: game.id, gameName: game.name });
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(239, 68, 68, 0.4)',
                                    background: 'rgba(239, 68, 68, 0.25)',
                                    color: '#ef4444',
                                    fontSize: '1.2rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease',
                                    zIndex: 10,
                                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.4)';
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.2)';
                                }}
                                title="Delete game"
                            >
                                🗑️
                            </button>

                            {/* Header - made clickable */}
                            <div
                                onClick={() => navigate(`/results/${game.id}`)}
                                style={{
                                    cursor: 'pointer',
                                    marginBottom: '0.75rem'
                                }}
                                onMouseOver={(e) => {
                                    const card = e.currentTarget.closest('div[style*="position: relative"]');
                                    card.style.transform = 'translateY(-2px)';
                                    card.style.boxShadow = '0 4px 16px rgba(20, 184, 166, 0.3)';
                                }}
                                onMouseOut={(e) => {
                                    const card = e.currentTarget.closest('div[style*="position: relative"]');
                                    card.style.transform = 'translateY(0)';
                                    card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    paddingRight: '40px'
                                }}>
                                    <div>
                                        <h3 style={{
                                            margin: 0,
                                            color: 'var(--mint)',
                                            fontSize: '1.25rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {game.name}
                                        </h3>
                                        <p style={{
                                            margin: '0.25rem 0 0 0',
                                            fontSize: '0.875rem',
                                            color: 'var(--text)',
                                            opacity: 0.7
                                        }}>
                                            {formatDate(game.created_at)} • {game.holes} holes
                                        </p>
                                    </div>
                                    {winners.length > 0 && (
                                        <div style={{
                                            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                            color: 'white',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            fontSize: '1.25rem',
                                            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
                                        }}>
                                            🏆
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Winner(s) - also clickable */}
                            {winners.length > 0 && (
                                <div
                                    onClick={() => navigate(`/results/${game.id}`)}
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1))',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        marginBottom: '0.75rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <p style={{
                                        margin: 0,
                                        fontSize: '0.875rem',
                                        color: 'var(--text)',
                                        opacity: 0.7
                                    }}>
                                        Winner{winners.length > 1 ? 's' : ''}
                                    </p>
                                    <p style={{
                                        margin: '0.25rem 0 0 0',
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        color: '#f59e0b'
                                    }}>
                                        {winners.map(w => w.player).join(', ')} • {winners[0].total} strokes
                                    </p>
                                </div>
                            )}

                            {/* All Players - also clickable */}
                            <div
                                onClick={() => navigate(`/results/${game.id}`)}
                                style={{ marginTop: '0.75rem', cursor: 'pointer' }}
                            >
                                <p style={{
                                    margin: '0 0 0.5rem 0',
                                    fontSize: '0.875rem',
                                    color: 'var(--text)',
                                    opacity: 0.7,
                                    fontWeight: '500'
                                }}>
                                    Final Scores
                                </p>
                                <div style={{ display: 'grid', gap: '0.5rem' }}>
                                    {totals.map((t, idx) => (
                                        <div
                                            key={t.player}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '0.5rem 0.75rem',
                                                background: idx === 0 ? 'rgba(94, 234, 212, 0.1)' : 'rgba(100, 116, 139, 0.05)',
                                                borderRadius: '6px',
                                                borderLeft: idx === 0 ? '3px solid var(--mint)' : '3px solid transparent'
                                            }}
                                        >
                                            <span style={{
                                                color: 'var(--text)',
                                                fontWeight: idx === 0 ? 'bold' : 'normal'
                                            }}>
                                                {idx + 1}. {t.player}
                                            </span>
                                            <span style={{
                                                color: 'var(--mint)',
                                                fontWeight: 'bold',
                                                fontSize: '1.1rem'
                                            }}>
                                                {t.total}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Click hint */}
                            <p
                                onClick={() => navigate(`/results/${game.id}`)}
                                style={{
                                    margin: '0.75rem 0 0 0',
                                    fontSize: '0.75rem',
                                    color: 'var(--mint)',
                                    opacity: 0.7,
                                    textAlign: 'right',
                                    cursor: 'pointer'
                                }}
                            >
                                Click to view details →
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '1rem'
                    }}
                    onClick={() => !deleting && setDeleteConfirm(null)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'var(--card-bg)',
                            borderRadius: '16px',
                            padding: '2rem',
                            maxWidth: '400px',
                            width: '100%',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                            border: '1px solid rgba(239, 68, 68, 0.3)'
                        }}
                    >
                        <div style={{
                            fontSize: '3rem',
                            textAlign: 'center',
                            marginBottom: '1rem'
                        }}>
                            ⚠️
                        </div>
                        <h2 style={{
                            margin: '0 0 1rem 0',
                            color: 'var(--text)',
                            textAlign: 'center',
                            fontSize: '1.5rem'
                        }}>
                            Delete Game?
                        </h2>
                        <p style={{
                            margin: '0 0 1.5rem 0',
                            color: 'var(--text)',
                            opacity: 0.8,
                            textAlign: 'center',
                            lineHeight: '1.5'
                        }}>
                            Are you sure you want to delete <strong style={{ color: 'var(--mint)' }}>"{deleteConfirm.gameName}"</strong>?
                            <br />
                            <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                                This will also update player win counts.
                            </span>
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '0.75rem',
                            marginTop: '1.5rem'
                        }}>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                disabled={deleting}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(94, 234, 212, 0.3)',
                                    background: 'transparent',
                                    color: 'var(--mint)',
                                    fontWeight: 'bold',
                                    cursor: deleting ? 'not-allowed' : 'pointer',
                                    opacity: deleting ? 0.5 : 1
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteGame(deleteConfirm.gameId)}
                                disabled={deleting}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    cursor: deleting ? 'not-allowed' : 'pointer',
                                    opacity: deleting ? 0.5 : 1
                                }}
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* AdMob Banner Ad - History Page */}
            {/* <AdBanner adUnitId="ca-app-pub-5108646735858325/8100929442" position="BOTTOM_CENTER" /> */}
        </main>
    );
}
