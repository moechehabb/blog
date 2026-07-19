"use client"

import { useEffect, useRef, useState } from "react";

type Suggestion = { placeId: string; text: string; lat?: number; lng?: number };

const LocationInput = ({ className }: { className?: string }) => {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<Suggestion | null>(null);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const skipNextSearch = useRef(false);

    useEffect(() => {
        if (skipNextSearch.current) {
            skipNextSearch.current = false;
            return;
        }
        if (query.trim().length < 3) {
            setSuggestions([]);
            return;
        }
        const timeout = setTimeout(async () => {
            const res = await fetch(`/api/places?q=${encodeURIComponent(query)}`);
            if (!res.ok) return;
            const data = await res.json();
            setSuggestions(data.suggestions ?? []);
        }, 300);
        return () => clearTimeout(timeout);
    }, [query]);

    const select = (s: Suggestion) => {
        skipNextSearch.current = true;
        setQuery(s.text);
        setSelected(s);
        setSuggestions([]);
    };

    return (
        <div className="relative">
            <input
                name="address"
                type="text"
                placeholder="Search for a place..."
                value={query}
                autoComplete="off"
                onChange={e => {
                    setQuery(e.target.value);
                    setSelected(null);
                }}
                className={className}
            />
            <input type="hidden" name="placeId" value={selected?.placeId ?? ""} />
            <input type="hidden" name="lat" value={selected?.lat ?? ""} />
            <input type="hidden" name="lng" value={selected?.lng ?? ""} />
            {suggestions.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full border border-zinc-900 bg-white dark:border-zinc-700 dark:bg-zinc-900">
                    {suggestions.map(s => (
                        <li key={s.placeId}>
                            <button
                                type="button"
                                onClick={() => select(s)}
                                className="block w-full cursor-pointer px-4 py-2 text-left hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800"
                            >
                                {s.text}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LocationInput;
