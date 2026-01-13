import React from 'react';


interface params {
    elements: [string, string][],
    left: boolean,
};

export default function AnchorList({elements, left}:params):React.ReactElement {


    const alignmentClass = left ? "alignLeft" : "alignRight";

    function getList():React.ReactElement[] {
        let tempListHTML:React.ReactElement[] = [];
    
        //generate an anchor for each element in the list
        elements.forEach((element) => {
            tempListHTML.push(
                <li className={alignmentClass}>
                    <a href={element[1]} target="_blank">
                        <h3 className={alignmentClass}>
                            {element[0]}
                        </h3>
                    </a>
                </li>
            );
        });
        return tempListHTML;
    };

    return (
        <React.Fragment>
            <ul className={alignmentClass}>
                {getList()}
            </ul>
        </React.Fragment>
    );
};
