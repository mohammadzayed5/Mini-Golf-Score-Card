import { useState } from 'react';
import HolesPicker from './HolesPicker';
import AddNameField from './AddNameField';
import { cleanName, sameName } from '../lib/gameEdit';

/**
 * Mid-game editor: add or remove players and change the hole count without
 * starting over. Changes are a draft until Save; `onSave({players, holes})`
 * should throw if the change could not be stored.
 */
export default function EditGameSheet({ game, onSave, onClose }) {
    const [players, setPlayers] = useState(game.players);
    const [holes, setHoles] = useState(game.holes);
    const [newName, setNewName] = useState('');
    const [confirmRemove, setConfirmRemove] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const scoredCount = (player) =>
        (game.scores?.[player] ?? []).filter(v => typeof v === 'number').length;

    // Shrinking the round drops whatever was scored on the removed holes.
    const losesScores = holes != null && holes < game.holes && players.some(player =>
        (game.scores?.[player] ?? []).slice(holes).some(v => typeof v === 'number')
    );

    // Returns the list including the new name, or null if it was rejected.
    const addPlayer = (raw, list = players) => {
        const name = cleanName(raw);
        if (!name) return list;
        if (list.some(p => sameName(p, name))) {
            setError(`${name} is already playing.`);
            return null;
        }
        setError('');
        setNewName('');
        const next = [...list, name];
        setPlayers(next);
        return next;
    };

    const removePlayer = (player) => {
        if (scoredCount(player) > 0 && confirmRemove !== player) {
            setConfirmRemove(player);
            return;
        }
        setConfirmRemove(null);
        setError('');
        setPlayers(list => list.filter(p => p !== player));
    };

    const save = async () => {
        // A name typed but not yet added still counts
        const finalPlayers = addPlayer(newName);
        if (!finalPlayers) return;
        if (finalPlayers.length === 0) {
            setError('A game needs at least one player.');
            return;
        }
        if (holes == null) {
            setError('Enter a number of holes from 1 to 36.');
            return;
        }
        const playersChanged = finalPlayers.length !== game.players.length
            || finalPlayers.some((p, i) => p !== game.players[i]);
        const holesChanged = holes !== game.holes;
        if (!playersChanged && !holesChanged) {
            onClose();
            return;
        }
        setSaving(true);
        setError('');
        try {
            await onSave({
                players: playersChanged ? finalPlayers : undefined,
                holes: holesChanged ? holes : undefined,
            });
        } catch (e) {
            console.error(e);
            setError("Couldn't save the changes. Check your connection and try again.");
            setSaving(false);
        }
    };

    return (
        <div className="sheet-overlay" onClick={() => !saving && onClose()}>
            <div
                className="sheet"
                role="dialog"
                aria-modal="true"
                aria-label="Edit players and holes"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="sheet-title">Players &amp; holes</h2>

                <div className="setup-label"><span>Players</span></div>
                <ul className="sheet-players">
                    {players.map(player => (
                        <li key={player}>
                            <span>{player}</span>
                            <button
                                type="button"
                                className="sheet-remove"
                                onClick={() => removePlayer(player)}
                                disabled={saving}
                            >
                                {confirmRemove === player
                                    ? `Remove and lose ${scoredCount(player)} score${scoredCount(player) === 1 ? '' : 's'}?`
                                    : 'Remove'}
                            </button>
                        </li>
                    ))}
                </ul>
                <AddNameField
                    value={newName}
                    onChange={setNewName}
                    onAdd={(name) => addPlayer(name)}
                    placeholder="Add a player"
                    label="New player name"
                />

                <div className="setup-label" style={{ marginTop: 18 }}><span>Holes</span></div>
                <HolesPicker value={holes} onChange={(n) => { setHoles(n); setError(''); }} />
                {losesScores && (
                    <p className="hint warn">
                        Scores already entered on holes {holes + 1} to {game.holes} will be removed.
                    </p>
                )}

                {error && <p className="error" role="alert">{error}</p>}

                <div className="sheet-actions">
                    <button type="button" className="sheet-cancel" onClick={onClose} disabled={saving}>
                        Cancel
                    </button>
                    <button type="button" className="sheet-save" onClick={save} disabled={saving}>
                        {saving ? 'Saving…' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
}
