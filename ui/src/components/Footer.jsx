import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer style={{
            background: 'var(--card-bg)',
            borderTop: '1px solid rgba(94, 234, 212, 0.2)',
            padding: '2.5rem 1.5rem 2rem',
            marginTop: 'auto'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '2rem',
                marginBottom: '2rem'
            }}>
                {/* About Section */}
                <div>
                    <h3 style={{
                        color: 'var(--mint)',
                        fontSize: '1.125rem',
                        marginBottom: '0.75rem',
                        fontWeight: 'bold'
                    }}>
                        Mini Golf Score Tracker
                    </h3>
                    <p style={{
                        margin: 0,
                        fontSize: '0.9rem',
                        lineHeight: '1.6',
                        opacity: 0.8
                    }}>
                        The simplest way to track your mini golf scores. Free, fast, and easy to use.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 style={{
                        color: 'var(--text)',
                        fontSize: '1rem',
                        marginBottom: '0.75rem',
                        fontWeight: '600'
                    }}>
                        Quick Links
                    </h4>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Link to="/" style={{ color: 'var(--text)', opacity: 0.8, textDecoration: 'none', fontSize: '0.9rem' }}>
                            Home
                        </Link>
                        <Link to="/about" style={{ color: 'var(--text)', opacity: 0.8, textDecoration: 'none', fontSize: '0.9rem' }}>
                            About
                        </Link>
                        <Link to="/help" style={{ color: 'var(--text)', opacity: 0.8, textDecoration: 'none', fontSize: '0.9rem' }}>
                            Help & FAQ
                        </Link>
                        <Link to="/contact" style={{ color: 'var(--text)', opacity: 0.8, textDecoration: 'none', fontSize: '0.9rem' }}>
                            Contact Us
                        </Link>
                    </nav>
                </div>

                {/* Legal */}
                <div>
                    <h4 style={{
                        color: 'var(--text)',
                        fontSize: '1rem',
                        marginBottom: '0.75rem',
                        fontWeight: '600'
                    }}>
                        Legal
                    </h4>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Link to="/privacy" style={{ color: 'var(--text)', opacity: 0.8, textDecoration: 'none', fontSize: '0.9rem' }}>
                            Privacy Policy
                        </Link>
                        <Link to="/terms" style={{ color: 'var(--text)', opacity: 0.8, textDecoration: 'none', fontSize: '0.9rem' }}>
                            Terms of Service
                        </Link>
                    </nav>
                </div>

                {/* Support */}
                <div>
                    <h4 style={{
                        color: 'var(--text)',
                        fontSize: '1rem',
                        marginBottom: '0.75rem',
                        fontWeight: '600'
                    }}>
                        Support
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                        <a
                            href="mailto:mohammadzayed521@gmail.com"
                            style={{ color: 'var(--text)', opacity: 0.8, textDecoration: 'none' }}
                        >
                            mohammadzayed521@gmail.com
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div style={{
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(94, 234, 212, 0.1)',
                textAlign: 'center',
                color: 'var(--text)',
                opacity: 0.6,
                fontSize: '0.875rem'
            }}>
                <p style={{ margin: 0 }}>
                    © {new Date().getFullYear()} Mini Golf Score Tracker. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
