//Use state will let the component remember values across render (players list, loading, error)
//useEffect will run side effects list fetching from API when dependenicies change
// guestApiFetch is a helper function that handles guest vs user data automatically
import { useEffect, useState } from "react";
import { guestApiFetch } from "../lib/guestApi";
import { getGuestWins } from "../lib/storage";
import { cleanName, sameName } from "../lib/gameEdit";
import AddNameField from "../components/AddNameField";

function mergePlayersWithGuestWins(playersData, guestWins) {
    return playersData.map(player => ({
        ...player,
        wins: (player.wins || 0) + (guestWins[player.name] || 0),
    }));
}

function initials(name) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(w => w[0]?.toUpperCase() || "")
        .join("");
}

export default function Players() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [newName, setNewName] = useState("");

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setErr("");
            setLoading(true);
            const guestWins = await getGuestWins();
            try {
                const res = await guestApiFetch("/api/players");
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                if (!cancelled) setPlayers(mergePlayersWithGuestWins(data, guestWins));
            } catch {
                if (!cancelled) {
                    const guestPlayers = Object.keys(guestWins).map((name, index) => ({
                        id: `guest-${index}`,
                        name,
                        wins: guestWins[name],
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
        return () => { cancelled = true; };
    }, []);

    const addPlayer = async (raw) => {
        setErr("");
        const name = cleanName(raw);
        if (!name) return;
        if (players.some(p => sameName(p.name, name))) {
            setErr(`${name} is already in your players.`);
            return;
        }
        setNewName("");
        const guestWins = await getGuestWins();
        try {
            const res = await guestApiFetch("/api/players", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const created = await res.json();
            const merged = mergePlayersWithGuestWins([created], guestWins)[0];
            setPlayers((p) => [...p, merged]);
        } catch {
            // This screen is the saved list, so don't pretend it was saved
            setNewName(name);
            setErr("Couldn't save that player. Check your connection and try again.");
        }
    };

    const deletePlayer = async (playerId, playerName) => {
        if (!window.confirm(`Delete ${playerName}?`)) return;
        setErr("");
        try {
            const res = await guestApiFetch(`/api/players/${playerId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setPlayers(p => p.filter(player => player.id != playerId));
            } else {
                setErr("Could not delete player.");
            }
        } catch {
            setErr("Could not delete player.");
        }
    };

    return (
        <main className="page players">
            <h1 className="title">Players</h1>

            {loading && <p>Loading…</p>}
            {err && <p className="error" role="alert">{err}</p>}

            <ul className="players-list">
                {players.map((p) => (
                    <li key={p.id} className="player-card">
                        <div className="avatar" aria-hidden>
                            {initials(p.name)}
                        </div>
                        <div className="player-meta">
                            <div className="player-name">{p.name}</div>
                            <div className="player-stats">Wins: {p.wins ?? 0}</div>
                        </div>
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

            <AddNameField
                value={newName}
                onChange={setNewName}
                onAdd={addPlayer}
                placeholder="Add a player"
                label="New player name"
            />

        </main>
    );
}