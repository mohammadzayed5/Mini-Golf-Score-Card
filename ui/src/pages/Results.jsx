import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { guestApiFetch } from '../lib/guestApi';
import confetti from 'canvas-confetti';


export default function Results() {
    const {id} = useParams(); //Grab the game id from /results/:id
    const navigate = useNavigate(); //For buttons
    const location = useLocation();
    const isGuestMode = id === 'guest';
    const guestGameData = location.state?.gameData;


    const [game, setGame] = useState(null);               // Holds the loaded game {id, name, holes, players, scores}
    const [error, setError] = useState('');               // Holds error message text for UI 

    //Confetti animation
    const triggerConfetti = () => {
      const duration = 5000; //5 seconds of confetti
      const animationEnd = Date.now() + duration;

      const randomInRange = (min,max) => Math.random() * (max - min) + min;
      //Launch confetti bursts every 250ms
      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            clearInterval(interval);
            return;
        }

        // Left side burst
        confetti({
            particleCount: randomInRange(50, 100),
            angle: randomInRange(55, 125),
            spread: randomInRange(50, 70),
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff']
        });

        // Right side burst
        confetti({
            particleCount: randomInRange(50, 100),
            angle: randomInRange(55, 125),
            spread: randomInRange(50, 70),
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff']
        });
    }, 250);
    };

    useEffect(() => {
        let stop = false;

        if (isGuestMode) {
          // Try to get game data from navigation state or sessionStorage
          let gameData = guestGameData;
          if (!gameData || !gameData.players) {
            const sessionData = sessionStorage.getItem('guestGameData');
            if (sessionData) {
              gameData = JSON.parse(sessionData);
              // Clean up sessionStorage after use
              sessionStorage.removeItem('guestGameData');
            }
          }

          if (gameData && gameData.players) {
            // Guest mode - use game data
            setGame(gameData);
            triggerConfetti();

            // Handle guest wins
            const totals = (gameData.players || [])
              .map(p => {
                const playerScores = gameData.scores?.[p] ?? [];
                const total = playerScores.reduce((s, v) => s + (typeof v === 'number' ? v : 0), 0);
                return { player: p, total };
              })
              .sort((a, b) => a.total - b.total);

            const winners = totals.length > 0
              ? totals.filter(t => t.total === totals[0].total).map(t => t.player)
              : [];
            
            
            // Update localStorage wins for each winner (with double-counting prevention)
            const processedGames = JSON.parse(localStorage.getItem('processedGames') || '[]');

            // Check if this exact game result was already processed
            const gameHash = JSON.stringify({
              players: gameData.players.sort(),
              scores: Object.entries(gameData.scores || {}).sort(),
              timestamp: Math.floor(Date.now() / 60000) // Round to minute to catch quick double-processing
            });

            if (!processedGames.includes(gameHash)) {
              const guestWins = JSON.parse(localStorage.getItem('guestWins') || '{}');
              winners.forEach(winner => {
                guestWins[winner] = (guestWins[winner] || 0) + 1;
              });
              localStorage.setItem('guestWins', JSON.stringify(guestWins));

              // Mark this game as processed
              processedGames.push(gameHash);
              if (processedGames.length > 100) processedGames.shift(); // Keep only last 100 games
              localStorage.setItem('processedGames', JSON.stringify(processedGames));
            }
          }
        } else if (!isGuestMode) {
          // Logged in mode - fetch from API
          (async () => {
            setError('');
            try {
              const res = await guestApiFetch(`/api/games/${id}`);
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              const data = await res.json();
              if (!stop) {
                setGame(data);
                // Record wins in database
                try {
                  await guestApiFetch(`/api/games/${id}/finish`, {method: 'POST'});
                } catch (e) {
                  console.warn('Could not record wins:', e);
                }
                triggerConfetti();
              }
            } catch (e) {
              console.error(e);
              if (!stop) setError('Could not load results.');
            }
          })();
        }

        return () => { stop = true; };
      }, [id]);
    
      if (!game && !error) {                                 // Loading state (no data, no error yet)
        return (
          <main className="page results">                    {/* page container with results class for styling */}
            <p>Loading results…</p>                          {/* simple loading text */}
          </main>
        );
      }
    
      if (error) {                                           // Error state
        return (
          <main className="page results">
            <p className="error">{error}</p>                 {/* show the error */}
          </main>
        );
      }
    
      // --- Compute totals and rankings from the loaded game ---
    
      const totals = (game.players || [])                    // Start with the players array (fallback to [])
        .map(p => {                                          // Turn each player name into { player, total }
          const total = (game.scores?.[p] ?? [])             // Find that player's score array (or [])
            .reduce(                                         // Sum only numeric values
              (s, v) => s + (typeof v === 'number' ? v : 0),
              0
            );
          return { player: p, total };                       // Return the pair for ranking
        })
        .sort((a, b) => a.total - b.total);                  // Ascending (mini golf: lower is better)
    
      const best = totals.length ? totals[0].total : 0;      // Best score is the first after sorting
      const winners = totals                                 // Handle ties by including all players with best total
        .filter(t => t.total === best)
        .map(t => t.player);
        
      const winnerName = winners[0] ?? null;
      const winnerScores = winnerName ?  (game.scores?.[winnerName] ?? []) : [];
      let bestHole = 1;
      let bestValue = Number.POSITIVE_INFINITY;
      winnerScores.forEach((v, i) => {
        const n = typeof v === 'number' ? v : Infinity;
        if (n < bestValue) { bestValue = n; bestHole = i + 1; }
      });
      // Count hole-in-ones for a specific player
const holeInOnes = (player) =>
  (game.scores?.[player] ?? []).reduce(
    (s, v) => s + (typeof v === 'number' && v === 1 ? 1 : 0),
    0
  );

// Build list for winners (handles ties too)
const winnerAces = winners.map((p) => ({ player: p, aces: holeInOnes(p) }));
      // turn 1 -> "1st", 2 -> "2nd", 3 -> "3rd", 4 -> "4th", etc.
      const ordinal = (n) => {
        const s = ["th","st","nd","rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
      };
      // Share results via Web Share API (mobile) or clipboard (desktop fallback)
      const shareResults = async () => {
        const lines = totals.map((t, i) => `${i + 1}. ${t.player} — ${t.total}`); // "1. Name — 54"
        const title = `Mini Golf Results — ${game.name}`;     // Title for share sheet
        const text = `Congratulations ${winners.join(' & ')}!\n\nFinal Scores:\n${lines.join('\n')}`; // Message body
        try {
          if (navigator.share) {                               // If Web Share API supported (most phones)
            await navigator.share({ title, text });            // Open native share sheet
          } else {                                            // Fallback for desktop browsers
            await navigator.clipboard.writeText(`${title}\n\n${text}`); // Copy to clipboard
            alert('Results copied to clipboard!');            // Let the user know
          }
        } catch (e) {
          // User cancelled or API unsupported—no hard failure needed
          console.warn(e);
        }
      };
    
      // --- Render the results screen ---
      return (
        <main className="page results">                       {/* top-level container for styles */}
          <header className="results-header">                 {/* compact header area */}
            <h1 className="congrats">                         {/* large “congratulations” headline */}
              <span>Congratulations </span>
              <span className ="name">
              {winners.length === 1 ? winners[0] : winners.join(' & ')}!
                </span>
            </h1>
          </header>
    
          <section className="final-scores">
            <div className="panel-title">FINAL SCORES</div>
            <div className="score-grid">
                {totals.map((t, idx) => (
                <article
                    key={t.player}
                    className={`score-row ${idx === 0 ? 'first' : ''}`}
                    aria-label={`${ordinal(idx + 1)} ${t.player} total ${t.total}`}
                >
                    <div className="ord">{ordinal(idx + 1)}</div>
                    <div className="who">{t.player}</div>
                    <div className="total">{t.total}</div>
                </article>
                ))}
            </div>
            </section>

          {/* Stats row: Best Hole +  Hole in Ones */}
            <section className="results-stats two" aria-label="Round stats">
            <div className="stat">
                <div className="stat-label">Best Hole</div>
                <div className="stat-value">{Number.isFinite(bestValue) ? bestHole : '-'}</div>
            </div>
            <div className="stat">
                <div className="stat-label">Hole in Ones</div>
                <div className="stat-value">
                  {winners.length === 0
                    ? '-'                                  // no winners found (shouldn’t happen, but safe)
                    : winners.length === 1
                      ? holeInOnes(winners[0])             // single winner: just the number
                      : winnerAces                         // tie: show "Name: count" for each
                          .map(w => `${w.player}: ${w.aces}`)
                          .join(' • ')
                  }
                </div>
            </div>
            </section>
            
          <div className="results-actions">{/* CTA button stack */}
            <button className="cta primary" onClick={() => navigate('/playerSelect')}>New Game</button>     {/* Start new */}
            <button className="cta" onClick={shareResults}>Share Results</button>  {/* Share */}
            <button className="cta" onClick={() => navigate('/')}>Home</button>       {/* History */}
          </div>
        </main>
      );
    }