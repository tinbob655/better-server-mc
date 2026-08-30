import React from 'react';
import {Link} from "react-router";
import './fancyButton.scss';

interface FancyButtonBaseParams {
    label: string;
    alignment?: 'LEFT' | 'RIGHT';
}

interface FancyButtonLinkParams extends FancyButtonBaseParams {
    to: string;
    onClick?: never;
}

interface FancyButtonActionParams extends FancyButtonBaseParams {
    to?: never;
    onClick: () => void;
}

type FancyButtonParams = FancyButtonLinkParams | FancyButtonActionParams;

export default function FancyButton({label, alignment, to, onClick}: FancyButtonParams): React.ReactElement {

    //button is a link
    if (to) return (
        <Link to={to} className={`fancyButton ${alignment}`}>
            <span className={"fancyButtonLabel"}>{label}</span>
        </Link>
    )

    //button calls a function
    else return (
        <button type={"button"} className={`fancyButton ${alignment}`} onClick={onClick}>
            <span className={"fancyButtonLabel"}>{label}</span>
        </button>
    )
}