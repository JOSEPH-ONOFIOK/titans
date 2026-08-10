import { NextRequest, NextResponse } from "next/server";

const ETH_ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;
const HANDLE_RE = /^@?[A-Za-z0-9_]{1,15}$/;

const SHEETS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
const SHEETS_WEBHOOK_SECRET = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;

// Basic per-instance rate limit: keeps a single client from hammering the
// endpoint. It's in-memory (resets on cold start, not shared across
// serverless instances) — good enough to blunt casual abuse, not a
// substitute for a real distributed limiter (e.g. Upstash) at scale.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const requestLog = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(key) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  recent.push(now);
  requestLog.set(key, recent);
  return recent.length > RATE_LIMIT_MAX;
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function GET() {
  if (!SHEETS_WEBHOOK_URL) {
    return NextResponse.json({ count: 0 });
  }

  try {
    const res = await fetch(
      `${SHEETS_WEBHOOK_URL}?secret=${encodeURIComponent(SHEETS_WEBHOOK_SECRET ?? "")}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return NextResponse.json({ count: typeof data.count === "number" ? data.count : 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}

export async function POST(req: NextRequest) {
  if (isRateLimited(getClientIp(req))) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in a few minutes." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const wallet = String(body.wallet ?? "").trim();
  const twitter = String(body.twitter ?? "").trim();
  const follow = Boolean(body.follow);
  const quote = Boolean(body.quote);
  const tag = Boolean(body.tag);

  if (!ETH_ADDRESS_RE.test(wallet)) {
    return NextResponse.json(
      { error: "Enter a valid EVM wallet address (0x...)." },
      { status: 400 }
    );
  }

  if (!HANDLE_RE.test(twitter)) {
    return NextResponse.json(
      { error: "Enter a valid X/Twitter handle." },
      { status: 400 }
    );
  }

  if (!SHEETS_WEBHOOK_URL || !SHEETS_WEBHOOK_SECRET) {
    const inviteCode = `TTN-${crypto.randomUUID().split("-")[0].toUpperCase().slice(0, 6)}`;
    return NextResponse.json({ ok: true, position: 1, inviteCode });
  }

  try {
    const sheetRes = await fetch(SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: SHEETS_WEBHOOK_SECRET,
        timestamp: new Date().toISOString(),
        username: twitter.startsWith("@") ? twitter : `@${twitter}`,
        wallet,
        follow: follow ? "yes" : "no",
        quote: quote ? "yes" : "no",
        tag: tag ? "yes" : "no",
        refBy: "",
      }),
    });

    const data = await sheetRes.json();

    if (data.error) {
      const status = String(data.error).toLowerCase().includes("already")
        ? 409
        : 400;
      return NextResponse.json({ error: data.error }, { status });
    }

    return NextResponse.json({
      ok: true,
      count: data.count,
      position: data.position,
      inviteCode: data.inviteCode,
    });
  } catch {
    return NextResponse.json(
      { error: "Couldn't reach the allowlist. Try again in a sec." },
      { status: 502 }
    );
  }
}
