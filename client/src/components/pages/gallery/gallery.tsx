import React from 'react';
import PageHeader from '../../multiPageComponents/pageHeader';
import ImageSlider from './imageSlider';

export default function Gallery():React.ReactElement {

    return (
        <React.Fragment>
            <PageHeader title="Gallery" subtitle="A tour of our server" />

            <ImageSlider images={['image1', 'image2', 'image3', 'image4', 'image5', 'image6', 'image7']} />
        </React.Fragment>
    );
};