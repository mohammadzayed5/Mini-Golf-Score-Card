//Use state will let the component remember values across render (players list, loading, error)
//useEffect will run side effects list fetching from API when dependenicies change
// guestApiFetch is a helper function that handles guest vs user data automatically
import { useEffect, useState } from "react";
import { guestApiFetch } from "../lib/guestApi";
import AdBanner from '../components/AdBanner';

function readGuestWins() {
    try {
        return JSON.parse(sessionStorage.getItem('guestWins') || '{}');
    } catch {
        return {};
    }
}

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

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setErr("");
            setLoading(true);
            const guestWins = readGuestWins();
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

    const addPlayer = async () => {
        setErr("");
        const name = window.prompt("Player name?");
        if (!name || !name.trim()) return;
        const guestWins = readGuestWins();
        try {
            const res = await guestApiFetch("/api/players", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim() }),
            });
            if (res.ok) {
                const created = await res.json();
                const merged = mergePlayersWithGuestWins([created], guestWins)[0];
                setPlayers((p) => [...p, merged]);
            } else {
                const newPlayer = { id: Date.now(), name: name.trim(), wins: 0 };
                const merged = mergePlayersWithGuestWins([newPlayer], guestWins)[0];
                setPlayers((p) => [...p, merged]);
            }
        } catch {
            const newPlayer = { id: Date.now(), name: name.trim(), wins: 0 };
            const merged = mergePlayersWithGuestWins([newPlayer], guestWins)[0];
            setPlayers((p) => [...p, merged]);
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
            {err && <p className="error">{err}</p>}

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

            <button className="add-player" onClick={addPlayer} aria-label="Add Player">
                <span className="plus" aria-hidden>＋</span> Add Player
            </button>

            <AdBanner adUnitId="ca-app-pub-5108646735858325/7215223181" position="BOTTOM_CENTER" />
        </main>
    );
}