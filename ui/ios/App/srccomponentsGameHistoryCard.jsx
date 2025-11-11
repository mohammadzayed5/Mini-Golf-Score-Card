import React from 'react';
import { Haptics } from '@capacitor/haptics';
import './GameHistoryCard.css';

function GameHistoryCard({ game, currentUser }) {
  const handleCardTap = async () => {
    await Haptics.impact({ style: 'light' });
    // Navigate to game results
    window.location.href = `/results/${game.id}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isWinner = () => {
    return game.winner && (
      game.winner.id === currentUser?.id || 
      game.winner.name === currentUser?.name
    );
  };

  const getPlayerScore = () => {
    if (currentUser && game.scores) {
      const playerScore = game.scores.find(score => 
        score.playerId === currentUser.id || score.playerName === currentUser.name
      );
      return playerScore?.totalScore || 'N/A';
    }
    return 'N/A';
  };

  const getTotalStrokes = () => {
    if (game.scores && game.scores.length > 0) {
      return game.scores.reduce((total, score) => total + (score.totalScore || 0), 0);
    }
    return 0;
  };

  return (
    <div className={`game-card ${isWinner() ? 'winner-card' : ''}`} onClick={handleCardTap}>
      <div className="game-card-header">
        <div className="game-info">
          <h3 className="course-name">{game.courseName || 'Unknown Course'}</h3>
          <div className="game-meta">
            <span className="game-date">{formatDate(game.createdAt || game.date)}</span>
            <span className="game-time">{formatTime(game.createdAt || game.date)}</span>
          </div>
        </div>
        {isWinner() && (
          <div className="winner-badge">
            <span className="crown-icon">👑</span>
          </div>
        )}
      </div>
      
      <div className="game-stats">
        <div className="stat-row">
          <div className="stat-item">
            <span className="stat-icon">👥</span>
            <div className="stat-content">
              <span className="stat-value">{game.players?.length || game.playerCount || 0}</span>
              <span className="stat-label">Players</span>
            </div>
          </div>
          
          <div className="stat-item">
            <span className="stat-icon">⛳</span>
            <div className="stat-content">
              <span className="stat-value">{game.holes || 18}</span>
              <span className="stat-label">Holes</span>
            </div>
          </div>
          
          <div className="stat-item">
            <span className="stat-icon">🏌️‍♂️</span>
            <div className="stat-content">
              <span className="stat-value">{getPlayerScore()}</span>
              <span className="stat-label">Your Score</span>
            </div>
          </div>
        </div>
      </div>

      {game.winner && (
        <div className="winner-info">
          <div className="winner-details">
            <span className="winner-label">Winner:</span>
            <span className="winner-name">{game.winner.name}</span>
            {game.winner.score && (
              <span className="winner-score">({game.winner.score})</span>
            )}
          </div>
        </div>
      )}

      <div className="card-footer">
        <div className="game-duration">
          {game.duration && (
            <span className="duration-text">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
              {game.duration}
            </span>
          )}
        </div>
        <div className="tap-hint">
          <span>Tap for details</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default GameHistoryCard;