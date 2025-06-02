import React from 'react';
import { Routes, Route } from 'react-router-dom';

//import all pages
import Home from './components/pages/home/home';
import Gallery from './components/pages/gallery/gallery';
import Info from './components/pages/info/info';
import Map from './components/pages/map/map';
import News from './components/pages/news/news';
import Players from './components/pages/players/players';
import Stats from './components/pages/stats/stats';

export default function AppRoutes():React.ReactElement {

    function getRoutes():React.ReactElement[] {
        let tempRoutesHTML:React.ReactElement[] = [];
        const pages:any = {
            ['']: <Home/>,
            gallery: <Gallery/>,
            info: <Info/>,
            map: <Map/>,
            news: <News/>,
            players: <Players/>,
            stats: <Stats/>,
        };

        //for each key, add the route
        for(let key in pages) {
            tempRoutesHTML.push(
                <Route path={`/${key}`} key={key} element={pages[key]} />
            );
        };

        return tempRoutesHTML;
    };

    return (
        <Routes>

            {getRoutes()}
        </Routes>
    );
};