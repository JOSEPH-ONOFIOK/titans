import type { Metadata } from "next";
import AllowlistForm from "../components/AllowlistForm";
import JoinCounter from "../components/JoinCounter";
import Reveal from "../components/Reveal";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "Enter the Pantheon, Titans Allowlist",
  description:
    "The gates are opening. Submit your wallet for a chance to join the first 3,333 Titans.",
};

export default function EnterPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main} style={{ paddingTop: 140 }}>
        <section>
          <Reveal className={styles.joinBand}>
            <JoinCounter />
          </Reveal>
        </section>

        <section id="allowlist">
          <Reveal className={styles.allowlistSection}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionIndex}>01</span>
              <h2 className={styles.sectionTitle}>ENTER THE PANTHEON</h2>
            </div>

            <div className={styles.allowlistRow}>
              <p className={styles.aboutText}>
                The gates are opening. Submit your wallet for a chance to
                join the first 3,333.
              </p>
              <AllowlistForm />
            </div>
          </Reveal>
        </section>
      </main>
    </div>
  );
}
