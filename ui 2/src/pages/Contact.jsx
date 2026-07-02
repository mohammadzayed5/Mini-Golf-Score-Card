export default function Contact() {
    return (
        <main className="page" style={{ paddingBottom: '4rem' }}>
            <h1 className="title">Contact Us</h1>

            <div style={{
                maxWidth: '600px',
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
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📧</div>
                    <p style={{ fontSize: '1.125rem', margin: 0 }}>
                        We're here to help! Reach out with any questions, feedback, or concerns.
                    </p>
                </div>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        Get In Touch
                    </h2>
                    <div style={{
                        padding: '2rem',
                        background: 'var(--card-bg)',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        border: '2px solid rgba(94, 234, 212, 0.2)'
                    }}>
                        <p style={{ marginBottom: '1.5rem' }}>
                            For support, feedback, or general inquiries:
                        </p>
                        <div style={{ fontSize: '1.125rem' }}>
                            <strong style={{ color: 'var(--mint)' }}>Email:</strong>{' '}
                            <a
                                href="mailto:mohammadzayed521@gmail.com"
                                style={{
                                    color: 'var(--mint)',
                                    fontWeight: 'bold',
                                    textDecoration: 'underline'
                                }}
                            >
                                mohammadzayed521@gmail.com
                            </a>
                        </div>
                    </div>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        What Can We Help With?
                    </h2>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div style={{
                            padding: '1.25rem',
                            background: 'rgba(100, 116, 139, 0.05)',
                            borderRadius: '8px',
                            borderLeft: '3px solid var(--mint)'
                        }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', color: 'var(--text)' }}>
                                💡 Feature Requests
                            </h3>
                            <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.8 }}>
                                Have an idea for a new feature? We'd love to hear it!
                            </p>
                        </div>

                        <div style={{
                            padding: '1.25rem',
                            background: 'rgba(100, 116, 139, 0.05)',
                            borderRadius: '8px',
                            borderLeft: '3px solid var(--mint)'
                        }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', color: 'var(--text)' }}>
                                🐛 Bug Reports
                            </h3>
                            <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.8 }}>
                                Found a bug? Let us know so we can fix it quickly.
                            </p>
                        </div>

                        <div style={{
                            padding: '1.25rem',
                            background: 'rgba(100, 116, 139, 0.05)',
                            borderRadius: '8px',
                            borderLeft: '3px solid var(--mint)'
                        }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', color: 'var(--text)' }}>
                                ❓ Technical Support
                            </h3>
                            <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.8 }}>
                                Having trouble? We're here to help you get back on track.
                            </p>
                        </div>

                        <div style={{
                            padding: '1.25rem',
                            background: 'rgba(100, 116, 139, 0.05)',
                            borderRadius: '8px',
                            borderLeft: '3px solid var(--mint)'
                        }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', color: 'var(--text)' }}>
                                🔒 Privacy & Data
                            </h3>
                            <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.8 }}>
                                Questions about your data, privacy, or account deletion.
                            </p>
                        </div>

                        <div style={{
                            padding: '1.25rem',
                            background: 'rgba(100, 116, 139, 0.05)',
                            borderRadius: '8px',
                            borderLeft: '3px solid var(--mint)'
                        }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', color: 'var(--text)' }}>
                                ⭐ General Feedback
                            </h3>
                            <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.8 }}>
                                We love hearing how you're using the app and how we can improve!
                            </p>
                        </div>
                    </div>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        Response Time
                    </h2>
                    <p>
                        We typically respond to inquiries within <strong>24-48 hours</strong>. Please note that response
                        times may be longer during weekends and holidays.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        Before You Contact Us
                    </h2>
                    <p style={{ marginBottom: '1rem' }}>
                        You might find your answer faster in our resources:
                    </p>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                        <a
                            href="/help"
                            style={{
                                display: 'block',
                                padding: '1rem 1.5rem',
                                background: 'rgba(94, 234, 212, 0.1)',
                                border: '2px solid var(--mint)',
                                borderRadius: '8px',
                                color: 'var(--mint)',
                                textDecoration: 'none',
                                fontWeight: '600',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            📚 Help & FAQ →
                        </a>
                        <a
                            href="/privacy"
                            style={{
                                display: 'block',
                                padding: '1rem 1.5rem',
                                background: 'rgba(94, 234, 212, 0.1)',
                                border: '2px solid var(--mint)',
                                borderRadius: '8px',
                                color: 'var(--mint)',
                                textDecoration: 'none',
                                fontWeight: '600',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            🔒 Privacy Policy →
                        </a>
                        <a
                            href="/terms"
                            style={{
                                display: 'block',
                                padding: '1rem 1.5rem',
                                background: 'rgba(94, 234, 212, 0.1)',
                                border: '2px solid var(--mint)',
                                borderRadius: '8px',
                                color: 'var(--mint)',
                                textDecoration: 'none',
                                fontWeight: '600',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            📄 Terms of Service →
                        </a>
                    </div>
                </section>

                <div style={{
                    marginTop: '3rem',
                    padding: '2rem',
                    background: 'rgba(94, 234, 212, 0.1)',
                    borderRadius: '16px',
                    borderLeft: '4px solid var(--mint)',
                    textAlign: 'center'
                }}>
                    <p style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', fontWeight: 'bold' }}>
                        We Value Your Feedback!
                    </p>
                    <p style={{ margin: 0, opacity: 0.9 }}>
                        Your suggestions and feedback help us make Mini Golf Score Tracker better for everyone.
                        Thank you for being part of our community!
                    </p>
                </div>
            </div>
        </main>
    );
}
