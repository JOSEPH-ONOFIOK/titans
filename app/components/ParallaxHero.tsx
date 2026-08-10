"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "../page.module.css";

export default function ParallaxHero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let frame: number | null = null;

    function onScroll() {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        const el = ref.current;
        if (!el) return;
        const offset = Math.min(window.scrollY * 0.15, 80);
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={styles.heroParallax}>
      <Image
        src="/titans-banner.png"
        alt="Titans, Gods of Robinhood"
        fill
        sizes="100vw"
        quality={100}
        priority
        className={styles.heroImage}
      />
    </div>
  );
}
