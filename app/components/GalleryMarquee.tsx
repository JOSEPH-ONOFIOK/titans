"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../page.module.css";

export default function GalleryMarquee({ images }: { images: string[] }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setAnimate(!reduced);
  }, []);

  const items = animate ? [...images, ...images] : images;

  return (
    <div className={styles.filmstripTrack}>
      <div className={`${styles.filmstrip} ${animate ? styles.filmstripAnimated : ""}`}>
        {items.map((src, i) => (
          <div key={`${src}-${i}`} className={styles.filmstripItem}>
            <Image
              src={src}
              alt="Titans god"
              width={949}
              height={949}
              className={styles.filmstripImage}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
