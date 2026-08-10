"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CustomCursor.module.css";

const INTERACTIVE_SELECTOR =
  "a, button, input, textarea, [role='button'], [data-cursor-hover]";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    setEnabled(true);
    document.body.classList.add(styles.cursorActive);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let frame: number;

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dotRef.current?.style.setProperty(
        "transform",
        `translate3d(${mouseX}px, ${mouseY}px, 0)`
      );
    }

    function onOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest(INTERACTIVE_SELECTOR)) {
        ringRef.current?.classList.add(styles.ringHover);
      }
    }

    function onOut(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest(INTERACTIVE_SELECTOR)) {
        ringRef.current?.classList.remove(styles.ringHover);
      }
    }

    function tick() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ringRef.current?.style.setProperty(
        "transform",
        `translate3d(${ringX}px, ${ringY}px, 0)`
      );
      frame = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(frame);
      document.body.classList.remove(styles.cursorActive);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className={styles.dot} aria-hidden="true" />
      <div ref={ringRef} className={styles.ring} aria-hidden="true" />
    </>
  );
}
