"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./TheCore.module.css";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function TheCore() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(reduced);
    if (reduced) return;

    let smooth = 0;
    let frame: number | null = null;
    let inView = false;

    function measureTarget() {
      const el = sectionRef.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return 1;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      return scrolled / total;
    }

    function render() {
      const target = measureTarget();
      smooth += (target - smooth) * 0.22;
      const eased = easeOutCubic(smooth);
      const scale = 1 + eased * 16;
      const textOpacity = Math.min(Math.max((smooth - 0.35) / 0.35, 0), 1);

      if (imageRef.current) {
        imageRef.current.style.transform = `scale(${scale})`;
      }
      if (glowRef.current) {
        glowRef.current.style.opacity = String(0.3 + smooth * 0.5);
      }
      if (textRef.current) {
        textRef.current.style.opacity = String(textOpacity);
      }

      // Keep running while in view, or until the eased value has caught
      // up with the raw scroll target after leaving view.
      if (inView || Math.abs(target - smooth) > 0.001) {
        frame = requestAnimationFrame(render);
      } else {
        frame = null;
      }
    }

    function ensureRunning() {
      if (frame === null) {
        frame = requestAnimationFrame(render);
      }
    }

    // Only run the per-frame loop while the section is near the viewport,
    // instead of scroll-listening (and animating) for the entire page
    // lifetime regardless of scroll position.
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) ensureRunning();
      },
      { rootMargin: "50% 0px 50% 0px" }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    ensureRunning();

    return () => {
      observer.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={sectionRef} id="core" className={styles.wrapper}>
      <div className={styles.sticky}>
        <div
          ref={glowRef}
          className={styles.coreGlow}
          style={{ opacity: reducedMotion ? 0.6 : 0.3 }}
        />
        <Image
          ref={imageRef}
          src="/titans-logo.png"
          alt="The Titans core emblem"
          width={200}
          height={200}
          className={styles.coreImage}
        />
        <div
          ref={textRef}
          className={styles.coreText}
          style={{ opacity: reducedMotion ? 1 : 0 }}
        >
          <p className={styles.coreHeadline}>EVERY TITAN CARRIES THE CORE.</p>
          <p className={styles.coreSub}>
            Different forms. Different origins. One source.
          </p>
        </div>
      </div>
    </div>
  );
}
