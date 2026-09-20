import React, {useRef, lazy, Suspense} from 'react';
import PageHeader from "../../components/PageHeader.tsx";
import './map.scss'
import IconButton from "../../components/iconButton/IconButton.tsx";
import {useAuth} from "../../context/auth/AuthContext.tsx";

const GenericMarkupSection = lazy(() => import("../../components/genericMarkupSection/GenericMarkupSection.tsx"));
const FancyButton = lazy(() => import("../../components/fancyButton/FancyButton.tsx"));

export default function Map(): React.ReactElement {

    const {user} = useAuth();

    const wrapperRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    function toggleFullscreen(): void {
        if (document.fullscreenElement) {
            document.exitFullscreen()
                .catch(err => console.error("Failed to exit fullscreen: ", err));
        }
        else {
            iframeRef.current?.requestFullscreen()
                .catch(err => console.error("Failed to enter fullscreen: ", err));
        }
    }

    return (
        <React.Fragment>
            <PageHeader title={"Map"} subtitle={"A live map of the server!"} />

            {user ? (
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
            ) : (
                <Suspense>
                    <GenericMarkupSection title={"Access denied"}>
                        <p className={"errorText"}>
                            You don't have permission to see the map
                        </p>
                        <FancyButton label={"Log in / sign up here!"} to={"/account"} />
                    </GenericMarkupSection>
                </Suspense>
            )}

        </React.Fragment>
    )
}