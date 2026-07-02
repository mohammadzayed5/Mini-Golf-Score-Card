import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AccountSettings.css';

export default function AccountSettings() {
    const { user, deleteAccount } = useAuth();
    const navigate = useNavigate();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');

    const handleDeleteRequest = () => {
        setShowConfirmation(true);
        setError('');
    };

    const handleCancelDelete = () => {
        setShowConfirmation(false);
        setError('');
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        setError('');

        try {
            const result = await deleteAccount();

            if (result.success) {
                // Account deleted successfully, user will be logged out
                // and redirected by the AuthContext
                navigate('/');
            } else {
                setError(result.error || 'Failed to delete account. Please try again.');
                setIsDeleting(false);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            setIsDeleting(false);
        }
    };

    return (
        <div className="account-settings-container">
            <div className="account-settings-content">
                <h1>Account Settings</h1>

                <div className="account-info">
                    <h2>Account Information</h2>
                    <div className="info-item">
                        <span className="info-label">Username:</span>
                        <span className="info-value">{user?.username}</span>
                    </div>
                </div>

                <div className="danger-zone">
                    <h2>Warning!</h2>
                    <p className="warning-text">
                        Deleting your account is permanent and cannot be undone.
                        All your data including game history, players, and courses will be permanently deleted.
                    </p>

                    {!showConfirmation ? (
                        <button
                            onClick={handleDeleteRequest}
                            className="delete-button"
                            disabled={isDeleting}
                        >
                            Delete Account
                        </button>
                    ) : (
                        <div className="confirmation-box">
                            <p className="confirmation-text">
                                Are you absolutely sure? This action cannot be undone.
                            </p>
                            <div className="confirmation-buttons">
                                <button
                                    onClick={handleConfirmDelete}
                                    className="confirm-delete-button"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
                                </button>
                                <button
                                    onClick={handleCancelDelete}
                                    className="cancel-button"
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
