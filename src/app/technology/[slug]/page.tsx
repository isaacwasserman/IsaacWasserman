import { Header } from "../../components/header";
import { Image } from "../../components/Image";
import styles from "./styles.module.css";
import { MyAnalytics } from "../../components/my_analytics";

// Import sanity client
import { client, dataset, projectId } from "../../../../sanity/lib/client";
import { SanityImage } from "sanity-image";
import { PortableText } from "@portabletext/react";
import { groq } from "next-sanity";
// Import url builder
import { getFile } from "@sanity/asset-utils";

import axios from "axios";
const PNG = require("pngjs").PNG;

const baseUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/`;

import type { Metadata, ResolvingMetadata } from "next";

type Props = {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const query = groq`*[_type == "post" && count((categories[]->title)[@ in ["Technology"]]) > 0 && slug.current == "${params.slug}"] | order(publishedAt desc) {
      title,
      subtitle
    }`;
    const post = (await client.fetch(query))[0];
    return {
        title: post.title + " - Isaac Wasserman",
        description: post.subtitle,
    };
}

export default async function TechnologyPostPage({
    params,
}: {
    params: { slug: string };
}) {
    const query = groq`*[_type == "post" && count((categories[]->title)[@ in ["Technology"]]) > 0 && slug.current == "${params.slug}"] | order(publishedAt desc) {
    title,
    subtitle,
    mainImage,
    figures[] {
      ...,
      asset-> {
        ...,
        metadata {
          ...,
          blurHash
        }
      }
    },
    body,
    publishedAt
  }`;
    const post = (await client.fetch(query))[0];
    let images = [];
    for (let i = 0; i < post.figures.length; i++) {
        const figure = post.figures[i];
        const index = i;
        var has_transparency = false;
        if (
            figure._type === "image" &&
            figure.asset._id.indexOf("-png") !== -1
        ) {
            const url =
                baseUrl +
                figure.asset._id.replace("image-", "").replace("-png", ".png");
            // Get image buffer
            const response = await axios.get(url, {
                responseType: "arraybuffer",
            });
            // Convert to uint8array
            const image_buffer = Buffer.from(response.data);
            // Create PNG object
            const image = PNG.sync.read(image_buffer);
            // Create array of pixels
            const pixels = [];
            for (let i = 0; i < image.data.length; i += 4) {
                if (image.data[i + 3] < 255) {
                    has_transparency = true;
                    break;
                }
            }
        }

        images.push(
            <div className={styles.project_figure_container} key={index}>
                <figure
                    className={
                        styles.project_figure +
                        " " +
                        (has_transparency ? "" : styles.shadow)
                    }
                >
                    {figure._type === "image" ? (
                        <Image
                            image={figure}
                            className={styles.project_image}
                        />
                    ) : null}

                    {figure._type === "video" ? (
                        <video
                            className={styles.project_image}
                            src={
                                getFile(figure.asset, client.config()).asset.url
                            }
                            autoPlay={true}
                            muted={true}
                            playsInline={true}
                        ></video>
                    ) : null}

                    <figcaption className={styles.project_figure_caption}>
                        {figure.caption}
                    </figcaption>
                </figure>
            </div>
        );
    }

    return (
        <main className={".page"}>
            <Header />
            <div className={styles.project}>
                <div className={styles.text_column}>
                    <h2 className={styles.project_title}>{post.title}</h2>
                    <h4 className={styles.project_subtitle}>{post.subtitle}</h4>
                    <h4 className={styles.project_date}>
                        {new Date(post.publishedAt).getFullYear()}
                    </h4>
                    <div
                        className={styles.project_body}
                        className={"portable_text"}
                    >
                        <PortableText value={post.body} />
                    </div>
                </div>
                <div className={styles.photo_column}>{images}</div>
            </div>
            <MyAnalytics route={`/technology/${params.slug}`} />
        </main>
    );
}

export async function generateStaticParams() {
    const query = groq`*[_type == "post" && count((categories[]->title)[@ in ["Technology"]]) > 0] | order(publishedAt desc) {
    slug
  }`;
    const posts = await client.fetch(query);

    return posts.map((post) => ({
        slug: post.slug.current,
    }));
}
