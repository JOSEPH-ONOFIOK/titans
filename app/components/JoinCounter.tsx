"use client";

import { useEffect, useState } from "react";
import styles from "./JoinCounter.module.css";

const PROFILE_URL = "https://x.com/titanshood_";
const POLL_INTERVAL_MS = 20000;

export default function JoinCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/allowlist");
        const data = await res.json();
        if (!cancelled && typeof data.count === "number") {
          setCount(data.count);
        }
      } catch {
        // ignore, keep last known count
      }
    }

    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={styles.counter}>
      <div className={styles.identity}>
        <span className={styles.logo}>T</span>
        <span className={styles.name}>TITANS</span>
      </div>

      <div className={styles.stat}>
        <span className={styles.dot} />
        <span className={styles.count}>
          {count === null ? "—" : count.toLocaleString()} joined
        </span>
      </div>

      <a
        className={styles.followButton}
        href={PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Follow @titanshood_
      </a>
    </div>
  );
}
