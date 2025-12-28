import React, {useRef} from 'react';
import PageHeader from '../../multiPageComponents/pageHeader';
import fullscreenButtonImage from '../../../assets/images/fullscreenButton.svg';


export default function MapPage():React.ReactElement {

    const worldMapIframe = useRef<HTMLIFrameElement>(null);
    const fullscreenButton = useRef<HTMLButtonElement>(null);

    function toggleFullscreen(): void {
        worldMapIframe.current?.requestFullscreen();
    }

    function mapHovered():void {
        fullscreenButton.current?.classList.add('shown');
    };

    function mapUnhovered():void {
        fullscreenButton.current?.classList.remove('shown');
    };

    return (
        <React.Fragment>
            <PageHeader title="World Map" subtitle="Explore a live world map" />

            <div id="worldMapWrapper" onMouseOver={mapHovered} onMouseLeave={mapUnhovered}>
                <button onClick={toggleFullscreen} type="button" id="worldMapFullscreenButton" ref={fullscreenButton}>
                    <img src={fullscreenButtonImage} className="button" />
                </button>
                
                {/* actual map */}
                <iframe src="https://better-server.world/bluemap/" title="Bluemap" id="worldMapIframe" allowFullScreen ref={worldMapIframe} />
            </div>

        </React.Fragment>
    );
};