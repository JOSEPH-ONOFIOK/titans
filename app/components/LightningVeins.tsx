"use client";

import { useMemo } from "react";
import styles from "./LightningVeins.module.css";

const VEIN_PATHS = [
  "M0,40 L18,10 L10,30 L34,0",
  "M0,10 L22,38 L14,20 L40,44",
  "M0,26 L16,0 L8,22 L30,4",
  "M0,4 L20,30 L12,14 L36,38",
  "M0,34 L24,6 L16,26 L40,2",
];

function seededVeins() {
  return VEIN_PATHS.map((d, i) => ({
    id: i,
    d,
    top: Math.round(8 + Math.random() * 74),
    left: Math.round(Math.random() * 85),
    scale: 2.5 + Math.random() * 2.5,
    rotate: Math.round(Math.random() * 360),
    duration: 8 + Math.round(Math.random() * 7),
    delay: -Math.round(Math.random() * 12),
    color: i % 2 === 0 ? "var(--titans-green)" : "var(--titans-violet)",
  }));
}

export default function LightningVeins() {
  const veins = useMemo(seededVeins, []);

  return (
    <div className={styles.field} aria-hidden="true">
      {veins.map((v) => (
        <svg
          key={v.id}
          className={styles.vein}
          viewBox="0 0 40 44"
          style={
            {
              top: `${v.top}%`,
              left: `${v.left}%`,
              width: `${v.scale * 16}px`,
              height: `${v.scale * 18}px`,
              color: v.color,
              transform: `rotate(${v.rotate}deg)`,
              animationDuration: `${v.duration}s`,
              animationDelay: `${v.delay}s`,
            } as React.CSSProperties
          }
        >
          <path
            d={v.d}
            stroke="currentColor"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      ))}
    </div>
  );
}
