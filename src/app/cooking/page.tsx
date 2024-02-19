import { Header } from "../components/header";
import styles from "./styles.module.css";

// Import sanity client
import { client, dataset, projectId } from '../../../sanity/lib/client';
import { groq } from 'next-sanity';

import { PostFeed } from "../components/post_feed";

export default async function TechnologyPage() {
  // Fetch posts with category "technology"
  const query = groq`*[_type == "post" && count((categories[]->title)[@ in ["Cooking"]]) > 0] | order(publishedAt desc) {
    title,
    subtitle,
    mainImage,
    figures[] {
      ...,
      asset->
    },
    body,
    publishedAt,
    slug
  }`;
  const posts = await client.fetch(query);
  const baseUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/`;

  return (
    <main className={styles.page}>
      <Header />
      <h1 className={styles.title}>Cooking Journal:</h1>
      <PostFeed posts={posts} />
    </main>
  );
}
