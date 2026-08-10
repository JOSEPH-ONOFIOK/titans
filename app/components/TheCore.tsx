import Image from "next/image";
import styles from "./TheCore.module.css";

export default function TheCore() {
  return (
    <div id="core" className={styles.wrapper}>
      <div className={styles.coreGlow} aria-hidden="true" />
      <Image
        src="/titans-logo.png"
        alt="The Titans core emblem"
        width={1200}
        height={1200}
        quality={100}
        className={styles.coreImage}
      />
      <div className={styles.coreText}>
        <p className={styles.coreHeadline}>EVERY TITAN CARRIES THE CORE.</p>
        <p className={styles.coreSub}>
          Different forms. Different origins. One source.
        </p>
      </div>
    </div>
  );
}
