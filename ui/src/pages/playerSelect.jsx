//Use state will let the component remember values across render (players list, loading, error)
//useEffect will run side effects list fetching from API when dependenicies change
// apiFetch is a helper function that prefixes /api/... to correct backend URL
import {useEffect, useState} from "react";
import {guestApiFetch} from "../lib/guestApi";
import { useLocation, useNavigate } from "react-router-dom";


export default function PlayerSelect() {
  //players is an array of {id, name, wins}
  //loading will show a loading message while fetching
  // err: whill show a text if there is an error
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const navigate = useNavigate();
  const location = useLocation()
  const selectedCourse = location.state?.course;

  // Helper function to merge players with guest wins from localStorage
  const mergePlayersWithGuestWins = (playersData) => {
    const guestWins = JSON.parse(localStorage.getItem('guestWins') || '{}');

    return playersData.map(player => {
      const dbWins = player.wins || 0;
      const guestWinsForPlayer = guestWins[player.name] || 0;
      const totalWins = dbWins + guestWinsForPlayer;
      return {
        ...player,
        wins: totalWins
      };
    });
  };
  

  //Helper Function to make initials from a name
  const initials = (name) =>
      name
          .split(/\s+/) //split on spaces
          .filter(Boolean) //remove empty parts
          .slice(0,2) //first and last
          .map(w => w[0]?.toUpperCase() || "")
          .join(""); 

  //toggle selection
  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const onCardKey = (e, id) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle(id);
    }
  };


    //Load
  useEffect(() => {
      let cancelled = false; //this avoids setting state after unmount

      const load = async () => {
          setErr("");
          setLoading(true);
          try {
              const res = await guestApiFetch("/api/players"); //GET Players
              if(!res.ok) throw new Error(`HTTP ${res.status}`);
              const data = await res.json();

              const mergedPlayers = mergePlayersWithGuestWins(data);

              if(!cancelled) setPlayers(mergedPlayers); //update state
          }   catch (e) {
              if (!cancelled) {
                  // In guest mode, still show guest wins even if API fails
                  const guestWins = JSON.parse(localStorage.getItem('guestWins') || '{}');
                  const guestPlayers = Object.keys(guestWins).map((name, index) => ({
                    id: `guest-${index}`,
                    name: name,
                    wins: guestWins[name]
                  }));

                  if (guestPlayers.length > 0) {
                    setPlayers(guestPlayers);
                  } else {
                    setErr("No current players.");
                    setPlayers([]);
                  }
              }
      } finally {
          if (!cancelled) setLoading(false);
      }
  };
  load();
  return () => {cancelled = true;}; //cleanip
  }, []); // [] = run once on mount

  //Add player flow (for now just prompt for a name)
  const addPlayer = async () => {
      setErr("");
      const name = window.prompt("Player name?");
      if(!name || !name.trim()) return;
      try {
          // Access API
          const res = await guestApiFetch("/api/players", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name.trim() }),
          });
          if (res.ok) {
            const created = await res.json();
            const mergedCreated = mergePlayersWithGuestWins([created])[0];
            setPlayers((p) => [...p, mergedCreated]);
          } else {
            // If API isn't ready, add locally so you can keep moving
            const newPlayer = { id: Date.now(), name: name.trim(), wins: 0 };
            const mergedPlayer = mergePlayersWithGuestWins([newPlayer])[0];
            setPlayers((p) => [...p, mergedPlayer]);
          }
        } catch {
          const newPlayer = { id: Date.now(), name: name.trim(), wins: 0 };
          const mergedPlayer = mergePlayersWithGuestWins([newPlayer])[0];
          setPlayers((p) => [...p, mergedPlayer]);
        }
      };
    //Click handler for "Start Game"
    const startGame = async () => {
      setErr('') // clear any previous error
      //At least one selected player to start
      if(selected.size === 0){
        setErr("Select at least one player to start.");
        return;
      }
      setCreating(true);
      try{
          //Calls Flask API to create new game
          //Due to Vite proxy, /api/games will go to http://127.0.0.1:5001/api/games
          const res = await guestApiFetch(`/api/games`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                 name: selectedCourse ? `${selectedCourse.name} Round`: 'New Round', 
                 holes: selectedCourse ? selectedCourse.holes : 18,
                playerIds: Array.from(selected),
              }),
          });
          //If Flask returns a non-2xx stats (ex: 500), throw an error
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          //Parse JSON body -> {id, name, holes, etc.}
          const game = await res.json()
          //Navigate to Play game page for the created game
          navigate(`/play/${game.id}`)
      }catch (e) {
          console.error(e)
          //Messge if API call fails
          setErr('Could not create game. Is the Flask server running on port 5001?')
      } finally {
          setCreating(false) // re-enable button
      }
      };

        
  return (
      <main className="page players-select">
        <h1 className="title">Select Players</h1>
  
        {loading && <p>Loading…</p>}
        {err && <p className="error">{err}</p>}
  
        <ul className="players-list">
          {players.map((p) => {
            const isSelected = selected.has(p.id);
            return (
            <li key={p.id}
             className={`player-card ${isSelected ? "selected" : ""}`}
             onClick={() => toggle(p.id)}
             onKeyDown={(e) => onCardKey(e, p.id)}
             role="checkbox"
             aria-checked={isSelected}
             tabIndex={0}
             >
               {/* LEFT: selection box replaces initials circle */}
              <div className={`selectbox ${isSelected ? "on" : ""}`} aria-hidden>
                {/* optional check icon; keeps it text-free */}
                {isSelected ? "✓" : ""}
              </div>

              {/* Name and wins */}
              <div className="player-meta">
                <div className="player-name">{p.name}</div>
                <div className="player-stats">Wins: {p.wins || 0}</div>
              </div>
  
              {/* (Optional) actions could go here later, like edit/delete */}
            </li>
            );
          })}
        </ul>
  
        {/* Big “Add Player” button */}
        <button className="add-player" onClick={addPlayer} aria-label="Add Player">
          <span className="plus" aria-hidden>＋</span> Add Player
        </button>
        <button
          className="cta start-round"
          onClick={startGame}
          disabled={creating}
          aria-label="Start game"
        >
        {creating ? 'Creating…' : '⛳️Start Game🏌🏽'}
        </button>

      </main>
      
    );
  }