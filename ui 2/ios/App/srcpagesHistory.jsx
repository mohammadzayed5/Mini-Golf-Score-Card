import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Haptics } from '@capacitor/haptics';
import { StatusBar } from '@capacitor/status-bar';
import { Share } from '@capacitor/share';
import { Preferences } from '@capacitor/preferences';
import AuthPrompt from '../components/AuthPrompt';
import GameHistoryCard from '../components/GameHistoryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './History.css';

function History() {
  const { isAuthenticated, user } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Set iOS status bar style for this page
    StatusBar.setStyle({ style: 'dark' });
    
    if (isAuthenticated) {
      loadGameHistory();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadGameHistory = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        // Add haptic feedback for pull-to-refresh
        await Haptics.impact({ style: 'light' });
      } else {
        setIsLoading(true);
      }

      // Try to get cached data first for faster loading
      const cachedData = await Preferences.get({ key: 'gameHistory' });
      if (cachedData.value && !isRefresh) {
        setGameHistory(JSON.parse(cachedData.value));
      }

      // Fetch fresh data from API
      const token = await Preferences.get({ key: 'authToken' });
      const response = await fetch('/api/games/history', {
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setGameHistory(data);
        // Cache the fresh data
        await Preferences.set({ 
          key: 'gameHistory', 
          value: JSON.stringify(data) 
        });
      } else {
        throw new Error('Failed to load game history');
      }
    } catch (error) {
      console.error('Failed to load game history:', error);
      // Show native iOS alert
      if (window.Capacitor?.Plugins?.Dialog) {
        await window.Capacitor.Plugins.Dialog.alert({
          title: 'Error',
          message: 'Failed to load game history. Please try again.'
        });
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleAuthPromptOpen = async () => {
    // Add haptic feedback for iOS
    await Haptics.impact({ style: 'light' });
    setShowAuthPrompt(true);
  };

  const handleRefresh = () => {
    if (!refreshing && isAuthenticated) {
      loadGameHistory(true);
    }
  };

  const shareGameHistory = async () => {
    try {
      await Haptics.impact({ style: 'medium' });
      
      const totalGames = gameHistory.length;
      const wins = gameHistory.filter(game => 
        game.winner?.id === user?.id || game.winner?.name === user?.name
      ).length;
      
      await Share.share({
        title: 'My Mini Golf Progress',
        text: `I've played ${totalGames} games and won ${wins} times on Mini Golf Score Tracker! 🏌️‍♂️`,
        url: 'https://minigolfscoretracker.com',
        dialogTitle: 'Share your mini golf progress'
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  if (isAuthenticated) {
    return (
      <main className="page history-page">
        <div className="page-header">
          <h1 className="title">History</h1>
          {gameHistory.length > 0 && (
            <button 
              className="share-button"
              onClick={shareGameHistory}
              aria-label="Share game history"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
              </svg>
            </button>
          )}
        </div>
        
        {isLoading ? (
          <LoadingSpinner message="Loading your game history..." />
        ) : gameHistory.length > 0 ? (
          <div className="history-content">
            <div className="stats-summary">
              <div className="stat-card">
                <span className="stat-number">{gameHistory.length}</span>
                <span className="stat-label">Games Played</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">
                  {gameHistory.filter(game => 
                    game.winner?.id === user?.id || game.winner?.name === user?.name
                  ).length}
                </span>
                <span className="stat-label">Games Won</span>
              </div>
            </div>
            
            <div className="pull-to-refresh" onClick={handleRefresh}>
              {refreshing ? (
                <div className="refresh-spinner"></div>
              ) : (
                <span className="refresh-text">Pull to refresh</span>
              )}
            </div>
            
            <div className="history-list">
              {gameHistory.map((game) => (
                <GameHistoryCard 
                  key={game.id} 
                  game={game} 
                  currentUser={user}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🏌️‍♂️</div>
            <h3>No Games Yet</h3>
            <p>Start playing to see your game history here!</p>
            <button 
              className="primary-button"
              onClick={() => window.location.href = '/'}
            >
              Start Your First Game
            </button>
          </div>
        )}
      </main>
    );
  }

  // Unauthenticated state with iOS design
  return (
    <>
      <main className="page history-page">
        <h1 className="title">History</h1>
        <div className="auth-prompt-card">
          <div className="auth-prompt-content">
            <div className="lock-icon">🔒</div>
            <h2>Login Required</h2>
            <p>Create an account to track your game history and progress over time!</p>
            <div className="auth-features">
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Track your scores</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🏆</span>
                <span>See your wins</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📈</span>
                <span>Monitor progress</span>
              </div>
            </div>
            <button 
              onClick={handleAuthPromptOpen}
              className="primary-button glass-button"
            >
              Sign In / Create Account
            </button>
          </div>
        </div>
      </main>
      {showAuthPrompt && (
        <AuthPrompt 
          onClose={() => setShowAuthPrompt(false)} 
          redirectTo="/history" 
        />
      )}
    </>
  );
}

export default History;