//Use state will let the component remember values across render (players list, loading, error)
//useEffect will run side effects list fetching from API when dependenicies change
// guestApiFetch routes to the API (signed in) or local guest storage (guest)
import {useEffect, useState} from "react";
import {guestApiFetch} from "../lib/guestApi";
import { getGuestWins } from "../lib/storage";
import { cleanName, sameName } from "../lib/gameEdit";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HolesPicker from "../components/HolesPicker";
import AddNameField from "../components/AddNameField";

// Merge API player records with locally-stored guest wins
const mergePlayersWithGuestWins = (playersData, guestWins) =>
  playersData.map(player => ({
    ...player,
    wins: (player.wins || 0) + (guestWins[player.name] || 0)
  }));

export default function PlayerSelect() {
  //players is an array of {id, name, wins}
  //loading will show a loading message while fetching
  // err: whill show a text if there is an error
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [guestWins, setGuestWinsState] = useState({});
  const [newName, setNewName] = useState("");
  const navigate = useNavigate();
  const location = useLocation()
  const selectedCourse = location.state?.course;
  //Hole count is shown and editable here; a chosen course only prefills it
  const [holes, setHoles] = useState(selectedCourse?.holes ?? 18);

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
          const wins = await getGuestWins();
          if (!cancelled) setGuestWinsState(wins);
          let loaded = [];
          try {
              const res = await guestApiFetch("/api/players"); //GET Players
              if(!res.ok) throw new Error(`HTTP ${res.status}`);
              loaded = mergePlayersWithGuestWins(await res.json(), wins);
          }   catch {
              // Could not reach the API: still offer names that have guest wins
              loaded = Object.keys(wins).map((name, index) => ({
                id: `guest-${index}`,
                name: name,
                wins: wins[name]
              }));
          }
          if (!cancelled) {
              // Keep anyone added while the list was still loading
              setPlayers(current => [
                ...loaded.filter(p => !current.some(c => sameName(c.name, p.name))),
                ...current,
              ]);
              setLoading(false);
          }
      };
      load();
      return () => {cancelled = true;}; //cleanip
  }, []); // [] = run once on mount

  //Save a newly typed player in the background. The list already shows them
  //under a temporary id; swap in the real id once the API answers. If saving
  //fails they stay local, which is fine: the game is created from names.
  const savePlayer = async (name, tempId) => {
      try {
          const res = await guestApiFetch("/api/players", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
          });
          if (!res.ok) return;
          const created = await res.json();
          if (created?.id == null) return;
          setPlayers(list => list.map(p => (p.id === tempId ? { ...p, id: created.id } : p)));
          setSelected(prev => {
            if (!prev.has(tempId)) return prev;
            const next = new Set(prev);
            next.delete(tempId);
            next.add(created.id);
            return next;
          });
      } catch (e) {
          console.warn("Could not save player, keeping it for this game only:", e);
      }
  };

  //Add a typed name: it appears in the list already ticked. Typing the name
  //of someone already listed just ticks them. Returns the name used.
  const addPlayer = (raw) => {
      const name = cleanName(raw);
      if (!name) return null;
      setErr("");
      setNewName("");

      const existing = players.find(p => sameName(p.name, name));
      if (existing) {
        setSelected(prev => new Set(prev).add(existing.id));
        return existing.name;
      }

      const tempId = `new-${Date.now()}-${Math.random()}`;
      setPlayers(list => [...list, { id: tempId, name, wins: guestWins[name] || 0 }]);
      setSelected(prev => new Set(prev).add(tempId));
      savePlayer(name, tempId);
      return name;
  };

    //Click handler for "Start Game"
    const startGame = async () => {
      setErr('') // clear any previous error

      const names = players.filter(p => selected.has(p.id)).map(p => p.name);
      //A name typed but not yet added still counts
      const pending = addPlayer(newName);
      if (pending && !names.some(n => sameName(n, pending))) names.push(pending);

      //At least one selected player to start
      if(names.length === 0){
        setErr("Add or tick at least one player to start.");
        return;
      }
      if (holes == null) {
        setErr("Enter a number of holes from 1 to 36.");
        return;
      }
      setCreating(true);
      try{
          //Players go by name, not id, so someone who was only just typed in
          //(or whose save failed) is still in the game.
          const res = await guestApiFetch(`/api/games`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                 name: selectedCourse ? `${selectedCourse.name} Round`: 'New Round',
                 holes,
                 players: names,
              }),
          });
          //If the API returns a non-2xx status (ex: 500), throw an error
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          //Parse JSON body -> {id, name, holes, etc.}
          const game = await res.json()
          //A new game starts on hole 1. Guest games all share the id "null",
          //so drop the hole remembered from the previous one.
          sessionStorage.removeItem(`game_${game.id}_currentHole`);
          //Navigate to Play game page for the created game
          navigate(`/play/${game.id}`)
      }catch (e) {
          console.error(e)
          //Messge if API call fails
          setErr("Couldn't start the game. Check your connection and try again.")
      } finally {
          setCreating(false) // re-enable button
      }
      };

  const count = selected.size;

  return (
      <main className="page players-select">
        <h1 className="title">Select Players</h1>

        {/* Course and hole count, shown up front and editable before starting */}
        <section className="setup-panel" aria-label="Course and holes">
          <div className="setup-label">
            <span>{selectedCourse ? selectedCourse.name : "No course picked"}</span>
            <Link to="/courses">{selectedCourse ? "Change" : "Pick a course"}</Link>
          </div>
          <div className="setup-label"><span>Holes</span></div>
          <HolesPicker value={holes} onChange={(n) => { setHoles(n); setErr(""); }} />
        </section>

        {loading && <p>Loading…</p>}
        {!loading && players.length === 0 && (
          <p className="hint">Type the name of everyone playing. Each one is added ticked.</p>
        )}

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

        {/* Inline add: type a name, press return, keep typing the next one */}
        <AddNameField
          value={newName}
          onChange={setNewName}
          onAdd={addPlayer}
          placeholder="Add a player"
          label="New player name"
        />

        {err && <p className="error" role="alert">{err}</p>}

        <button
          className="cta start-round"
          onClick={startGame}
          disabled={creating}
          aria-label="Start game"
        >
        {creating
          ? 'Starting…'
          : `⛳️ Start Game · ${count} player${count === 1 ? '' : 's'} · ${holes ?? '?'} holes`}
        </button>

      </main>

    );
  }
