import { NextRequest, NextResponse } from "next/server";

const ETH_ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;
const HANDLE_RE = /^@?[A-Za-z0-9_]{1,15}$/;
const X_LINK_RE = /^https?:\/\/(www\.)?(x|twitter)\.com\/\S+\/status\/\d+/i;

const SHEETS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
const SHEETS_WEBHOOK_SECRET = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;

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
  if (!SHEETS_WEBHOOK_URL || !SHEETS_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Allowlist isn't configured yet. Try again later." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const wallet = String(body.wallet ?? "").trim();
  const twitter = String(body.twitter ?? "").trim();
  const quotePostLink = String(body.quotePostLink ?? "").trim();

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

  if (!X_LINK_RE.test(quotePostLink)) {
    return NextResponse.json(
      { error: "Paste the link to your quote post on X." },
      { status: 400 }
    );
  }

  try {
    const sheetRes = await fetch(SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: SHEETS_WEBHOOK_SECRET,
        wallet,
        twitter: twitter.startsWith("@") ? twitter : `@${twitter}`,
        quotePostLink,
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
