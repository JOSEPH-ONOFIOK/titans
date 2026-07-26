"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./JoinCounter.module.css";

const PROFILE_URL = "https://x.com/titanshood_";
const POLL_INTERVAL_MS = 20000;
const TWEEN_MS = 700;

export default function JoinCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState<number | null>(null);
  const fromRef = useRef(0);

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

  useEffect(() => {
    if (count === null) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = fromRef.current;
    const to = count;

    if (reduced || from === to) {
      setDisplayCount(to);
      fromRef.current = to;
      return;
    }

    const start = performance.now();
    let frame: number;

    function tick(now: number) {
      const progress = Math.min((now - start) / TWEEN_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayCount(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [count]);

  return (
    <div className={styles.counter}>
      <div className={styles.identity}>
        <span className={styles.logo}>T</span>
        <span className={styles.name}>TITANS</span>
      </div>

      <div className={styles.stat}>
        <span className={styles.dot} />
        <span className={styles.count}>
          {displayCount === null ? "—" : displayCount.toLocaleString()} ascended
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
