"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./Ouroboros.module.css";

const SIZE = 84;
const CENTER = SIZE / 2;
const BASE_RADIUS = 30;
const WAVE_AMPLITUDE = 2.6;
const WAVE_COUNT = 7;
const POINT_COUNT = 220;
const STROKE = 3.2;

// Detailed serpent head, drawn in local space with the neck at (0,0)
// pointing toward -y (the direction of travel), including an open-jaw
// line, a small fang, a brow ridge, and an eye.
const HEAD_PATH =
  "M -2.6,0.6 C -3.4,-1.6 -2.4,-4 0,-4.8 C 2.4,-4 3.4,-1.6 2.6,0.6 " +
  "C 2.2,2.4 1,3.6 0,4.6 C -1,3.6 -2.2,2.4 -2.6,0.6 Z";
const JAW_LINE = "M -2,1.3 C -0.9,2.1 0.9,2.1 2,1.3";
const FANG_PATH = "M -0.5,1.9 L -0.9,3.2 L -0.2,2.1 Z";
const BROW_PATH = "M -2.1,-0.6 C -1.4,-1.6 0.3,-2 1.4,-1.2";

type PathPoint = { x: number; y: number; len: number };

function buildSerpentPath() {
  const points: PathPoint[] = [];
  let cumulative = 0;
  let prev: { x: number; y: number } | null = null;

  for (let i = 0; i <= POINT_COUNT; i++) {
    const t = i / POINT_COUNT;
    const theta = t * Math.PI * 2 - Math.PI / 2;
    const r = BASE_RADIUS + WAVE_AMPLITUDE * Math.sin(theta * WAVE_COUNT);
    const x = CENTER + r * Math.cos(theta);
    const y = CENTER + r * Math.sin(theta);
    if (prev) {
      cumulative += Math.hypot(x - prev.x, y - prev.y);
    }
    points.push({ x, y, len: cumulative });
    prev = { x, y };
  }

  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");

  return { points, totalLength: cumulative, d };
}

function pointAt(points: PathPoint[], totalLength: number, progress: number) {
  const target = progress * totalLength;
  let lo = 0;
  let hi = points.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (points[mid].len < target) lo = mid + 1;
    else hi = mid;
  }
  const i = Math.max(1, Math.min(lo, points.length - 1));
  const a = points[i - 1];
  const b = points[i];
  const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 90;
  return { x: b.x, y: b.y, angle };
}

export default function Ouroboros() {
  const [progress, setProgress] = useState(0);
  const serpent = useMemo(buildSerpentPath, []);

  useEffect(() => {
    let scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    let ticking = false;

    function commit() {
      const scrollTop = window.scrollY;
      setProgress(
        scrollableHeight > 0 ? Math.min(scrollTop / scrollableHeight, 1) : 0
      );
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(commit);
    }

    function onResize() {
      scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      commit();
    }

    commit();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const { points, totalLength, d } = serpent;
  const offset = totalLength * (1 - progress);
  const head = pointAt(points, totalLength, progress);
  const tail = points[0];
  const complete = progress >= 0.995;

  return (
    <div
      className={`${styles.wrap} ${complete ? styles.complete : ""}`}
      aria-hidden="true"
    >
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <path d={d} className={styles.track} fill="none" strokeWidth={STROKE} />
        <path
          d={d}
          className={styles.body}
          fill="none"
          strokeWidth={STROKE}
          strokeDasharray={totalLength}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />

        <g transform={`translate(${tail.x} ${tail.y})`}>
          <path d="M 0,-1 L 1.6,-4.2 L 0,-3 L -1.6,-4.2 Z" className={styles.tail} />
        </g>

        <g transform={`translate(${head.x} ${head.y}) rotate(${head.angle})`}>
          <path d={HEAD_PATH} className={styles.head} />
          <path d={BROW_PATH} className={styles.brow} fill="none" />
          <path d={JAW_LINE} className={styles.jaw} fill="none" />
          <path d={FANG_PATH} className={styles.fang} />
          <circle cx="-1.3" cy="-1.1" r="0.55" className={styles.eye} />
        </g>
      </svg>
    </div>
  );
}
