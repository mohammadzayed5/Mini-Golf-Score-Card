import { useEffect, useState} from 'react'
import { useParams, useNavigate} from 'react-router-dom'
import {apiFetch} from '../lib/api' 


export default function Play() {
    //Read ":id" param from URL (ex: /play/1 -> id = 1")
    const { id } = useParams()

    //Back navigation helper
    const navigate = useNavigate()

    //Local state to hold loaded game and possible error text
    const [game, setGame] = useState(null)
    const [error, setError] = useState('')
    const [hole, setHole] = useState(1); //1-based

    useEffect(() => {
        //Small check to avoid setting state after unmount
        let stopped = false;
        const load = async () => {
            setError(''); //clear Errors before trying
            try{
                //Get api/games/:id to fetch the game details from Flask
                const res = await apiFetch(`/api/games/${id}`);

                if(!res.ok) throw new Error(`HTTP ${res.status}`);

                const data = await res.json();
                if(!stopped) {
                  setGame(data);
                  setHole(1);
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
    // persist to API
    try {
      const res = await apiFetch(`/api/games/${game.id}/score`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player, hole: hole1, score: value }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (e) {
      console.error(e);
      setError('Could not save score.');
    }
  };

  const bump = (player, delta) => {
    const curr = game?.scores?.[player]?.[hole - 1];
    const before = typeof curr === 'number' ? curr : 0;
    const next = Math.max(0, before + delta);
    setScore(player, hole, next);
  };
  const resetToZero = (player) => setScore(player, hole, 0);
  const prevHole = () => setHole(h => Math.max(1, h - 1));
  const nextHole = () => {
    const maxHoles = game?.holes ?? 18;
    setHole(h => Math.min(maxHoles, h + 1));
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
    
          {/* Bottom CTA (placeholder) */}
          <div className="leaderboard-cta-wrap">
            <button className="leaderboard-cta" onClick={() => alert('TODO: leaderboard')}>
              View Leaderboard
            </button>
            {/*Only show Finish Game on the last hole*/}
            {hole === lastHole && (
              <button
                className="leaderboard-cta"
                onClick={() => navigate(`/results/${game.id}`)}
              >
                Finish Game
              </button>
            )}
          </div>
        </main>
      );
    }