import { useState } from 'react';

export default function Help() {
    const [openFAQ, setOpenFAQ] = useState(null);

    const faqs = [
        {
            question: "How do I start a new game?",
            answer: "Click 'Start New Game' on the home page, select a course (or create one), choose your players, and start scoring! It's that simple."
        },
        {
            question: "Do I need to create an account?",
            answer: "No! You can use the app in Guest Mode without creating an account. However, creating an account allows you to save your game history permanently and track player statistics over time."
        },
        {
            question: "What's the difference between Guest Mode and a registered account?",
            answer: "Guest Mode stores your data locally in your browser session - it's deleted when you close the browser. A registered account saves your games, players, and courses to our database so you can access them from any device anytime."
        },
        {
            question: "How do I track scores during a game?",
            answer: "Use the + and - buttons to adjust each player's score for the current hole. Click the number in the middle to reset it to zero. Navigate between holes using the Previous/Next buttons at the top."
        },
        {
            question: "Can I see the leaderboard mid-game?",
            answer: "Yes! Click the 'View Leaderboard' button at the bottom of the scoring screen to see live standings at any time during your game."
        },
        {
            question: "How many players can I add to a game?",
            answer: "You can add as many players as you want! There's no limit. Perfect for large groups and tournaments."
        },
        {
            question: "Can I create custom courses?",
            answer: "Absolutely! Go to the Courses page and click 'Add Course'. You can specify the course name and number of holes (1-36)."
        },
        {
            question: "How do I view my past games?",
            answer: "If you have an account, go to the History tab to see all your previous games with scores and winners. Guest mode games are not saved permanently."
        },
        {
            question: "Can I edit or delete a game after it's finished?",
            answer: "Currently, you can view past games but not edit them. If you need to delete your game history, please contact us. We're working on adding edit/delete features!"
        },
        {
            question: "Is my data secure?",
            answer: "Yes! Your password is encrypted using industry-standard PBKDF2-HMAC-SHA256 hashing. We use secure JWT tokens for authentication, and we never share your data with third parties."
        },
        {
            question: "Can I use this app offline?",
            answer: "Guest mode works offline for the current session. However, you'll need an internet connection to save games to your account or load previously saved games."
        },
        {
            question: "Does the app work on mobile devices?",
            answer: "Yes! The app works on all devices - smartphones, tablets, and desktop computers. We also have a native iOS app available."
        },
        {
            question: "How do I delete my account?",
            answer: "If you'd like to delete your account and all associated data, please email us at mohammadzayed521@gmail.com and we'll process your request within 48 hours."
        },
        {
            question: "Why do I see ads?",
            answer: "We display ads on the web version to keep the app free for everyone. The iOS mobile app does not display any advertisements."
        },
        {
            question: "Can I share my game results?",
            answer: "Yes! After finishing a game, you'll see a 'Share Results' button that allows you to share the final standings via your device's share options or copy to clipboard."
        },
        {
            question: "What if I accidentally close the app during a game?",
            answer: "Don't worry! Your current game progress is automatically saved. For registered users, just navigate back to the game. For guest users, your progress is saved in your browser session as long as you don't close the browser tab."
        },
        {
            question: "Can I track statistics for individual players?",
            answer: "Yes! Each player has a win counter that increases when they win a game. We're working on adding more detailed statistics in future updates."
        },
        {
            question: "Is the app really free?",
            answer: "Yes, completely free! There are no hidden costs, subscriptions, or premium features. Everyone gets full access to all features."
        }
    ];

    return (
        <main className="page" style={{ paddingBottom: '4rem' }}>
            <h1 className="title">Help & FAQ</h1>

            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                color: 'var(--text)'
            }}>
                <div style={{
                    textAlign: 'center',
                    marginBottom: '3rem',
                    padding: '2rem',
                    background: 'linear-gradient(135deg, rgba(94, 234, 212, 0.1), rgba(20, 184, 166, 0.1))',
                    borderRadius: '16px'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❓</div>
                    <p style={{ fontSize: '1.125rem', margin: 0, lineHeight: '1.6' }}>
                        Find answers to common questions about Mini Golf Score Tracker
                    </p>
                </div>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                        Frequently Asked Questions
                    </h2>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                style={{
                                    background: 'var(--card-bg)',
                                    borderRadius: '12px',
                                    border: '2px solid rgba(94, 234, 212, 0.2)',
                                    overflow: 'hidden',
                                    boxShadow: openFAQ === idx ? '0 4px 16px rgba(20, 184, 166, 0.2)' : '0 2px 8px rgba(0,0,0,0.05)'
                                }}
                            >
                                <button
                                    onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                                    style={{
                                        width: '100%',
                                        padding: '1.25rem 1.5rem',
                                        background: 'transparent',
                                        border: 'none',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        fontSize: '1.05rem',
                                        fontWeight: '600',
                                        color: 'var(--text)',
                                        transition: 'background 0.2s ease'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(94, 234, 212, 0.05)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <span>{faq.question}</span>
                                    <span style={{
                                        fontSize: '1.5rem',
                                        color: 'var(--mint)',
                                        transition: 'transform 0.2s ease',
                                        transform: openFAQ === idx ? 'rotate(180deg)' : 'rotate(0deg)'
                                    }}>
                                        ⌄
                                    </span>
                                </button>
                                {openFAQ === idx && (
                                    <div style={{
                                        padding: '0 1.5rem 1.25rem 1.5rem',
                                        lineHeight: '1.7',
                                        fontSize: '0.975rem',
                                        opacity: 0.9,
                                        borderTop: '1px solid rgba(94, 234, 212, 0.1)',
                                        paddingTop: '1rem'
                                    }}>
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        Quick Start Guide
                    </h2>
                    <div style={{
                        padding: '1.5rem',
                        background: 'rgba(100, 116, 139, 0.05)',
                        borderRadius: '12px',
                        borderLeft: '4px solid var(--mint)'
                    }}>
                        <ol style={{ paddingLeft: '1.5rem', lineHeight: '2', margin: 0 }}>
                            <li><strong>Start:</strong> Click "Start New Game" on the home page</li>
                            <li><strong>Course:</strong> Select or create a course</li>
                            <li><strong>Players:</strong> Choose players or add new ones</li>
                            <li><strong>Score:</strong> Use +/- buttons to track each hole</li>
                            <li><strong>Leaderboard:</strong> Click "View Leaderboard" anytime</li>
                            <li><strong>Finish:</strong> Complete all holes and see results!</li>
                        </ol>
                    </div>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        Tips & Tricks
                    </h2>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div style={{
                            padding: '1.25rem',
                            background: 'rgba(94, 234, 212, 0.08)',
                            borderRadius: '8px'
                        }}>
                            <p style={{ margin: 0 }}>
                                <strong style={{ color: 'var(--mint)' }}>💡 Tip:</strong> Create an account to save your game history and access it from any device!
                            </p>
                        </div>
                        <div style={{
                            padding: '1.25rem',
                            background: 'rgba(94, 234, 212, 0.08)',
                            borderRadius: '8px'
                        }}>
                            <p style={{ margin: 0 }}>
                                <strong style={{ color: 'var(--mint)' }}>💡 Tip:</strong> Click the score number to quickly reset it to zero if you made a mistake.
                            </p>
                        </div>
                        <div style={{
                            padding: '1.25rem',
                            background: 'rgba(94, 234, 212, 0.08)',
                            borderRadius: '8px'
                        }}>
                            <p style={{ margin: 0 }}>
                                <strong style={{ color: 'var(--mint)' }}>💡 Tip:</strong> Use the live leaderboard to build excitement during close games!
                            </p>
                        </div>
                        <div style={{
                            padding: '1.25rem',
                            background: 'rgba(94, 234, 212, 0.08)',
                            borderRadius: '8px'
                        }}>
                            <p style={{ margin: 0 }}>
                                <strong style={{ color: 'var(--mint)' }}>💡 Tip:</strong> The app works great on phones - no need to carry a scorecard!
                            </p>
                        </div>
                    </div>
                </section>

                <div style={{
                    marginTop: '3rem',
                    padding: '2rem',
                    background: 'linear-gradient(135deg, rgba(94, 234, 212, 0.1), rgba(20, 184, 166, 0.1))',
                    borderRadius: '16px',
                    textAlign: 'center'
                }}>
                    <h3 style={{ color: 'var(--mint)', marginBottom: '0.75rem', fontSize: '1.25rem' }}>
                        Still Have Questions?
                    </h3>
                    <p style={{ margin: '0 0 1.5rem 0', opacity: 0.9 }}>
                        We're here to help! Contact us anytime.
                    </p>
                    <a
                        href="/contact"
                        style={{
                            display: 'inline-block',
                            padding: '0.875rem 2rem',
                            background: 'linear-gradient(135deg, #5eead4, #14b8a6)',
                            color: 'white',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 15px rgba(20, 184, 166, 0.3)'
                        }}
                    >
                        📧 Contact Us
                    </a>
                </div>
            </div>
        </main>
    );
}
