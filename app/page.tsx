import Image from "next/image";
import styles from "./page.module.css";
import AllowlistForm from "./components/AllowlistForm";
import GalleryMarquee from "./components/GalleryMarquee";
import IntroOverlay from "./components/IntroOverlay";
import JoinCounter from "./components/JoinCounter";
import LightningVeins from "./components/LightningVeins";
import ParallaxHero from "./components/ParallaxHero";
import Reveal from "./components/Reveal";

const GALLERY = [
  "/titans-nft-01.png",
  "/titans-nft-02.png",
  "/titans-nft-03.png",
  "/titans-nft-04.png",
  "/titans-nft-05.png",
  "/titans-nft-06.png",
  "/titans-nft-07.png",
  "/titans-nft-09.png",
  "/titans-nft-10.png",
];

export default function Home() {
  return (
    <div className={styles.page}>
      <LightningVeins />
      <IntroOverlay />

      <header className={styles.nav}>
        <div className={styles.navBrand}>
          <Image
            src="/titans-logo.png"
            alt=""
            width={26}
            height={26}
            className={styles.navMark}
          />
          <span className={styles.navLogo}>TITANS</span>
        </div>
        <a className={styles.navLink} href="#allowlist">
          Claim Your Seat
        </a>
      </header>

      <section className={styles.hero}>
        <ParallaxHero />
        <div className={styles.heroLightning} aria-hidden="true" />
        <svg
          className={`${styles.heroBolt} ${styles.heroBoltLeft}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M13 2 3 14h7l-1 8 11-14h-7l1-6z" />
        </svg>
        <svg
          className={`${styles.heroBolt} ${styles.heroBoltRight}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M13 2 3 14h7l-1 8 11-14h-7l1-6z" />
        </svg>
        <div className={styles.heroScrim} />

        <div className={styles.heroContent}>
          <p className={styles.heroKicker}>GODS OF ROBINHOOD</p>
          <p className={styles.heroLine}>
            Twelve gods. One chain. Forged in lightning for those who came to
            rule, not spectate.
          </p>
          <a href="#allowlist" className={styles.heroCta}>
            Claim Your Seat →
          </a>
        </div>

        <span className={styles.scrollCue} aria-hidden="true" />
      </section>

      <main className={styles.main}>
        <section>
          <Reveal className={styles.gallery}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionIndex}>01</span>
              <h2 className={styles.sectionTitle}>THE PANTHEON</h2>
            </div>

            <GalleryMarquee images={GALLERY} />
          </Reveal>
        </section>

        <section>
          <Reveal className={styles.joinBand}>
            <JoinCounter />
          </Reveal>
        </section>

        <section id="allowlist">
          <Reveal className={styles.allowlistSection}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionIndex}>02</span>
              <h2 className={styles.sectionTitle}>SECURE YOUR SEAT</h2>
            </div>

            <div className={styles.allowlistRow}>
              <p className={styles.aboutText}>
                Drop your wallet below to lock in for the WL phase. If your
                community gets allocation, every submitted wallet gets added
                to the whitelist for mint.
              </p>
              <AllowlistForm />
            </div>
          </Reveal>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Titans. Gods of Robinhood.</p>
        <a
          href="https://x.com/titanshood_"
          target="_blank"
          rel="noopener noreferrer"
        >
          Follow on X ↗
        </a>
      </footer>
    </div>
  );
}
