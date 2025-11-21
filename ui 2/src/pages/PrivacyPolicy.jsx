export default function PrivacyPolicy() {
    return (
        <main className="page" style={{ paddingBottom: '4rem' }}>
            <h1 className="title">Privacy Policy</h1>

            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                color: 'var(--text)',
                lineHeight: '1.8',
                fontSize: '1rem'
            }}>
                <p style={{ opacity: 0.7, marginBottom: '2rem' }}>
                    <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        1. Introduction
                    </h2>
                    <p>
                        Welcome to Mini Golf Score Tracker ("we," "our," or "us"). We are committed to protecting your privacy.
                        This Privacy Policy explains how we collect, use, and safeguard your information when you use our mini
                        golf scoring application.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        2. Information We Collect
                    </h2>
                    <p style={{ marginBottom: '1rem' }}>
                        We collect minimal information necessary to provide our service:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <strong>Account Information:</strong> When you create an account, we collect your username and
                            encrypted password.
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <strong>Game Data:</strong> Player names, scores, courses, and game history that you create within the app.
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <strong>Usage Data:</strong> We use Google Analytics to understand how users interact with our app,
                            including pages visited and features used (web version only).
                        </li>
                    </ul>
                    <p>
                        <strong>Guest Mode:</strong> If you use our app without creating an account, your data is stored locally
                        in your browser's session storage and is automatically deleted when you close your browser.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        3. How We Use Your Information
                    </h2>
                    <p style={{ marginBottom: '1rem' }}>
                        We use your information to:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>Provide and maintain our scoring service</li>
                        <li style={{ marginBottom: '0.5rem' }}>Save your game history and player statistics</li>
                        <li style={{ marginBottom: '0.5rem' }}>Authenticate your account and secure your data</li>
                        <li style={{ marginBottom: '0.5rem' }}>Improve our app based on usage patterns</li>
                        <li style={{ marginBottom: '0.5rem' }}>Display relevant advertisements (web version only)</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        4. Data Storage and Security
                    </h2>
                    <p style={{ marginBottom: '1rem' }}>
                        Your data security is important to us:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>
                            Passwords are encrypted using industry-standard PBKDF2-HMAC-SHA256 hashing
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            Authentication uses secure JWT tokens with 24-hour expiration
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            Data is stored securely in our database with access controls
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            We do not sell, trade, or share your personal information with third parties
                        </li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        5. Third-Party Services
                    </h2>
                    <p style={{ marginBottom: '1rem' }}>
                        We use the following third-party services:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <strong>Google Analytics:</strong> To understand app usage and improve user experience
                            (web version only). View <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--mint)' }}>Google's Privacy Policy</a>.
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <strong>Google AdSense:</strong> To display advertisements (web version only).
                            View <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--mint)' }}>Google's Ad Privacy Policy</a>.
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <strong>Google AdMob:</strong> To display advertisements in our iOS mobile app.
                            AdMob may collect device identifiers and usage data to serve ads.
                            View <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--mint)' }}>Google's Ad Privacy Policy</a>.
                        </li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        5a. Advertising and Your Choices
                    </h2>
                    <p style={{ marginBottom: '1rem' }}>
                        We use Google AdMob to display advertisements in our iOS app. These ads help support the free version of our app.
                    </p>
                    <p style={{ marginBottom: '1rem' }}>
                        <strong>Personalized Ads:</strong> With your consent, Google may use your data to show you personalized advertisements based on your interests. This includes:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>Device advertising identifiers</li>
                        <li style={{ marginBottom: '0.5rem' }}>Browsing and app usage history</li>
                        <li style={{ marginBottom: '0.5rem' }}>Location data (if permitted)</li>
                    </ul>
                    <p style={{ marginBottom: '1rem' }}>
                        <strong>Non-Personalized Ads:</strong> If you do not consent to personalized ads, you will still see advertisements, but they will not be tailored to your interests.
                    </p>
                    <p style={{ marginBottom: '1rem' }}>
                        <strong>Managing Your Ad Preferences:</strong>
                    </p>
                    <ul style={{ paddingLeft: '1.5rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <strong>iOS Users:</strong> You can reset your Advertising Identifier or enable "Limit Ad Tracking" in your device Settings → Privacy → Tracking.
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <strong>Withdraw Consent:</strong> To change your ad consent preferences, you can reset the app data or reinstall the app to see the consent prompt again.
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <strong>Google Ad Settings:</strong> Visit <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--mint)' }}>Google Ad Settings</a> to manage your ad personalization preferences across Google services.
                        </li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        6. Cookies and Tracking
                    </h2>
                    <p>
                        We use cookies and similar tracking technologies to:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>Maintain your login session</li>
                        <li style={{ marginBottom: '0.5rem' }}>Remember your preferences</li>
                        <li style={{ marginBottom: '0.5rem' }}>Analyze site traffic and usage (Google Analytics)</li>
                        <li style={{ marginBottom: '0.5rem' }}>Serve personalized advertisements (Google AdSense)</li>
                    </ul>
                    <p style={{ marginTop: '1rem' }}>
                        You can control cookies through your browser settings.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        7. Your Rights
                    </h2>
                    <p style={{ marginBottom: '1rem' }}>
                        You have the right to:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>Access your personal data</li>
                        <li style={{ marginBottom: '0.5rem' }}>Delete your account and all associated data</li>
                        <li style={{ marginBottom: '0.5rem' }}>Request data export</li>
                        <li style={{ marginBottom: '0.5rem' }}>Opt-out of analytics tracking</li>
                    </ul>
                    <p style={{ marginTop: '1rem' }}>
                        To exercise these rights, please contact us at <a href="mailto:mohammadzayed521@gmail.com" style={{ color: 'var(--mint)' }}>mohammadzayed521@gmail.com</a>.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        8. Children's Privacy
                    </h2>
                    <p>
                        Our service is not directed to children under 13. We do not knowingly collect personal information
                        from children under 13. If you are a parent or guardian and believe your child has provided us with
                        personal information, please contact us.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        9. Changes to This Policy
                    </h2>
                    <p>
                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting
                        the new Privacy Policy on this page and updating the "Last Updated" date.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        10. Contact Us
                    </h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at:
                    </p>
                    <p style={{ marginTop: '1rem' }}>
                        <strong>Email:</strong> <a href="mailto:mohammadzayed521@gmail.com" style={{ color: 'var(--mint)' }}>mohammadzayed521@gmail.com</a>
                    </p>
                </section>

                <div style={{
                    marginTop: '3rem',
                    padding: '1.5rem',
                    background: 'rgba(94, 234, 212, 0.1)',
                    borderRadius: '12px',
                    borderLeft: '4px solid var(--mint)'
                }}>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>
                        By using Mini Golf Score Tracker, you agree to this Privacy Policy.
                    </p>
                </div>
            </div>
        </main>
    );
}
