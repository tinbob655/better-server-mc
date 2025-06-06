import React from 'react';
import { Link } from 'react-router-dom';

export default function Header():React.ReactElement {

    function getHeaders():React.ReactElement[] {
        const headers:Array<Array<string>> = [
            ['Home', ''],
            ['Gallery', 'gallery'],
            ['Info', 'info'],
            ['Map', 'map'],
            ['News', 'news'],
            ['Players', 'players'],
            ['Stats', 'stats'],
        ];
        let tempHeadersHTML:React.ReactElement[] = [];

        headers.forEach((header:Array<string>) => {
            tempHeadersHTML.push(
                <td onMouseOver={() => {cellHovered(header[1])}} onMouseLeave={() => {cellUnhovered(header[1])}}>

                    <div className="headerLine" id={`${header[1].toLowerCase()}UpperLine`} style={{marginTop: '5px'}}></div>

                    <Link to={`/${header[1].toLowerCase()}`} >
                        <h2 className="headerText">
                            {header[0]}
                        </h2>
                    </Link>

                    <div className="headerLine headerLineBottom" id={`${header[1].toLowerCase()}LowerLine`} style={{marginBottom: '5px', marginTop: 'auto'}}></div>

                </td>
            );
        });

        return tempHeadersHTML;
    };

    return (
        <header>
            <div id="headerWrapper">
                <table>
                    <thead>
                        <tr>
                            {getHeaders()}
                        </tr>
                    </thead>
                </table>
            </div>
        </header>
    );



    //two functions, one for when the cell is hovered over and once for when it is unhovered
    //the reason for two functions is that using one and toggling the class causes errors
    function cellHovered(header:string):void {
        const [upperLine, lowerLine]:[HTMLElement, HTMLElement] = [document.getElementById(`${header.toLowerCase()}UpperLine`) as HTMLElement, document.getElementById(`${header.toLowerCase()}LowerLine`) as HTMLElement];

        //make the lines slide in staggered
        upperLine.classList.add('shown');
        setTimeout(() => {
            lowerLine.classList.add('shown');
        }, 100);
    };

    function cellUnhovered(header:string):void {
        const [upperLine, lowerLine]:[HTMLElement, HTMLElement] = [document.getElementById(`${header.toLowerCase()}UpperLine`) as HTMLElement, document.getElementById(`${header.toLowerCase()}LowerLine`) as HTMLElement];

        //make the lines slide in staggered
        upperLine.classList.remove('shown');
        setTimeout(() => {
            lowerLine.classList.remove('shown');
        }, 100);
    };
};