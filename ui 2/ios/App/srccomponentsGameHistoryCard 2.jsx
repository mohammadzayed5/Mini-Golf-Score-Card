import React from 'react';
import { Haptics } from '@capacitor/haptics';
import './GameHistoryCard.css';

function GameHistoryCard({ game, currentUser }) {
  const handleCardTap = async () => {
    try {
      await Haptics.impact({ style: 'light' });
      // Navigate to game details or results
      window.location.href = `/results/${game.id}`;
    } catch (error) {
      // Haptics might fail in browser - just navigate
      window.location.href = `/results/${game.id}`;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const isWinner = game.winner && (
    game.winner.id === currentUser?.id || 
    game.winner.name === currentUser?.name
  );

  return (
    <div className={`game-card ${isWinner ? 'winner-card' : ''}`} onClick={handleCardTap}>
      <div className="game-header">
        <h3 className="course-name">{game.courseName || 'Mini Golf Course'}</h3>
        <span className="game-date">{formatDate(game.createdAt || game.date || new Date())}</span>
      </div>
      
      <div className="game-stats">
        <div className="stat">
          <span className="stat-label">Players</span>
          <span className="stat-value">{game.players?.length || 0}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Holes</span>
          <span className="stat-value">{game.holes || 18}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Winner</span>
          <span className="stat-value">{game.winner?.name || 'TBD'}</span>
        </div>
      </div>

      {isWinner && (
        <div className="winner-badge">
          <span className="trophy-icon">🏆</span>
          <span>You Won!</span>
        </div>
      )}

      <div className="card-arrow">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
        </svg>
      </div>
    </div>
  );
}

export default GameHistoryCard;