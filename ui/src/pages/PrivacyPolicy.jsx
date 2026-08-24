const CANONICAL_URL = 'https://minigolfscoretracker.com/privacy';

/**
 * Summary only, on purpose.
 *
 * The full policy lives at minigolfscoretracker.com/privacy and is the single
 * source of truth. This page used to carry a second full copy, which drifted
 * until it made four claims that were no longer true (that the iOS app had no
 * ads, that guest data cleared when you closed the browser, that nothing was
 * shared with third parties, and a "last updated" date generated from
 * new Date() that reset itself daily).
 *
 * Keep this page to broad statements that cannot contradict the canonical
 * policy. Anything specific belongs there, not here.
 */
export default function PrivacyPolicy() {
    return (
        <main className="page" style={{ paddingBottom: '4rem' }}>
            <h1 className="title">Privacy Policy</h1>

            <div style={{
                maxWidth: '700px',
                margin: '0 auto',
                color: 'var(--text)',
                lineHeight: '1.8',
                fontSize: '1rem'
            }}>
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        The short version
                    </h2>
                    <ul style={{ paddingLeft: '1.25rem' }}>
                        <li>We never ask for your email address. There is no email field anywhere.</li>
                        <li>Your username is whatever you type. It does not have to be your real name.</li>
                        <li>You can use the whole app without making an account.</li>
                        <li>Ads run on the iPhone app and on the guide articles on our website.</li>
                        <li>Analytics are not connected to your username or your scores.</li>
                        <li>Everything is stored on servers in the United States.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        About the names you enter
                    </h2>
                    <p>
                        The app stores player names exactly as you type them, and those are
                        usually other people. First names or nicknames are plenty. If a name
                        of yours or your child&apos;s is in someone&apos;s scorecard and you want it
                        removed, email us and it will be deleted.
                    </p>
                </section>

                <section style={{
                    marginBottom: '2rem',
                    padding: '1.5rem',
                    background: 'var(--card-bg)',
                    borderRadius: '12px',
                    border: '2px solid rgba(94, 234, 212, 0.2)'
                }}>
                    <p style={{ margin: '0 0 1rem 0' }}>
                        The full policy covers what we collect, how ads and analytics work,
                        where your data lives, and how to delete it.
                    </p>
                    <a
                        href={CANONICAL_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: 'var(--mint)',
                            fontWeight: 'bold',
                            fontSize: '1.125rem',
                            textDecoration: 'underline'
                        }}
                    >
                        Read the full Privacy Policy →
                    </a>
                </section>

                <section>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        Questions
                    </h2>
                    <p>
                        Email{' '}
                        <a
                            href="mailto:support@minigolfscoretracker.com"
                            style={{ color: 'var(--mint)', fontWeight: 'bold' }}
                        >
                            support@minigolfscoretracker.com
                        </a>
                        .
                    </p>
                </section>
            </div>
        </main>
    );
}
