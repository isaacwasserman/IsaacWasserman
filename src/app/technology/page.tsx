// import Link from "next/link";
import { Link } from 'nextjs13-progress';
import Image from 'next/image';
import imageUrlBuilder from '@sanity/image-url'
import { Header } from "../components/header";
import { NoiseRenderer } from "../components/noise_renderer";
import styles from "./styles.module.css";
import { MyAnalytics } from '../components/my_analytics';

// Import sanity client
import { client, dataset, projectId } from '../../../sanity/lib/client';
import { SanityImage } from "sanity-image"
import { groq } from 'next-sanity';

export default async function TechnologyPage() {
  // Fetch posts with category "technology"
  const query = groq`*[_type == "post" && count((categories[]->title)[@ in ["Technology"]]) > 0] | order(publishedAt desc) {
    title,
    subtitle,
    mainImage,
    slug
  }`;
  const posts = await client.fetch(query);
  const baseUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/`;
  return (
    <main className={styles.page}>
      <Header/>
      <h1 className={styles.title}>Tech Projects:</h1>
      <div className={styles.gallery}>
      {posts.map((post, i) => (
        <Link href={"/technology/" + post.slug.current} key={i}>
          <div className={styles.gallery_item} key={i}>
            {/* <NoiseRenderer className={styles.noise_canvas} id={"noise_canvas_" + i} color={[0, 0, 0]} opacity={0.1} density={0.8} complexity={8}/> */}
            <div className={styles.gallery_item_image}>
              <SanityImage
                id={post.mainImage.asset._ref}
                baseUrl={baseUrl}
                width={300}
                height={175}
                mode={"cover"}
                crop={post.mainImage.crop}
                hotspot={post.mainImage.hotspot}
              />
            </div>
            <div className={styles.gallery_item_text}>
              <div className={styles.gallery_item_title}>{post.title}</div>
              <div className={styles.gallery_item_description}>{post.subtitle}</div>
            </div>
          </div>
        </Link>
      ))}
      </div>
      <MyAnalytics route={"/technology"}/>
    </main>
  );
}
