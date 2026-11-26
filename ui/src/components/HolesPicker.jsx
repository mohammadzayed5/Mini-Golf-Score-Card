import { useState } from 'react';

export const MAX_HOLES = 36; // matches the API's 1..36 check

/**
 * 9 / 18 / Custom hole-count picker.
 * `value` is a number; `onChange` receives a number, or null while the custom
 * field holds something that is not a whole number from 1 to 36.
 */
export default function HolesPicker({ value, onChange }) {
    const [custom, setCustom] = useState(value !== 9 && value !== 18);
    const [text, setText] = useState(value == null ? '' : String(value));

    const pick = (n) => {
        setCustom(false);
        setText(String(n));
        onChange(n);
    };

    const onCustomText = (e) => {
        const raw = e.target.value;
        setText(raw);
        const n = Number(raw);
        onChange(/^\d+$/.test(raw.trim()) && n >= 1 && n <= MAX_HOLES ? n : null);
    };

    return (
        <div className="holes-picker">
            <div className="seg" role="group" aria-label="Number of holes">
                <button type="button" className={!custom && value === 9 ? 'on' : ''}
                    aria-pressed={!custom && value === 9} onClick={() => pick(9)}>9</button>
                <button type="button" className={!custom && value === 18 ? 'on' : ''}
                    aria-pressed={!custom && value === 18} onClick={() => pick(18)}>18</button>
                <button type="button" className={custom ? 'on' : ''}
                    aria-pressed={custom} onClick={() => setCustom(true)}>Custom</button>
            </div>
            {custom && (
                <input
                    className="holes-custom"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max={MAX_HOLES}
                    placeholder={`1 to ${MAX_HOLES}`}
                    aria-label="Custom number of holes"
                    value={text}
                    onChange={onCustomText}
                />
            )}
        </div>
    );
}
