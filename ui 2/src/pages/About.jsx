export default function About() {
    return (
        <main className="page" style={{ paddingBottom: '4rem' }}>
            <h1 className="title">About Mini Golf Score Tracker</h1>

            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                color: 'var(--text)',
                lineHeight: '1.8',
                fontSize: '1rem'
            }}>
                <div style={{
                    textAlign: 'center',
                    marginBottom: '3rem',
                    padding: '2rem',
                    background: 'linear-gradient(135deg, rgba(94, 234, 212, 0.1), rgba(20, 184, 166, 0.1))',
                    borderRadius: '16px'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⛳</div>
                    <p style={{ fontSize: '1.25rem', margin: 0 }}>
                        The simplest way to track your mini golf scores
                    </p>
                </div>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        What is Mini Golf Score Tracker?
                    </h2>
                    <p>
                        Mini Golf Score Tracker is a free, easy-to-use application designed to make tracking mini golf
                        scores effortless. Whether you're playing casually with friends or keeping track of your best
                        rounds, our app provides a simple and intuitive way to record every stroke.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        Key Features
                    </h2>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div style={{
                            padding: '1.5rem',
                            background: 'rgba(100, 116, 139, 0.05)',
                            borderRadius: '12px',
                            borderLeft: '4px solid var(--mint)'
                        }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--mint)' }}>
                                🎯 Live Scoring
                            </h3>
                            <p style={{ margin: 0 }}>
                                Track scores hole-by-hole with simple tap controls. Add or subtract strokes instantly
                                as you play.
                            </p>
                        </div>

                        <div style={{
                            padding: '1.5rem',
                            background: 'rgba(100, 116, 139, 0.05)',
                            borderRadius: '12px',
                            borderLeft: '4px solid var(--mint)'
                        }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--mint)' }}>
                                📊 Live Leaderboard
                            </h3>
                            <p style={{ margin: 0 }}>
                                Check current standings mid-game with our live leaderboard feature. See who's in the
                                lead at any time!
                            </p>
                        </div>

                        <div style={{
                            padding: '1.5rem',
                            background: 'rgba(100, 116, 139, 0.05)',
                            borderRadius: '12px',
                            borderLeft: '4px solid var(--mint)'
                        }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--mint)' }}>
                                📱 Works Everywhere
                            </h3>
                            <p style={{ margin: 0 }}>
                                Access from any device - mobile, tablet, or desktop. Available as a web app and native
                                iOS application.
                            </p>
                        </div>

                        <div style={{
                            padding: '1.5rem',
                            background: 'rgba(100, 116, 139, 0.05)',
                            borderRadius: '12px',
                            borderLeft: '4px solid var(--mint)'
                        }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--mint)' }}>
                                👥 Multiple Players
                            </h3>
                            <p style={{ margin: 0 }}>
                                Track scores for unlimited players in a single game. Perfect for groups of any size.
                            </p>
                        </div>

                        <div style={{
                            padding: '1.5rem',
                            background: 'rgba(100, 116, 139, 0.05)',
                            borderRadius: '12px',
                            borderLeft: '4px solid var(--mint)'
                        }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--mint)' }}>
                                🏆 Game History
                            </h3>
                            <p style={{ margin: 0 }}>
                                Create an account to save your game history and track player win statistics over time.
                            </p>
                        </div>

                        <div style={{
                            padding: '1.5rem',
                            background: 'rgba(100, 116, 139, 0.05)',
                            borderRadius: '12px',
                            borderLeft: '4px solid var(--mint)'
                        }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--mint)' }}>
                                🌟 Guest Mode
                            </h3>
                            <p style={{ margin: 0 }}>
                                Don't want to create an account? No problem! Use the app in guest mode with full
                                functionality.
                            </p>
                        </div>

                        <div style={{
                            padding: '1.5rem',
                            background: 'rgba(100, 116, 139, 0.05)',
                            borderRadius: '12px',
                            borderLeft: '4px solid var(--mint)'
                        }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--mint)' }}>
                                ⚡ Fast & Simple
                            </h3>
                            <p style={{ margin: 0 }}>
                                Built for speed and simplicity. No complicated setup - just start playing and scoring.
                            </p>
                        </div>
                    </div>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        How It Works
                    </h2>
                    <ol style={{ paddingLeft: '1.5rem', lineHeight: '2' }}>
                        <li><strong>Select or Create a Course:</strong> Choose from your saved courses or create a new one</li>
                        <li><strong>Add Players:</strong> Select players from your list or add new ones</li>
                        <li><strong>Start Scoring:</strong> Track each hole with simple +/- buttons</li>
                        <li><strong>View Leaderboard:</strong> Check live standings anytime during the game</li>
                        <li><strong>Finish & Celebrate:</strong> See final results with confetti for the winner!</li>
                    </ol>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        Who Is This For?
                    </h2>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: '2' }}>
                        <li>Families enjoying a day at the mini golf course</li>
                        <li>Friend groups who want to track their best rounds</li>
                        <li>Mini golf enthusiasts keeping personal statistics</li>
                        <li>Party organizers running mini golf tournaments</li>
                        <li>Anyone who wants a simple, hassle-free scoring solution</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        Why We Built This
                    </h2>
                    <p>
                        We created Mini Golf Score Tracker because we love mini golf, and we noticed that keeping track
                        of scores on paper scorecards can be cumbersome and easy to lose. We wanted a digital solution
                        that was:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem', lineHeight: '2' }}>
                        <li>Easy to use while playing</li>
                        <li>Accessible on any device</li>
                        <li>Free for everyone</li>
                        <li>Respectful of user privacy</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        Technology
                    </h2>
                    <p>
                        Mini Golf Score Tracker is built with modern web technologies including React, Vite, and Capacitor,
                        ensuring a fast, responsive experience across all platforms. We prioritize performance and user
                        experience above all else.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        Privacy & Security
                    </h2>
                    <p>
                        We take your privacy seriously. We collect only the minimal data necessary to provide the service,
                        and we never sell your information to third parties. Guest mode data is stored locally and never
                        leaves your device. Read our full <a href="/privacy" style={{ color: 'var(--mint)' }}>Privacy Policy</a> for details.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        Get Started
                    </h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        Ready to start tracking your mini golf scores? It's completely free!
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <a
                            href="/"
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
                            ⛳ Start New Game
                        </a>
                    </div>
                </section>

                <div style={{
                    marginTop: '3rem',
                    padding: '2rem',
                    background: 'rgba(94, 234, 212, 0.1)',
                    borderRadius: '16px',
                    textAlign: 'center'
                }}>
                    <h3 style={{ color: 'var(--mint)', marginBottom: '0.5rem' }}>
                        Questions or Feedback?
                    </h3>
                    <p style={{ margin: 0 }}>
                        We'd love to hear from you! Contact us at{' '}
                        <a href="mailto:mohammadzayed521@gmail.com" style={{ color: 'var(--mint)', fontWeight: 'bold' }}>
                            mohammadzayed521@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}
