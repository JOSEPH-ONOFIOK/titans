import Image from "next/image";
import styles from "./page.module.css";
import AllowlistForm from "./components/AllowlistForm";
import IntroOverlay from "./components/IntroOverlay";
import JoinCounter from "./components/JoinCounter";

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
        <Image
          src="/titans-banner.png"
          alt="Titans — Gods of Robinhood"
          fill
          sizes="100vw"
          priority
          className={styles.heroImage}
        />
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
        <section className={styles.gallery}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionIndex}>01</span>
            <h2 className={styles.sectionTitle}>THE PANTHEON</h2>
          </div>

          <div className={styles.filmstrip}>
            {GALLERY.map((src) => (
              <div key={src} className={styles.filmstripItem}>
                <Image
                  src={src}
                  alt="Titans god"
                  width={949}
                  height={949}
                  className={styles.filmstripImage}
                />
              </div>
            ))}
          </div>
        </section>

        <section className={styles.joinBand}>
          <JoinCounter />
        </section>

        <section id="allowlist" className={styles.allowlistSection}>
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
