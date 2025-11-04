import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer style={{
            borderTop: '1px solid rgba(94, 234, 212, 0.15)',
            padding: '1.25rem 1rem',
            marginTop: '3rem',
            textAlign: 'center'
        }}>
            {/* Links in a single compact line */}
            <nav style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem 1rem',
                marginBottom: '0.75rem',
                fontSize: '0.813rem'
            }}>
                <Link to="/about" style={{ color: 'var(--mint)', textDecoration: 'none', opacity: 0.85 }}>
                    About
                </Link>
                <span style={{ opacity: 0.3 }}>•</span>
                <Link to="/help" style={{ color: 'var(--mint)', textDecoration: 'none', opacity: 0.85 }}>
                    Help
                </Link>
                <span style={{ opacity: 0.3 }}>•</span>
                <Link to="/contact" style={{ color: 'var(--mint)', textDecoration: 'none', opacity: 0.85 }}>
                    Contact
                </Link>
                <span style={{ opacity: 0.3 }}>•</span>
                <Link to="/privacy" style={{ color: 'var(--mint)', textDecoration: 'none', opacity: 0.85 }}>
                    Privacy
                </Link>
                <span style={{ opacity: 0.3 }}>•</span>
                <Link to="/terms" style={{ color: 'var(--mint)', textDecoration: 'none', opacity: 0.85 }}>
                    Terms
                </Link>
            </nav>

            {/* Copyright */}
            <p style={{
                margin: 0,
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.75rem'
            }}>
                © {new Date().getFullYear()} Mini Golf Score Tracker
            </p>
        </footer>
    );
}
