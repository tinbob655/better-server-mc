import React from 'react';
import { Route, Routes } from 'react-router';


//import all pages
import Home from './components/pages/home/home';
import Admin from './components/pages/admin/admin';
import Feed from './components/pages/feed/feed';
import Players from './components/pages/players/players';
import MapPage from './components/pages/map/mapPage';
import ServiceStatus from './components/pages/serviceStatus/serviceStatus';
import Account from './components/pages/account/account';
import Mods from './components/pages/mods/mods';

export default function AllRoutes():React.ReactElement {

    function getRoutes():React.ReactElement[] {
        let tempRoutes:React.ReactElement[] = []
        const pages:[String, React.ReactElement][] = [
            ['', <Home/>],
            ['map', <MapPage/>],
            ['admin', <Admin/>],
            ['feed', <Feed/>],
            ['players', <Players/>],
            ['serviceStatus', <ServiceStatus/>],
            ['account', <Account/>],
            ['mods', <Mods/>],
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