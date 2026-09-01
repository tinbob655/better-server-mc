import React, {useEffect, useRef, useState} from 'react';
import {createPortal} from "react-dom";
import './popupWrapper.scss';

interface PopupWrapperParams {
    children: React.ReactNode;
    closeFunction: (e?: React.MouseEvent) => void;
}

const ANIMATION_DURATION_MS: number = 320;

export default function PopupWrapper({children, closeFunction}: PopupWrapperParams): React.ReactElement {

    const [isClosing, setIsClosing] = useState<boolean>(false);
    const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    //plays the animation then closes the popup
    function handleClose(e?: React.MouseEvent): void {
        if (isClosing) return;

        setIsClosing(true);
        closeTimeout.current = setTimeout(() => closeFunction(e), ANIMATION_DURATION_MS);
    }

    useEffect(() => {
        return () => {
            if (closeTimeout.current) clearTimeout(closeTimeout.current);
        }
    }, [])

    return createPortal(
        <div
            className={`popupOverlay ${isClosing ? "closing" : ""}`}
            style={{"--popup-anim-duration": `${ANIMATION_DURATION_MS}ms`} as React.CSSProperties}
            onClick={handleClose}
        >

            {/*actual popup*/}
            <div className={"popupWrapper"} onClick={(e) => e.stopPropagation()}>
                <button className={"closePopupButton"} type={"button"} onClick={handleClose}>
                    ✖
                </button>
                {children}
            </div>
        </div>,
        document.body
    )
}