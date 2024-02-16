import Image from 'next/image';
import imageUrlBuilder from '@sanity/image-url'
import styles from "./post_feed.module.css";

import { client, dataset, projectId } from '../../../sanity/lib/client';
import { PortableText } from '@portabletext/react';
import { getFile } from "@sanity/asset-utils";

async function PostFeed({ posts }) {
    return (
        <div className={styles.feed}>
            {posts.map((post, i) => (
                <div className={styles.post} key={i}>
                    <div className={styles.post_content}>
                        <p className={styles.post_title}>{post.title}</p>
                        <p className={styles.post_subtitle}>{post.subtitle}</p>
                        <div className={styles.post_info}>
                            <span className={styles.post_date}>{(new Date(post.publishedAt)).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                        </div>
                        <div className={styles.post_body + " portable_text"}>
                            <PortableText value={post.body} />
                        </div>
                        {
                            post.figures.map((figure, j) => (
                                <div className={styles.figure} key={j}>
                                    {
                                        figure._type === "image" ? (
                                            <Image
                                                src={imageUrlBuilder({ projectId, dataset }).image(figure).url()}
                                                width={800}
                                                height={200}
                                                className={styles.figure_image}
                                            />
                                        )
                                            :
                                            (<video
                                                className={styles.project_image}
                                                src={getFile(figure.asset, client.config()).asset.url}
                                                autoPlay={true}
                                                muted={true}
                                                className={styles.figure_image}
                                            />)
                                    }
                                    <p className={styles.figure_caption}>{figure.caption}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            ))}
        </div>
    );
}

export { PostFeed };