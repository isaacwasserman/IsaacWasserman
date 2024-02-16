import Link from 'next/link'
import styles from "./header.module.css";

function Header() {
  return (
    <div className={styles.header}>
      <Link href={"/"}><div className={styles.title}>Isaac Wasserman</div></Link>
      <nav className={styles.nav}>
        <span><Link href={"/technology"} prefetch>Technologist</Link>,</span>&nbsp;
        <span><Link href={"/gallery"} prefetch>Creative</Link>,</span>&nbsp;
        <span><Link href={"/cooking"} prefetch>Chef</Link>.</span>
      </nav>
    </div>
  );
}

export { Header };