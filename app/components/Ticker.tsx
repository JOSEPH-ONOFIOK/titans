import styles from "./Ticker.module.css";

const ITEMS = [
  "SUPPLY 3,333",
  "REALM // ROBINHOOD",
  "MINT // TBA",
  "GODS OF ROBINHOOD",
  "FORGED IN LIGHTNING",
  "ENTER THE PANTHEON",
];

export default function Ticker() {
  const items = [...ITEMS, ...ITEMS];

  return (
    <div className={styles.track}>
      <div className={styles.strip}>
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className={styles.item}>
            {item}
            <span className={styles.dot} aria-hidden="true">
              •
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
