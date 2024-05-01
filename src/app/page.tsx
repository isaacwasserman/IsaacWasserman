// import Link from "next/link";
import { Link } from "nextjs13-progress";
import styles from "./styles.module.css";
import { Image } from "./components/Image";
import { MyAnalytics } from "./components/my_analytics";

import { client, dataset, projectId } from "../../sanity/lib/client";
import { groq } from "next-sanity";

export default async function Home() {
    const query = groq`*[_type == "author"] {
    image {
      ...,
      asset->
    }
  }`;
    let bio = (await client.fetch(query))[0];
    return (
        <main className={styles.page}>
            <Image
                image={bio.image}
                className={styles.background_image}
                q={100}
                sharpen={50}
                mode={"cover"}
            />
            <div className={styles.navigator}>
                <h1 className={styles.name}>
                    Isaac
                    <br />
                    Wasserman
                </h1>
                <p className={styles.descriptors}>
                    <span>
                        <Link
                            href={"/technology"}
                            prefetch
                            className={`${styles.page_link} ${styles.technologist_link}`}
                        >
                            Technologist
                        </Link>
                        ,
                    </span>
                    <span>
                        <Link
                            href={"/gallery"}
                            prefetch
                            className={`${styles.page_link} ${styles.creative_link}`}
                        >
                            Creative
                        </Link>
                        ,
                    </span>
                    <span>
                        <Link
                            href={"/cooking"}
                            prefetch
                            className={`${styles.page_link} ${styles.chef_link}`}
                        >
                            Chef
                        </Link>
                        .
                    </span>
                </p>
                <div className={styles.external_link_container}>
                    <Link
                        className={styles.external_link}
                        href="https://www.linkedin.com/in/isaacrwasserman/"
                    >
                        <img
                            className={styles.external_link_image}
                            src="/images/linkedin_logo.svg"
                        />
                    </Link>
                    <Link
                        className={styles.external_link}
                        href="https://scholar.google.com/citations?user=eLh9ejcAAAAJ"
                    >
                        <img
                            className={styles.external_link_image}
                            src="/images/google_scholar_logo.svg"
                        />
                    </Link>
                </div>
            </div>
            <MyAnalytics route={"/"} />
        </main>
    );
}
