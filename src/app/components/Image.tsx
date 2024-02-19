"use client";

import { client, dataset, projectId } from '../../../sanity/lib/client';
import { SanityImage } from 'sanity-image';
import styles from './Image.module.css';

function Image({ image, width, height, className }) {
    const dimensions = image.asset.metadata.dimensions;
    if (height === undefined && width !== undefined) {
        height = width / dimensions.aspectRatio;
    }
    else if (width === undefined && height !== undefined) {
        width = height * dimensions.aspectRatio;
    }
    console.log(dimensions);
    return (
        <>
            {/* <style jsx>{`
            img {
                width: ${width}px;
                height: ${height}px;
            }
        `}</style> */}
            <SanityImage
                id={image.asset._id}
                className={image.asset._id + " " + className}
                baseUrl={`https://cdn.sanity.io/images/${projectId}/${dataset}/`}
                width={width}
                height={height}
                crop={image.crop}
                hotspot={image.hotspot}
                preview={image.asset.metadata.lqip}
            />
        </>
    );
}

export { Image };