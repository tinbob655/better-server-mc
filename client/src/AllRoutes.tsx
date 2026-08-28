import React, {lazy} from 'react';
import {Route, Routes} from 'react-router';

//import all pages
const Home = lazy(() => import('./pages/home/Home.tsx'));

const pageInfo: [string, React.ComponentType][] = [
    ['', Home],
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