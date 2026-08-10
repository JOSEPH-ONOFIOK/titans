"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SacredNumbers.module.css";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function useScramble(finalText: string, active: boolean, duration = 700) {
  const [text, setText] = useState(active ? finalText : "");

  useEffect(() => {
    if (!active) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setText(finalText);
      return;
    }

    const start = performance.now();
    let frame: number;

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const revealCount = Math.floor(progress * finalText.length);
      let out = "";
      for (let i = 0; i < finalText.length; i++) {
        const char = finalText[i];
        if (char === " " || char === "_" || char === "*" || i < revealCount) {
          out += char;
        } else {
          out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }
      setText(out);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setText(finalText);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, finalText, duration]);

  return text;
}

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(target);
      return;
    }

    const start = performance.now();
    let frame: number;

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return value;
}

function Stat({
  label,
  value,
  sublabel,
  active,
  numeric,
}: {
  label: string;
  value: string | number;
  sublabel: string;
  active: boolean;
  numeric?: boolean;
}) {
  const count = useCountUp(numeric ? Number(value) : 0, active && !!numeric);
  const scrambled = useScramble(String(value), active && !numeric);

  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>
        {numeric ? count.toLocaleString() : scrambled}
      </span>
      <span className={styles.statSub}>{sublabel}</span>
    </div>
  );
}

export default function SacredNumbers() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={styles.band}>
      <Stat label="[ SUPPLY_ ]" value={3000} numeric sublabel="TITANS" active={active} />
      <Stat label="[ MINT_ ]" value="TBA" sublabel="PRICE *" active={active} />
      <Stat label="[ REALM_ ]" value="ROBINHOOD" sublabel="CHAIN" active={active} />
    </div>
  );
}
