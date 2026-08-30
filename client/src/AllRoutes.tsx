import React, {lazy} from 'react';
import {Route, Routes} from 'react-router';

//import all pages
const Home = lazy(() => import('./pages/home/Home.tsx'));
const Account = lazy(() => import('./pages/account/Account.tsx'));
const Map = lazy(() => import('./pages/map/Map.tsx'));
const News = lazy(() => import('./pages/news/News.tsx'));
const Polls = lazy(() => import('./pages/polls/Polls.tsx'));
const ServerStatus = lazy(() => import('./pages/serverStatus/ServerStatus.tsx'));
const Suggestions = lazy(() => import('./pages/suggestions/Suggestions.tsx'));
const Wiki = lazy(() => import('./pages/wiki/Wiki.tsx'));

const pageInfo: [string, React.ComponentType][] = [
    ['', Home],
    ['account', Account],
    ['map', Map],
    ['news', News],
    ['polls', Polls],
    ['serverStatus', ServerStatus],
    ['suggestions', Suggestions],
    ['wiki', Wiki],
];

export default function AllRoutes(): React.ReactElement {

    return (
        <Routes>
            {pageInfo.map(([path, Component]) =>
                <Route key={path} path={`/${path}`} element={<Component/>} />
            )}
        </Routes>
    )
}