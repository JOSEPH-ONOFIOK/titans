"use client";

import { useEffect, useRef, useState } from "react";
import { useMagnetic } from "../hooks/useMagnetic";
import {
  UserPlus,
  Heart,
  Repeat2,
  Tags,
  Zap,
  Check,
  CheckCircle2,
  X,
} from "lucide-react";
import styles from "./AllowlistForm.module.css";

type Status = "idle" | "submitting" | "success" | "error";

type PassData = {
  wallet: string;
  twitter: string;
  position: number;
  inviteCode: string;
};

function truncateWallet(wallet: string) {
  return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
}

const PROFILE_URL = "https://x.com/titanshood_";
const QUOTE_TEXT = "Titans, rise";

const OBJECTIVES = [
  {
    id: "follow",
    Icon: UserPlus,
    label: "Follow @titanshood_",
    href: PROFILE_URL,
  },
  {
    id: "like",
    Icon: Heart,
    label: "Like the pinned post",
    href: PROFILE_URL,
  },
  {
    id: "quote",
    Icon: Repeat2,
    label: `Quote it: "${QUOTE_TEXT}"`,
    href: `https://x.com/intent/post?text=${encodeURIComponent(QUOTE_TEXT)}`,
  },
  {
    id: "tag",
    Icon: Tags,
    label: "Tag 3 friends on the post",
    href: PROFILE_URL,
  },
] as const;

export default function AllowlistForm() {
  const [done, setDone] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [wallet, setWallet] = useState("");
  const [twitter, setTwitter] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [passData, setPassData] = useState<PassData | null>(null);

  const modalRef = useRef<HTMLFormElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const continueButtonRef = useMagnetic<HTMLButtonElement>(0.3);
  const submitButtonRef = useMagnetic<HTMLButtonElement>(0.2);

  const allDone = done.size === OBJECTIVES.length;

  useEffect(() => {
    if (!modalOpen) return;

    firstInputRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setModalOpen(false);
        return;
      }

      if (e.key !== "Tab" || !modalRef.current) return;

      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'input, button, [href], [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      continueButtonRef.current?.focus();
    };
  }, [modalOpen]);

  function runObjective(id: string, href: string) {
    window.open(href, "_blank", "noopener,noreferrer");
    setDone((prev) => new Set(prev).add(id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/allowlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet,
          twitter,
          follow: done.has("follow"),
          quote: done.has("quote"),
          tag: done.has("tag"),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Try again.");
        return;
      }

      setPassData({
        wallet,
        twitter: twitter.startsWith("@") ? twitter : `@${twitter}`,
        position: data.position,
        inviteCode: data.inviteCode,
      });
      setStatus("success");
      setModalOpen(false);
      setMessage("You're in. Wallet locked in for the WL phase.");
      setWallet("");
      setTwitter("");
    } catch {
      setStatus("error");
      setMessage("Couldn't reach the server. Try again in a sec.");
    }
  }

  if (status === "success" && passData) {
    const decreeNo = String(passData.position).padStart(4, "0");
    const walletTag = passData.wallet.slice(2, 6).toUpperCase();
    const rows = [
      { label: "User", value: passData.twitter },
      { label: "Wallet", value: truncateWallet(passData.wallet) },
      { label: "Status", value: "CHOSEN" },
      { label: "Sigil", value: passData.inviteCode },
    ];

    return (
      <div className={styles.passWrapper}>
        <div className={styles.passCard}>
          <span className={styles.passStamp}>SEALED</span>

          <div className={styles.passHeader}>
            <Zap className={styles.passZap} strokeWidth={1.5} />
            <div>
              <p className={styles.passEyebrow}>TITANS DECREE</p>
              <p className={styles.passFileNo}>DECREE NO. {decreeNo}</p>
            </div>
          </div>

          <p className={styles.passHeadline}>ASCENSION GRANTED</p>
          <p className={styles.passSubline}>PANTHEON GENESIS</p>

          <div className={styles.passSheet}>
            {rows.map((row) => (
              <div className={styles.passRow} key={row.label}>
                <span className={styles.passRowLabel}>{row.label}</span>
                <span className={styles.passRowDots} />
                <span className={styles.passRowValue}>{row.value}</span>
              </div>
            ))}
          </div>

          <div className={styles.passFooter}>
            <span className={styles.passBarcode} aria-hidden="true" />
            <span className={styles.passCode}>
              GODS-{passData.position}-{walletTag}
            </span>
          </div>
        </div>

        <p className={styles.passNote}>
          Screenshot this decree — you&apos;ll need it for the genesis mint.
        </p>

        <button
          className={styles.resetButton}
          onClick={() => {
            setStatus("idle");
            setDone(new Set());
            setPassData(null);
            setModalOpen(false);
          }}
        >
          Submit another wallet
        </button>
      </div>
    );
  }

  const progress = (done.size / OBJECTIVES.length) * 100;

  return (
    <>
      <div className={styles.trials}>
        <div className={styles.trialsHead}>
          <span className={styles.trialsEyebrow}>THE TRIALS</span>
          <p className={styles.trialsTitle}>Prove your worth</p>
        </div>

        <div className={styles.trialList}>
          {OBJECTIVES.map((obj, i) => {
            const isDone = done.has(obj.id);
            const Icon = obj.Icon;
            return (
              <button
                key={obj.id}
                type="button"
                onClick={() => runObjective(obj.id, obj.href)}
                className={`${styles.trialRow} ${
                  isDone ? styles.trialRowDone : ""
                }`}
              >
                <span className={styles.trialIndex}>
                  {isDone ? (
                    <Check size={14} strokeWidth={2.5} />
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                </span>
                <Icon className={styles.trialIcon} strokeWidth={1.5} />
                <span className={styles.trialLabel}>{obj.label}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className={styles.progressLabel}>
          STATUS // <span className={styles.progressLabelState}>MORTAL</span>
        </span>

        {allDone && (
          <button
            type="button"
            ref={continueButtonRef}
            className={styles.continueButton}
            onClick={() => setModalOpen(true)}
          >
            Continue →
          </button>
        )}
      </div>

      {modalOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setModalOpen(false)}
        >
          <form
            ref={modalRef}
            className={styles.modalCard}
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="allowlist-modal-heading"
          >
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <p className={styles.clearedLine}>
              <CheckCircle2 className={styles.clearedIcon} strokeWidth={1.75} />
              All 4 trials cleared
            </p>
            <p id="allowlist-modal-heading" className={styles.cardHeading}>
              Inscribe your name
            </p>

            <label className={styles.label}>
              X username
              <input
                ref={firstInputRef}
                className={styles.input}
                type="text"
                placeholder="@yourhandle"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                required
              />
            </label>

            <label className={styles.label}>
              EVM wallet address
              <input
                className={styles.input}
                type="text"
                placeholder="0x..."
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                required
              />
            </label>

            {status === "error" && (
              <p className={styles.errorMsg}>{message}</p>
            )}

            <button
              ref={submitButtonRef}
              className={styles.submitButton}
              type="submit"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "SEALING..." : "ASCEND TO THE LIST"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
