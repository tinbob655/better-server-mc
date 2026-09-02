import React from 'react';
import {NavLink} from "react-router";
import './header.scss';

const pages: string[] = ['account', 'map', 'news', 'polls', 'serverStatus', 'suggestions', 'wiki'];

//turns a camelCase route path into a display label, e.g. "serverStatus" -> "Server Status"
function formatPageName(path: string): string {
    const spaced = path.replace(/([A-Z])/g, ' $1');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export default function Header(): React.ReactElement {

    return (
        <header>
            <NavLink to={"/"} className={"headerBrand"} end>
                <img src={"/logo.png"} alt={"Better Server logo"} />
                <span>Better Server</span>
            </NavLink>

            <nav>
                {pages.map((path) => (
                    <NavLink
                        key={path}
                        to={`/${path}`}
                        className={({isActive}) => `navLink ${isActive ? "active" : ""}`}
                    >
                        {formatPageName(path)}
                    </NavLink>
                ))}
            </nav>
        </header>
    )
}