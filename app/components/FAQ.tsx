"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./FAQ.module.css";

const ITEMS = [
  {
    q: "What are Titans?",
    a: "Titans is an IP-first collection of 3,000 original characters born from mythology, power, and the world of Robinhood. The collection marks the beginning of a character-driven universe built around art, identity, community, and the Pantheon. Titans starts with the original 3,000 — but the vision is to grow beyond the collection and build a recognizable IP around its characters and world.",
  },
  { q: "How many Titans exist?", a: "3,000." },
  { q: "Mint price?", a: "TBA." },
  { q: "Network?", a: "Robinhood." },
  { q: "Is there a token?", a: "No." },
  {
    q: "What is the long-term goal?",
    a: "Develop Titans as a character-focused IP and brand.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={styles.list}>
      {ITEMS.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={item.q}
            className={`${styles.item} ${visible ? styles.itemVisible : ""}`}
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            <button
              type="button"
              className={styles.question}
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span>{item.q}</span>
              <span className={styles.icon}>{isOpen ? "—" : "+"}</span>
            </button>
            {isOpen && <p className={styles.answer}>{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
