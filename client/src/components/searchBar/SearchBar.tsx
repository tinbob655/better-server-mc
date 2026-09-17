import React from 'react';
import './searchBar.scss';

interface SearchBarParams {
    value: string;
    placeholder?: string;
    alignment?: 'LEFT' | 'RIGHT';
    onChange: (searchValue: string) => void;
}

export default function SearchBar({value, alignment, placeholder, onChange}: SearchBarParams): React.ReactElement {

    const alignmentClassName: string = alignment ? alignment === "LEFT" ? "alignLeft" : "alignRight" : "";

    return (
        <div className={`searchBarWrapper ${alignmentClassName}`}>
            <input
                type={"search"}
                placeholder={placeholder ?? "Search..."}
                onChange={e => onChange(e.target.value)}
                value={value}
            />
        </div>
    )
}