'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Landing.module.css';
import demonLogo from '../../../public/images/depaul_demon_chef.svg';

export default function Landing() {
  return (
    <div className={styles.wrapper}>
<header className={styles.header}>
  <div className={styles.brand}>
    <Image
      src={demonLogo}
      alt="DePaul Demon Chef"
      width={60}
      height={60}
      className={styles.brandLogo}
    />
  </div>

  <div className={styles.textBlock}>
    <h1 className={styles.title}>
      Enhancing Dynamic Personalization in Dietitian Agents with RAG and Medical Dialogue Fine-Tuning
    </h1>
    <h2 className={styles.authors}>
      Joshua Shargo, Carlos Ortiz, Noriko Tomuro
    </h2>
    <p className={styles.subtitle}>
      Powered by DePaul spirit and AI nutrition
    </p>
  </div>
</header>




      {/* Main content */}
      <main className={styles.mainContent}>
        /
  <h2>Select your preferred interface theme:</h2>
  <div className={styles.themeButtons}>
    <Link href="/dietbot">
      <button className={styles.themeButton}>Classic Theme</button>
    </Link>
    <Link href="/dietbot-v2">
      <button className={styles.themeButton}>DePaul BlueDemon Theme</button>
    </Link>
  </div>
</main>
    </div>
  );
}
