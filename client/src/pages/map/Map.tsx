import React, {useRef} from 'react';
import PageHeader from "../../components/PageHeader.tsx";
import './map.scss'
import IconButton from "../../components/iconButton/IconButton.tsx";

export default function Map(): React.ReactElement {

    const wrapperRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    function toggleFullscreen(): void {
        if (document.fullscreenElement) {
            document.exitFullscreen()
                .catch(err => console.error("Failed to exit fullscreen:", err));
        } else {
            iframeRef.current?.requestFullscreen()
                .catch(err => console.error("Failed to enter fullscreen:", err));
        }
    }

    return (
        <React.Fragment>
            <PageHeader title={"Map"} subtitle={"A live map of the server!"} />

            <div id={"bluemapWrapper"} ref={wrapperRef}>
                <IconButton
                    imageLoader={() => import("../../assets/images/buttons/fullscreen.svg")}
                    showElementRef={wrapperRef}
                    onClick={toggleFullscreen}
                    alt={"Toggle fullscreen"}
                />
                <iframe
                    id={"bluemapFrame"}
                    src={"https://better-server.world/bluemap"}
                    title={"Server Bluemap"}
                    allow={"fullscreen"}
                    ref={iframeRef}
                />
            </div>
        </React.Fragment>
    )
}