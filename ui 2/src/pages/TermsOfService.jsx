export default function TermsOfService() {
    return (
        <main className="page" style={{ paddingBottom: '4rem' }}>
            <h1 className="title">Terms of Service</h1>

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
                        1. Acceptance of Terms
                    </h2>
                    <p>
                        By accessing or using Mini Golf Score Tracker ("the Service"), you agree to be bound by these Terms of
                        Service ("Terms"). If you do not agree to these Terms, please do not use the Service.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        2. Description of Service
                    </h2>
                    <p>
                        Mini Golf Score Tracker is a free application that allows users to:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>Track mini golf scores during gameplay</li>
                        <li style={{ marginBottom: '0.5rem' }}>Save game history and player statistics</li>
                        <li style={{ marginBottom: '0.5rem' }}>Manage custom courses and players</li>
                        <li style={{ marginBottom: '0.5rem' }}>View live leaderboards during games</li>
                        <li style={{ marginBottom: '0.5rem' }}>Use the service as a guest or registered user</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        3. User Accounts
                    </h2>
                    <p style={{ marginBottom: '1rem' }}>
                        You may use the Service in two ways:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <strong>Guest Mode:</strong> Use the app without creating an account. Your data is stored locally
                            and deleted when you close your browser.
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <strong>Registered Account:</strong> Create an account to save your game history permanently.
                            You are responsible for:
                            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                                <li style={{ marginBottom: '0.5rem' }}>Maintaining the security of your password</li>
                                <li style={{ marginBottom: '0.5rem' }}>All activities that occur under your account</li>
                                <li style={{ marginBottom: '0.5rem' }}>Notifying us of any unauthorized use</li>
                            </ul>
                        </li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        4. Acceptable Use
                    </h2>
                    <p style={{ marginBottom: '1rem' }}>
                        You agree NOT to:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>Use the Service for any illegal purpose</li>
                        <li style={{ marginBottom: '0.5rem' }}>Attempt to gain unauthorized access to our systems</li>
                        <li style={{ marginBottom: '0.5rem' }}>Interfere with or disrupt the Service</li>
                        <li style={{ marginBottom: '0.5rem' }}>Upload malicious code or viruses</li>
                        <li style={{ marginBottom: '0.5rem' }}>Harass, abuse, or harm other users</li>
                        <li style={{ marginBottom: '0.5rem' }}>Impersonate others or misrepresent your affiliation</li>
                        <li style={{ marginBottom: '0.5rem' }}>Use automated scripts or bots without permission</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        5. Intellectual Property
                    </h2>
                    <p>
                        The Service, including its design, code, graphics, and content, is owned by Mini Golf Score Tracker
                        and is protected by copyright and other intellectual property laws. You may not:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>Copy, modify, or distribute our code or content</li>
                        <li style={{ marginBottom: '0.5rem' }}>Reverse engineer or decompile the application</li>
                        <li style={{ marginBottom: '0.5rem' }}>Remove copyright or proprietary notices</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        6. User Content
                    </h2>
                    <p>
                        You retain ownership of any content you create in the Service (player names, course names, game data).
                        By using the Service, you grant us a license to store and display your content solely for the purpose
                        of providing the Service to you.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        7. Service Availability
                    </h2>
                    <p>
                        We strive to keep the Service available 24/7, but we do not guarantee uninterrupted access. We may:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>Perform maintenance and updates</li>
                        <li style={{ marginBottom: '0.5rem' }}>Modify or discontinue features</li>
                        <li style={{ marginBottom: '0.5rem' }}>Suspend access for violations of these Terms</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        8. Disclaimer of Warranties
                    </h2>
                    <p>
                        THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT
                        WARRANT THAT:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>The Service will be error-free or uninterrupted</li>
                        <li style={{ marginBottom: '0.5rem' }}>Defects will be corrected</li>
                        <li style={{ marginBottom: '0.5rem' }}>The Service is free of viruses or harmful components</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        9. Limitation of Liability
                    </h2>
                    <p>
                        TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                        SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF DATA, REVENUE, OR PROFITS, ARISING
                        FROM YOUR USE OF THE SERVICE.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        10. Third-Party Services
                    </h2>
                    <p>
                        The Service uses third-party services (Google Analytics, Google AdSense). Your use of these services
                        is subject to their respective terms and privacy policies. We are not responsible for the practices
                        of third-party services.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        11. Termination
                    </h2>
                    <p>
                        We may terminate or suspend your account at any time for violations of these Terms or for any other
                        reason at our discretion. You may delete your account at any time by contacting us.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        12. Changes to Terms
                    </h2>
                    <p>
                        We reserve the right to modify these Terms at any time. We will notify users of significant changes
                        by posting a notice on the Service. Continued use of the Service after changes constitutes acceptance
                        of the new Terms.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        13. Governing Law
                    </h2>
                    <p>
                        These Terms are governed by the laws of the United States. Any disputes shall be resolved in the
                        courts of competent jurisdiction.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--mint)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        14. Contact Information
                    </h2>
                    <p>
                        If you have questions about these Terms, please contact us:
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
                        By using Mini Golf Score Tracker, you acknowledge that you have read, understood, and agree to be
                        bound by these Terms of Service.
                    </p>
                </div>
            </div>
        </main>
    );
}
