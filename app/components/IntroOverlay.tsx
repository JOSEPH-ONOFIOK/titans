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
      prefersReducedMotion ? 0 : 1500
    );

    return () => clearTimeout(timeout);
  }, []);

  if (!mounted) return null;

  return (
    <div className={styles.overlay}>
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
