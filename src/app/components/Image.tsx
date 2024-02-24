"use client";

import { client, dataset, projectId } from '../../../sanity/lib/client';
import { SanityImage } from 'sanity-image';
import styles from './Image.module.css';
import { blurHashToDataURL } from './blurhash_url'

function Image({ image, width, height, className, mode, ...props }) {
    const dimensions = image.asset.metadata.dimensions;
    if (height === undefined && width !== undefined) {
        height = width / dimensions.aspectRatio;
    }
    else if (width === undefined && height !== undefined) {
        width = height * dimensions.aspectRatio;
    }
    else if (width === undefined && height === undefined) {
        width = dimensions.width;
        height = dimensions.height;
    }
    let queryParams = {};
    for (let prop in props) {
        queryParams[prop] = props[prop];
    }

    const blurHash = image.asset.metadata.blurHash;
    const blurDataURL = blurHashToDataURL(blurHash);

    return (
        <SanityImage
            id={image.asset._id}
            className={image.asset._id + " " + className}
            baseUrl={`https://cdn.sanity.io/images/${projectId}/${dataset}/`}
            width={width}
            height={height}
            mode={mode}
            crop={image.crop}
            hotspot={image.hotspot}
            preview={blurDataURL}
            queryParams={queryParams}
        />
    );
}

export { Image };