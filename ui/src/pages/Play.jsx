import { useEffect, useState} from 'react'
import { useParams, useNavigate} from 'react-router-dom'
import {guestApiFetch} from '../lib/guestApi' 


export default function Play() {
    //Read ":id" param from URL (ex: /play/1 -> id = 1")
    const { id } = useParams()

    //Back navigation helper
    const navigate = useNavigate()

    //Local state to hold loaded game and possible error text
    const [game, setGame] = useState(null)
    const [error, setError] = useState('')
    const [hole, setHole] = useState(1); //1-based
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    useEffect(() => {
        //Small check to avoid setting state after unmount
        let stopped = false;
        const load = async () => {
            setError(''); //clear Errors before trying
            try{
                //Get api/games/:id to fetch the game details from Flask
                const res = await guestApiFetch(`/api/games/${id}`);

                if(!res.ok) throw new Error(`HTTP ${res.status}`);

                const data = await res.json();
                if(!stopped) {
                  setGame(data);

                  const savedHole = sessionStorage.getItem(`game_${id}_currentHole`);
                  if (savedHole){
                    setHole(parseInt(savedHole, 10));
                  } else {
                    setHole(1);
                  }

                  //For guest games, check if there are updates scored in sessionStorage
                  if (data.id == null) {
                    const gamesData = JSON.parse(sessionStorage.getItem('guest_games') || '[]');
                    console.log('Looking for guest game data:', gamesData);
                    const updatedGame = gamesData.find(g => g.id === null);
                    console.log('Found updated game:', updatedGame);
                    if (updatedGame && updatedGame.scores) {
                      console.log('Restoring scores:', updatedGame.scores);
                      setGame({...data, scores: updatedGame.scores});
                    }
                  }
                }
            } catch(e) {
              console.error(e)
              if(!stopped) setError('Could not load game.');
        
            }
        };
        load();

        //Cleanup: if componenet unmounts, prevent state updates
        return () => { stopped = true };
    } , [id]);
    //Helper for score
    const setScore = async (player, hole1, value) => {
      if (!game) return;
      const hi = hole1 - 1;

      setGame(g => ({
        ...g,
        scores: {
          ...g.scores,
          [player]: g.scores[player].map((v, i) => (i === hi ? value : v)), 
        },
      }));
    // persist to API only for logged-in games (guest games have id === null)
    if (game.id !== null) {
      console.log('Saving score for logged-in game:', game.id);
      try {
        const res = await guestApiFetch(`/api/games/${game.id}/score`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ player, hole: hole1, score: value }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } catch (e) {
        console.error(e);
        setError('Could not save score.');
      }
    } else {
      console.log('Guest mode - score should be saved automatically');
      // Also save to sessionStorage explicitly for guest games
      try {
        const res = await guestApiFetch(`/api/games/null/score`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ player, hole: hole1, score: value }),
        });
        console.log('Guest score save result:', res);
      } catch (e) {
        console.error('Guest score save error:', e);
      }
    }
  };

  const bump = (player, delta) => {
    const curr = game?.scores?.[player]?.[hole - 1];
    const before = typeof curr === 'number' ? curr : 0;
    const next = Math.max(0, before + delta);
    setScore(player, hole, next);
  };
  const resetToZero = (player) => setScore(player, hole, 0);
  const prevHole = () => {
    const newHole = Math.max(1, hole - 1);
    setHole(newHole);
    //Save current hole to sessionStorage
    sessionStorage.setItem(`game_${id}_currentHole`, newHole);
  }
  const nextHole = () => {
    const maxHoles = game?.holes ?? 18;
    const newHole = Math.min(maxHoles, hole + 1)
    setHole(newHole);
    //Save current hole to sessionStorage
    sessionStorage.setItem(`game_${id}_currentHole`, newHole);
  };
  const lastHole = game?.holes ?? 18;
    //Render an error view if loading failed
    if (!game && !error) {
        return (
          <main className="page">
            <button className="secondary" onClick={() => navigate(-1)}>← Back</button>
            <p>Loading game...</p>
          </main>
        );
      }
// If there is a game, reder the basic info (Scores will go here later)

      if(error) {
        return (
          <main className="page">
            <button className="secondary" onClick={() => navigate(-1)}>← Back</button>
            <p className="error">{error}</p>
          </main>
        )
      }

      return (
        <main className="page play">
          {/* Header: Previous | Hole X | game name | Next */}
          <header className="holebar">
            <button className="holebtn" onClick={prevHole} disabled={hole === 1} aria-label="Previous hole">← Previous</button>
            <div className="holecenter">
              <div className="holelabel">Hole</div>
              <div className="holenumber">{hole}</div>
            </div>
            <button className="holebtn right" onClick={nextHole} disabled= {hole === lastHole} aria-label="Next hole">Next →</button>
            <div className="coursename" aria-label="Round name">{game.name}</div>
          </header>
    
          {/* Player cards */}
          <section className="play-list">
            {game.players.map((p) => {
              const s = game.scores[p]?.[hole - 1];
              const holeScore = typeof s === 'number' ? s : 0;
              const totalAll = (game.scores[p] ?? []).reduce(
                (sum, v) => sum + (typeof v === 'number' ? v : 0),
                0
              );
              return (
                <article className="play-card" key={p}>
                  <div className="play-info">
                    <div className="play-name">{p}</div>
                    <div className="play-score">Score: {totalAll}</div>
                  </div>
    
                  <div className="play-controls" aria-label={`Adjust score for ${p}`}>
                    <button className="pill round" onClick={() => bump(p, -1)} aria-label={`Decrease ${p}'s score`}>−</button>
                    <button className="pill round" onClick={() => resetToZero(p)} aria-label={`Reset ${p}'s score to 0`}>
                      {holeScore}
                    </button>
                    <button className="pill round" onClick={() => bump(p, +1)} aria-label={`Increase ${p}'s score`}>+</button>
                  </div>
                </article>
              );
            })}
          </section>
    
          {/* Bottom CTA buttons */}
          <div className="leaderboard-cta-wrap">
            {/* Always show View Leaderboard button */}
            <button
              className="leaderboard-cta secondary"
              onClick={() => setShowLeaderboard(true)}
              style={{
                background: 'linear-gradient(135deg, rgba(94, 234, 212, 0.15), rgba(20, 184, 166, 0.15))',
                border: '2px solid var(--mint)',
                color: 'var(--mint)',
                marginBottom: hole === lastHole ? '0.75rem' : '0'
              }}
            >
              📊 View Leaderboard
            </button>

            {/*Only show Finish Game on the last hole*/}
            {hole === lastHole && (
              <button
                className="leaderboard-cta"
                onClick={() => {
                  if (game?.id === null) {
                    // Store guest game data in sessionStorage as backup
                    sessionStorage.setItem('guestGameData', JSON.stringify(game));
                    // Guest game - pass game data directly
                    navigate('/results/guest', { state: { gameData: game } });
                  } else {
                    // Logged-in game - use normal route
                    navigate(`/results/${game.id}`);
                  }
                }}
              >
                Finish Game
              </button>
            )}
          </div>

          {/* Leaderboard Modal */}
          {showLeaderboard && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem',
                backdropFilter: 'blur(8px)'
              }}
              onClick={() => setShowLeaderboard(false)}
            >
              <div
                style={{
                  background: 'var(--bg)',
                  borderRadius: '20px',
                  padding: '2rem',
                  maxWidth: '500px',
                  width: '100%',
                  maxHeight: '80vh',
                  overflowY: 'auto',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                  border: '2px solid rgba(94, 234, 212, 0.3)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <h2 style={{
                    margin: 0,
                    fontSize: '1.75rem',
                    background: 'linear-gradient(135deg, #5eead4, #14b8a6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold'
                  }}>
                    🏆 Live Leaderboard
                  </h2>
                  <button
                    onClick={() => setShowLeaderboard(false)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: '2rem',
                      cursor: 'pointer',
                      color: 'var(--text)',
                      opacity: 0.6,
                      padding: 0,
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    aria-label="Close leaderboard"
                  >
                    ×
                  </button>
                </div>

                {/* Game Info */}
                <div style={{
                  background: 'rgba(94, 234, 212, 0.1)',
                  padding: '1rem',
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  <p style={{
                    margin: 0,
                    color: 'var(--text)',
                    opacity: 0.8,
                    fontSize: '0.875rem'
                  }}>
                    {game.name} • Through Hole {hole} of {lastHole}
                  </p>
                </div>

                {/* Standings */}
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {game.players
                    .map(player => {
                      const scores = game.scores[player] ?? [];
                      const total = scores.reduce(
                        (sum, v) => sum + (typeof v === 'number' ? v : 0),
                        0
                      );
                      const scoredHoles = scores.filter((v, idx) => idx < hole && typeof v === 'number').length;
                      return { player, total, scoredHoles };
                    })
                    .sort((a, b) => a.total - b.total)
                    .map((data, idx) => {
                      const isLeader = idx === 0;
                      return (
                        <div
                          key={data.player}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1rem 1.25rem',
                            background: isLeader
                              ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.15))'
                              : 'rgba(100, 116, 139, 0.08)',
                            borderRadius: '12px',
                            border: isLeader ? '2px solid #f59e0b' : '2px solid transparent',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {/* Position */}
                          <div style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: isLeader ? '#f59e0b' : 'var(--mint)',
                            minWidth: '40px',
                            textAlign: 'center'
                          }}>
                            {isLeader ? '🥇' : `${idx + 1}.`}
                          </div>

                          {/* Player Info */}
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontSize: '1.125rem',
                              fontWeight: isLeader ? 'bold' : '600',
                              color: 'var(--text)',
                              marginBottom: '0.25rem'
                            }}>
                              {data.player}
                            </div>
                            <div style={{
                              fontSize: '0.75rem',
                              color: 'var(--text)',
                              opacity: 0.6
                            }}>
                              {data.scoredHoles} of {hole} holes scored
                            </div>
                          </div>

                          {/* Score */}
                          <div style={{
                            fontSize: '1.75rem',
                            fontWeight: 'bold',
                            color: isLeader ? '#f59e0b' : 'var(--mint)',
                            minWidth: '60px',
                            textAlign: 'right'
                          }}>
                            {data.total}
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setShowLeaderboard(false)}
                  className="cta"
                  style={{
                    width: '100%',
                    marginTop: '1.5rem',
                    padding: '1rem'
                  }}
                >
                  Continue Playing
                </button>
              </div>
            </div>
          )}
        </main>
      );
    }