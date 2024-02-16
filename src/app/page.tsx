import Link from "next/link";
import styles from "./styles.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
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
      </div>
    </main>
  );
}
