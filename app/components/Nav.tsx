"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useMagnetic } from "../hooks/useMagnetic";
import styles from "./Nav.module.css";

const LINKS = [
  { label: "Pantheon", href: "#pantheon" },
  { label: "Lore", href: "#lore" },
  { label: "The Core", href: "#core" },
  { label: "Vision", href: "#vision" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.3);

  useEffect(() => {
    let ticking = false;

    function commit() {
      setScrolled((prev) => {
        const next = window.scrollY > 40;
        return prev === next ? prev : next;
      });
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(commit);
    }

    commit();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleLinkClick() {
    setMenuOpen(false);
  }

  return (
    <header className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}>
      <div className={styles.navRow}>
        <div className={styles.navBrand}>
          <Image
            src="/titans-logo.png"
            alt=""
            width={26}
            height={26}
            className={styles.navMark}
          />
          <span className={styles.navLogo}>TITANS</span>
        </div>

        <div className={styles.navActions}>
          <a ref={ctaRef} className={styles.navCta} href="#allowlist">
            Enter Pantheon
          </a>
          <button
            type="button"
            className={`${styles.menuToggle} ${menuOpen ? styles.menuToggleOpen : ""}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className={styles.menu} aria-label="Site sections">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.menuLink}
              onClick={handleLinkClick}
            >
              {link.label}
            </a>
          ))}
          <span className={styles.menuLinkDisabled} aria-disabled="true">
            Mint <span className={styles.menuSoon}>Soon</span>
          </span>
          <a
            href="https://x.com/titanshood_"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.menuLink}
            onClick={handleLinkClick}
          >
            X ↗
          </a>
        </nav>
      )}
    </header>
  );
}
