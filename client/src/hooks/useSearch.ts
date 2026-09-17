import {type SetStateAction, type Dispatch, useState, useMemo} from 'react';

interface UseSearchExports<T> {
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    filteredItems: T[];
}

export default function useSearch<T>(items: T[], getSearchKeys: (item: T) => string[]):UseSearchExports<T> {

    const [search, setSearch] = useState<string>('');

    const filteredItems: T[] = useMemo(() => {
        const term: string = search.trim().toLowerCase();
        if (!term) return items;

        return items.filter(item => getSearchKeys(item).some(field => field.toLowerCase().includes(term)));
    }, [search, items, getSearchKeys]);

    return {search, setSearch, filteredItems}
}