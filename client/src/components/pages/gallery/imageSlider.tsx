import React, {useState, useEffect} from 'react';

interface params {
    images: string[];
};

export default function imageSlider({images}:params):React.ReactElement {

    const [leftmostImage, setLeftmostImage] = useState<number>(0);
    const [oldLeftmostImage, setOldLeftmostImage] = useState<number>(-1);

    useEffect(() => {

        /* will fire when the leftmost image is changed
        we need to animate the images being moved either left or right */
        if (leftmostImage > oldLeftmostImage) {

            //images need to move from right to left
        }
        else if (leftmostImage < oldLeftmostImage) {

            //images need to move from left to right
        }
        else {

            //the images did not need to move due to an error so reset the slider
            setLeftmostImage(0);
            setOldLeftmostImage(-1);
            throw new Error('Images did not need to move? Have reset images back to their original states.')
        };

        //finally, set the oldLeftmostImage to the current leftmostImage
        setOldLeftmostImage(leftmostImage);
    }, [leftmostImage]);

    return (
        <React.Fragment>

            {/*left arrow button*/}
            <button type="button" onClick={() => {setLeftmostImage(leftmostImage - 1 < 0 ? images.length - 1 : leftmostImage - 1)}}>
                <h3>
                    Previous
                </h3>
            </button>

            {/*3 images visible at a time*/}
            <table>
                <thead>
                    <tr>
                        <td>
                            <p>
                                {leftmostImage % images.length}
                            </p>
                        </td>
                        <td>
                            <p>
                                {(leftmostImage + 1) % images.length}
                            </p>
                        </td>
                        <td>
                            <p>
                                {(leftmostImage +2) % images.length}
                            </p>
                        </td>
                    </tr>
                </thead>
            </table>

            {/*right arrow button*/}
            <button type="button" onClick={() => {setLeftmostImage((leftmostImage + 1) & images.length)}}>
                <h3>
                    Next
                </h3>
            </button>
        </React.Fragment>
    );
};