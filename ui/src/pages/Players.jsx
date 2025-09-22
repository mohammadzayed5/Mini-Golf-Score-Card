//Use state will let the component remember values across render (players list, loading, error)
//useEffect will run side effects list fetching from API when dependenicies change
// guestApiFetch is a helper function that handles guest vs user data automatically
import {useEffect, useState} from "react";
import {guestApiFetch} from "../lib/guestApi";

export default function Players() {
    //players is an array of {id, name, wins}
    //loading will show a loading message while fetching
    // err: whill show a text if there is an error
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    //Helper Function to make initials from a name
    const initials = (name) =>
        name
            .split(/\s+/) //split on spaces
            .filter(Boolean) //remove empty parts
            .slice(0,2) //first and last
            .map(w => w[0]?.toUpperCase() || "")
            .join(""); 

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
                    if(!cancelled) setPlayers(data); //update state
                }   catch (e) {
                    if (!cancelled) {
                        setErr("No current players.");
                        setPlayers([]);
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
                  setPlayers((p) => [...p, created]);
                } else {
                  // If API isn't ready, add locally so you can keep moving
                  setPlayers((p) => [
                    ...p,
                    { id: Date.now(), name: name.trim(), wins: 0 },
                  ]);
                }
              } catch {
                setPlayers((p) => [...p, { id: Date.now(), name: name.trim(), wins: 0 }]);
              }
            };

        const deletePlayer = async (playerId, playerName) => {
            if (!window.confirm(`Delete ${playerName}?`)) return;

            setErr(""); // Clear any previous error messages

            try {
                const res = await guestApiFetch(`/api/players/${playerId}`, {
                    method: "DELETE"
                });
                if (res.ok) {
                    setPlayers(p => p.filter(player => player.id != playerId));
                } else {
                    setErr("Could not delete player.");
                }
            } catch (error) {
                setErr("Could not delete player.");
            }
        };
            return (
                <main className="page players">
                  <h1 className="title">Players</h1>
            
                  {loading && <p>Loading…</p>}
                  {err && <p className="error">{err}</p>}
            
                  <ul className="players-list">
                    {players.map((p) => (
                      <li key={p.id} className="player-card">
                        {/* Avatar with initials */}
                        <div className="avatar" aria-hidden>
                          {initials(p.name)}
                        </div>
            
                        {/* Name and wins */}
                        <div className="player-meta">
                          <div className="player-name">{p.name}</div>
                          <div className="player-stats">Wins: {p.wins ?? 0}</div>
                        </div>

                        {/* Delete button */}
                        <button
                          className="delete-btn"
                          onClick={() => deletePlayer(p.id, p.name)}
                          aria-label={`Delete ${p.name}`}
                          title="Delete player"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
            
                  {/* Big “Add Player” button */}
                  <button className="add-player" onClick={addPlayer} aria-label="Add Player">
                    <span className="plus" aria-hidden>＋</span> Add Player
                  </button>
                </main>
              );
            }