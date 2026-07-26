"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./IntroOverlay.module.css";

export default function IntroOverlay() {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const timeout = setTimeout(
      () => setMounted(false),
      prefersReducedMotion ? 0 : 2650
    );

    return () => clearTimeout(timeout);
  }, []);

  if (!mounted) return null;

  return (
    <div className={styles.overlay}>
      <span className={styles.screenFlash} aria-hidden="true" />
      <svg
        className={styles.bolt}
        viewBox="0 0 100 400"
        fill="white"
        aria-hidden="true"
      >
        <path d="M60 0 L25 190 L50 190 L20 400 L90 160 L55 160 L80 0 Z" />
      </svg>
      <span className={styles.flash} aria-hidden="true" />
      <Image
        src="/titans-logo.png"
        alt="Titans"
        width={120}
        height={120}
        className={styles.logo}
        priority
      />
    </div>
  );
}
