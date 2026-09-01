import React from 'react';
import {createPortal} from "react-dom";
import './popupWrapper.scss';

interface PopupWrapperParams {
    children: React.ReactNode;
    closeFunction: (e?: React.MouseEvent) => void;
}

export default function PopupWrapper({children, closeFunction}: PopupWrapperParams): React.ReactElement {

    return createPortal(
        <div className={"popupOverlay"} onClick={closeFunction}>

            {/*actual popup*/}
            <div className={"popupWrapper"} onClick={(e) => e.stopPropagation()}>
                <button className={"closePopupButton"} type={"button"} onClick={closeFunction}>
                    ✖
                </button>
                {children}
            </div>
        </div>,
        document.body
    )
}