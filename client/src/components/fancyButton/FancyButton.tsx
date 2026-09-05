import React from 'react';
import {Link} from "react-router";
import './fancyButton.scss';

interface FancyButtonBaseParams {
    label: string;
    disabled?: boolean;
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

export default function FancyButton({label, alignment, to, onClick, disabled}: FancyButtonParams): React.ReactElement {

    const alignmentClassName: string = alignment ? alignment === 'LEFT' ? "alignLeft"  : "alignRight" : "";

    //button is a link
    if (to) return (
        <Link to={to} className={`fancyButton ${alignmentClassName}`}>
            <span className={"fancyButtonLabel"}>{label}</span>
        </Link>
    )

    //button calls a function
    else return (
        <button type={"button"} className={`fancyButton ${alignmentClassName} ${disabled ? "disabled" : ''}`} onClick={onClick} disabled={disabled}>
            <span className={"fancyButtonLabel"}>{label}</span>
        </button>
    )
}