import { useRef } from 'react';

/**
 * Inline "type a name, press return" field. The field keeps focus after each
 * add so several names can be entered in a row without a system dialog.
 * Controlled: the parent owns `value` so it can also pick up a name that was
 * typed but not yet submitted.
 */
export default function AddNameField({ value, onChange, onAdd, placeholder, label, buttonText = 'Add' }) {
    const inputRef = useRef(null);

    const submit = (e) => {
        e.preventDefault();
        if (!value.trim()) return;
        onAdd(value);
        inputRef.current?.focus();
    };

    return (
        <form className="add-row" onSubmit={submit}>
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                aria-label={label}
                autoComplete="off"
                autoCapitalize="words"
                enterKeyHint="done"
                maxLength={40}
            />
            {/* preventDefault on press keeps focus (and the phone keyboard) on the field */}
            <button type="submit" disabled={!value.trim()} onMouseDown={(e) => e.preventDefault()}>
                {buttonText}
            </button>
        </form>
    );
}
