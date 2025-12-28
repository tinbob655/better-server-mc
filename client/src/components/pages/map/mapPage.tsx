import React from 'react';
import PageHeader from '../../multiPageComponents/pageHeader';


export default function MapPage():React.ReactElement {

    return (
        <React.Fragment>
            <PageHeader title="World Map" subtitle="Explore a live world map" />

            {/* actual map. NOTE: will only render on the server */}
            <iframe
                src="http://better-server.world:8100/" title="Bluemap" id="worldMapIframe" allowFullScreen />
        </React.Fragment>
    );
};