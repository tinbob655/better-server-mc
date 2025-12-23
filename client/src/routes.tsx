import React from 'react';
import { Route, Routes } from 'react-router';


//import all pages
import Home from './components/pages/home/home';
import Admin from './components/pages/admin/admin';
import Feed from './components/pages/feed/feed';
import Playerbase from './components/pages/playerbase/playerbase';
import Wiki from './components/pages/wiki/wiki';

export default function AllRoutes():React.ReactElement {

    function getRoutes():React.ReactElement[] {
        let tempRoutes:React.ReactElement[] = []
        const pages:[String, React.ReactElement][] = [
            ['', <Home/>],
            ['admin', <Admin/>],
            ['feed', <Feed/>],
            ['playerbase', <Playerbase/>],
            ['wiki', <Wiki/>],
        ];

        //generate routes
        pages.forEach((page) => {
            tempRoutes.push(
                <Route element={page[1]} path={`/${page[0]}`} />
            );
        });
        return tempRoutes;
    };

    return (
        <React.Fragment>
            <Routes>
                {getRoutes()}
            </Routes>
        </React.Fragment>
    );
};