import styles from "./SealBadge.module.css";

export default function SealBadge() {
  return (
    <div className={styles.seal} aria-hidden="true">
      <svg viewBox="0 0 200 200" className={styles.ring}>
        <defs>
          <path
            id="seal-circle"
            d="M 100,100 m -80,0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
          />
        </defs>
        <text className={styles.ringText}>
          <textPath href="#seal-circle" startOffset="0%">
            · TITANS · GODS OF ROBINHOOD · 3333 SUPPLY
          </textPath>
        </text>
      </svg>
      <span className={styles.core} />
    </div>
  );
}
