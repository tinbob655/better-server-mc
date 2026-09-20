import {useState, useEffect} from 'react';

//allows components to see if they should be rendering a mobile version or not
export default function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState<boolean>(() => window.matchMedia(query).matches);

    useEffect(() => {
        const mediaQueryList = window.matchMedia(query);
        const listener = (e: MediaQueryListEvent) => setMatches(e.matches);

        mediaQueryList.addEventListener('change', listener);
        return () => mediaQueryList.removeEventListener('change', listener);
    }, [query]);

    return matches;
}