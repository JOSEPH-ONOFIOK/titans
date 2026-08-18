import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} Titans. Gods of Robinhood.</p>
      <div className={styles.footerLinks}>
        <a
          href="https://x.com/barzzard"
          target="_blank"
          rel="noopener noreferrer"
        >
          Founded by @barzzard ↗
        </a>
        <a
          href="https://x.com/titanshood_"
          target="_blank"
          rel="noopener noreferrer"
        >
          Follow on X ↗
        </a>
      </div>
    </footer>
  );
}
