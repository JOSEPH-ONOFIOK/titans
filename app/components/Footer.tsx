import styles from "./Footer.module.css";

export default function Footer() {
  return (
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
  );
}
