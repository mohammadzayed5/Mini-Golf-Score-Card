import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPrompt({ onClose, redirectTo = '/' }) {
    const [mode, setMode] = useState('prompt'); // 'prompt', 'login', 'register'
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let result;

            if (mode === 'login') {
                result = await login(formData.username, formData.password);
            } else if (mode === 'register') {
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    setLoading(false);
                    return;
                }
                if (formData.password.length < 6) {
                    setError('Password must be at least 6 characters');
                    setLoading(false);
                    return;
                }
                result = await register(formData.username, formData.password);
            }

            if (result.success) {
                navigate(redirectTo);
                onClose();
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleGuestMode = () => {
        navigate(redirectTo);
        onClose();
    };

    if (mode === 'prompt') {
        return (
            <div className="auth-overlay">
                <div className="auth-modal">
                    <button className="close-btn" onClick={onClose}>×</button>

                    <div className="auth-prompt-content">
                        <h2>Save Your Progress</h2>
                        <p>Create an account to save your games, players, and track your mini golf history!</p>

                        <div className="auth-options">
                            <button
                                className="cta primary"
                                onClick={() => setMode('register')}
                            >
                                Create Account
                            </button>

                            <button
                                className="cta"
                                onClick={() => setMode('login')}
                            >
                                Sign In
                            </button>

                            <button
                                className="cta secondary"
                                onClick={handleGuestMode}
                            >
                                Continue as Guest
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-overlay">
            <div className="auth-modal">
                <button className="close-btn" onClick={onClose}>×</button>

                <div className="auth-form-content">
                    <h2>{mode === 'login' ? 'Welcome Back!' : 'Create Account'}</h2>
                    <p>{mode === 'login' ? 'Sign in to your account' : 'Join Mini Golf Score Tracker'}</p>

                    <form onSubmit={handleSubmit}>
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                minLength="3"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                minLength="6"
                            />
                        </div>

                        {mode === 'register' && (
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    minLength="6"
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="cta primary"
                            disabled={loading}
                        >
                            {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    <div className="auth-switch">
                        {mode === 'login' ? (
                            <p>Don't have an account?
                                <button
                                    type="button"
                                    className="link-btn"
                                    onClick={() => setMode('register')}
                                >
                                    Sign up
                                </button>
                            </p>
                        ) : (
                            <p>Already have an account?
                                <button
                                    type="button"
                                    className="link-btn"
                                    onClick={() => setMode('login')}
                                >
                                    Sign in
                                </button>
                            </p>
                        )}

                        <button
                            type="button"
                            className="link-btn"
                            onClick={handleGuestMode}
                        >
                            Continue as Guest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}