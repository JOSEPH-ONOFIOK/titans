"use client";

import { useEffect, useState } from "react";
import FadeImage from "./FadeImage";
import styles from "./GalleryColumns.module.css";

const COLUMN_COUNT = 3;

type GalleryImage = { src: string; alt: string };

function splitColumns<T>(items: T[], count: number): T[][] {
  const cols: T[][] = Array.from({ length: count }, () => []);
  items.forEach((item, i) => cols[i % count].push(item));
  return cols;
}

export default function GalleryColumns({ images }: { images: GalleryImage[] }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setAnimate(!reduced);
  }, []);

  const columns = splitColumns(images, COLUMN_COUNT);

  return (
    <div className={styles.grid}>
      {columns.map((col, ci) => {
        const items = animate ? [...col, ...col] : col;
        const direction = ci % 2 === 0 ? styles.up : styles.down;
        return (
          <div key={ci} className={styles.columnTrack}>
            <div className={`${styles.column} ${animate ? direction : ""}`}>
              {items.map((image, i) => {
                const number = String(
                  (i % col.length) + 1 + ci * col.length
                ).padStart(3, "0");
                return (
                  <div key={`${image.src}-${i}`} className={styles.item}>
                    <FadeImage
                      src={image.src}
                      alt={image.alt}
                      width={949}
                      height={949}
                      className={styles.image}
                    />
                    <div className={styles.caption}>
                      <span>TITAN // {number}</span>
                      <span>STATUS // AWAKENED</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
