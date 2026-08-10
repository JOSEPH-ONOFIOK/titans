"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import styles from "./FadeImage.module.css";

export default function FadeImage({ className, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      {...props}
      className={`${className ?? ""} ${styles.image} ${loaded ? styles.loaded : ""}`}
      onLoad={(e) => {
        setLoaded(true);
        props.onLoad?.(e);
      }}
    />
  );
}
