import styles from "./page.module.css";
import AllowlistForm from "./components/AllowlistForm";
import CustomCursor from "./components/CustomCursor";
import FAQ from "./components/FAQ";
import GalleryColumns from "./components/GalleryColumns";
import IntroOverlay from "./components/IntroOverlay";
import JoinCounter from "./components/JoinCounter";
import LightningVeins from "./components/LightningVeins";
import MagneticLink from "./components/MagneticLink";
import Nav from "./components/Nav";
import ParallaxHero from "./components/ParallaxHero";
import Reveal from "./components/Reveal";
import SacredNumbers from "./components/SacredNumbers";
import Ouroboros from "./components/Ouroboros";
import SealBadge from "./components/SealBadge";
import TheCore from "./components/TheCore";
import Ticker from "./components/Ticker";

const GALLERY = [
  {
    src: "/titans-nft-01.png",
    alt: "Titan in a winged bronze helmet with a cybernetic arm and a glowing green chest core",
  },
  {
    src: "/titans-nft-02.png",
    alt: "Pale-eyed Titan with white hair, a red cape, and cybernetic collar rings framing a glowing chest core",
  },
  {
    src: "/titans-nft-03.png",
    alt: "Titan in a wide conical hat with a rope-bound cybernetic arm and draped red cloth",
  },
  {
    src: "/titans-nft-04.png",
    alt: "Green-skinned Titan with a golden hair streak and an ornate gold pharaoh-style collar",
  },
  {
    src: "/titans-nft-05.png",
    alt: "Bald Titan with glowing green eyes, a dark red cloak, and cybernetic shoulder armor",
  },
  {
    src: "/titans-nft-06.png",
    alt: "Grey-skinned Titan with spiked shoulder armor, a gold arm band, and a braided ponytail",
  },
  {
    src: "/titans-nft-07.png",
    alt: "Titan general in a fur-trimmed red coat with gold epaulettes and a ceremonial sash",
  },
  {
    src: "/titans-nft-09.png",
    alt: "Red-skinned Titan with blond hair and black cybernetic shoulder armor over a white toga",
  },
  {
    src: "/titans-nft-10.png",
    alt: "Blue-skinned Titan pharaoh in a striped nemes headdress topped with a golden falcon",
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <CustomCursor />
      <Ouroboros />
      <LightningVeins />
      <IntroOverlay />
      <Nav />

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

        <div className={styles.heroSeal}>
          <SealBadge />
        </div>

        <div className={styles.heroContent}>
          <p className={styles.heroKicker}>GODS OF ROBINHOOD</p>
          <p className={styles.heroLine}>
            3,000 Titans. One Pantheon.
            <br />
            Forged in lightning. Built to become something bigger than the
            PFP.
          </p>
          <MagneticLink href="#allowlist" className={styles.heroCta}>
            Enter the Pantheon →
          </MagneticLink>
        </div>

        <span className={styles.heroSector} aria-hidden="true">
          SECTOR: ROBINHOOD
        </span>

        <span className={styles.scrollCue} aria-hidden="true" />
      </section>

      <Reveal className={styles.numbersWrap}>
        <SacredNumbers />
        <Ticker />
      </Reveal>

      <main className={styles.main}>
        <section id="vision">
          <Reveal className={`${styles.firstThousand} revealSlide`}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionIndex}>01</span>
              <h2 className={styles.sectionTitle}>THE FIRST 3,000</h2>
            </div>
            <p className={styles.firstThousandLine}>
              Every world has an origin. These are ours.
            </p>
            <p className={styles.firstThousandBody}>
              The original Titans form the genesis collection and the
              foundation of the characters, culture and universe we intend to
              build around them.
            </p>
          </Reveal>
        </section>

        <section id="allowlist">
          <Reveal className={styles.allowlistSection}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionIndex}>02</span>
              <h2 className={styles.sectionTitle}>ENTER THE PANTHEON</h2>
            </div>

            <div className={styles.allowlistRow}>
              <p className={styles.aboutText}>
                The gates are opening. Submit your wallet for a chance to
                join the first 3,000.
              </p>
              <AllowlistForm />
            </div>
          </Reveal>
        </section>

        <section>
          <Reveal className={styles.joinBand}>
            <JoinCounter />
          </Reveal>
        </section>

        <section id="lore" className={styles.loreSection}>
          <Reveal className={`${styles.chronicle} revealScale`}>
            <span className={styles.chronicleEyebrow}>[ CHRONICLE I ]</span>
            <span className={styles.chronicleSub}>THE AWAKENING</span>
            <p className={styles.chronicleLine}>
              Titans are powerful beings from one shared Pantheon.
            </p>
          </Reveal>
        </section>

        <section id="pantheon">
          <Reveal className={styles.gallery}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionIndex}>03</span>
              <h2 className={styles.sectionTitle}>THE PANTHEON</h2>
            </div>
            <p className={styles.gallerySub}>
              3,000 characters. Different forms, bloodlines and identities.
              One world.
            </p>

            <GalleryColumns images={GALLERY} />
          </Reveal>
        </section>

        <Reveal className="revealScale">
          <TheCore />
        </Reveal>

        <section>
          <Reveal className={styles.faqSection}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionIndex}>04</span>
              <h2 className={styles.sectionTitle}>FAQ</h2>
            </div>

            <FAQ />
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
          Follow on X 
        </a>
      </footer>
    </div>
  );
}
