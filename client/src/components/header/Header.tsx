import React, {useEffect, useRef, useState} from 'react';
import {NavLink} from "react-router";
import './header.scss';
import {useAuth} from "../../context/auth/AuthContext.tsx";
import ProfilePicture from "../profilePicture/ProfilePicture.tsx";
import useMediaQuery from "../../hooks/useMediaQuery.ts";

//turns a camelCase route path into a display label, e.g. "serverStatus" -> "Server Status"
function formatPageName(path: string): string {
    const spaced = path.replace(/([A-Z])/g, ' $1');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export default function Header(): React.ReactElement {

    const {user} = useAuth();
    const isDev = user?.maxPermission === 10;

    const pages: string[] = [
        'map',
        'news',
        'polls',
        'serverStatus',
        'suggestions',
        'players',
        'leaderboards',
        'wiki',
        ...(isDev ? ['admin'] : []),
    ];

    //the nav collapses behind a hamburger when on mobile
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const headerRightRef = useRef<HTMLDivElement>(null);

    //auto-close if the window is resized/rotated back up to desktop width
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (!isMobile) setMenuOpen(false);
    }, [isMobile]);

    //close the menu if the user taps/clicks outside of it
    useEffect(() => {
        function handleClickOutside(e: MouseEvent): void {
            if (headerRightRef.current && !headerRightRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header>

            {/*better server logo which navigates to home*/}
            <NavLink to={"/"} className={"headerBrand"} end onClick={() => setMenuOpen(false)}>
                <img src={"/logo.png"} alt={"Better Server logo"} />
                <span>Better Server</span>
            </NavLink>

            <div className={"headerRight"} ref={headerRightRef}>

                {/*page links*/}
                <nav className={menuOpen ? "open" : ""}>
                    {pages.map((path) => (
                        <NavLink
                            key={path}
                            to={`/${path}`}
                            className={({isActive}) => `navLink ${isActive ? "active" : ""} ${path === 'admin' ? "admin" : ""}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            {formatPageName(path)}
                        </NavLink>
                    ))}
                </nav>

                {/*hamburger for mobile*/}
                <button
                    type={"button"}
                    className={`navToggle ${menuOpen ? "open" : ""}`}
                    onClick={() => setMenuOpen(prev => !prev)}
                    aria-label={"Toggle navigation menu"}
                    aria-expanded={menuOpen}
                >
                    <span/><span/><span/>
                </button>

                {/*account icon which navigates to account page*/}
                <NavLink
                    key={'account'}
                    to={"/account"}
                    className={"accountLink"}
                    onClick={() => setMenuOpen(false)}
                >
                    <ProfilePicture username={user?.username} size={40} />
                </NavLink>
            </div>
        </header>
    )
}