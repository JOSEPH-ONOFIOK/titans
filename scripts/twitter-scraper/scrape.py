"""
CLI scraper for X/Twitter using Playwright, reusing a real logged-in
Chrome profile (X blocks logins it detects as automated, so the login
itself must happen in a normal, non-automated browser window).

One-time setup:
    pip install -r requirements.txt
    playwright install chromium

    open -na "Google Chrome" --args \\
      --user-data-dir="$PWD/chrome-profile" https://x.com/login

    Log in normally in that window, then fully quit Chrome (Cmd+Q) so
    it releases the profile lock. Playwright launches against the same
    chrome-profile/ directory from then on and inherits the session.

Usage:
    python scrape.py tweets      --user titanshood_ --count 20
    python scrape.py tweets      --user titanshood_ --all
    python scrape.py retweeters  --owner titanshood_ --tweet-id 1234567890123456789 --count 50

    Add --out results.json to write to a file instead of stdout.
    Add --all to keep scrolling until no new items load (capped by
    MAX_SCROLLS as a safety net) instead of stopping at --count.
    Add --headed to watch the browser while it scrapes (default headless).

Notes:
    - Relies on X's current data-testid attributes (tweet, tweetText,
      UserCell). These are more stable than internal JS bundle names,
      but X can still change them; update the selectors below if so.
"""

import argparse
import asyncio
import json
from pathlib import Path

from playwright.async_api import Page, async_playwright

PROFILE_DIR = Path(__file__).parent / "chrome-profile"
SCROLL_PAUSE_SECONDS = 1.5
MAX_SCROLLS = 300  # safety net for --all
STALL_LIMIT = 6  # consecutive scrolls with no new items before giving up


async def get_context(playwright, headed: bool):
    if not PROFILE_DIR.exists():
        raise SystemExit(
            "No Chrome profile found. Log in first with:\n\n"
            f'  open -na "Google Chrome" --args --user-data-dir="{PROFILE_DIR}" https://x.com/login\n\n'
            "then fully quit Chrome before running this script."
        )
    # channel="chrome" uses the real installed Google Chrome, not
    # Playwright's bundled Chromium. macOS encrypts cookie values with a
    # Keychain key tied to the app's identity, so bundled Chromium can't
    # decrypt cookies a real Chrome login wrote to this same profile dir.
    return await playwright.chromium.launch_persistent_context(
        user_data_dir=str(PROFILE_DIR), headless=not headed, channel="chrome"
    )


async def scroll_collect(page: Page, extract, count: int, all_items: bool, stall_limit: int) -> list:
    items: dict = {}
    stalls = 0

    for _ in range(MAX_SCROLLS):
        items.update(await extract(page))

        if not all_items and len(items) >= count:
            break

        before = len(items)
        await page.mouse.wheel(0, 2500)
        await asyncio.sleep(SCROLL_PAUSE_SECONDS)
        items.update(await extract(page))

        if len(items) == before:
            stalls += 1
            if stalls >= stall_limit:
                break
        else:
            stalls = 0

    values = list(items.values())
    return values if all_items else values[:count]


async def extract_tweets(page: Page) -> dict:
    # X ships schema.org SocialMediaPosting microdata directly on each
    # tweet's <article> (probably for SEO), which is a far more stable
    # target than data-testid attributes X has since stripped from markup.
    articles = await page.query_selector_all("article[data-tweet-id]")
    result = {}
    for article in articles:
        tweet_id = await article.get_attribute("data-tweet-id")
        if not tweet_id:
            continue

        text_el = await article.query_selector(':scope > meta[itemprop="articleBody"]')
        text = await text_el.get_attribute("content") if text_el else ""

        date_el = await article.query_selector(':scope > meta[itemprop="datePublished"]')
        created_at = await date_el.get_attribute("content") if date_el else None

        url_el = await article.query_selector(':scope > meta[itemprop="url"]')
        url = await url_el.get_attribute("content") if url_el else f"https://x.com/i/status/{tweet_id}"

        result[tweet_id] = {
            "id": tweet_id,
            "text": text,
            "created_at": created_at,
            "url": url,
        }
    return result


async def extract_users(page: Page) -> dict:
    cells = await page.query_selector_all('[data-testid="UserCell"]')
    result = {}
    for cell in cells:
        handle_el = await cell.query_selector('a[role="link"]')
        href = await handle_el.get_attribute("href") if handle_el else None
        if not href:
            continue
        screen_name = href.strip("/").split("/")[-1]

        name_el = await cell.query_selector('div[dir="ltr"] span')
        name = await name_el.inner_text() if name_el else None

        result[screen_name] = {"screen_name": screen_name, "name": name}
    return result


async def cmd_tweets(page: Page, args) -> list:
    await page.goto(f"https://x.com/{args.user}", wait_until="domcontentloaded")
    await page.wait_for_selector("article[data-tweet-id]", timeout=30_000)
    return await scroll_collect(page, extract_tweets, args.count, args.all, args.stall_limit)


async def cmd_retweeters(page: Page, args) -> list:
    await page.goto(
        f"https://x.com/{args.owner}/status/{args.tweet_id}/retweets",
        wait_until="domcontentloaded",
    )
    await page.wait_for_selector('[data-testid="UserCell"]', timeout=30_000)
    return await scroll_collect(page, extract_users, args.count, args.all, args.stall_limit)


COMMANDS = {
    "tweets": cmd_tweets,
    "retweeters": cmd_retweeters,
}


async def main() -> None:
    parser = argparse.ArgumentParser(description="Scrape public X/Twitter data via Playwright.")
    parser.add_argument("command", choices=COMMANDS.keys())
    parser.add_argument("--user", help="Target account's screen name (no @), for 'tweets'")
    parser.add_argument("--owner", help="Screen name of the tweet's author, for 'retweeters'")
    parser.add_argument("--tweet-id", help="Tweet ID, for 'retweeters'")
    parser.add_argument("--count", type=int, default=20, help="Number of items to fetch")
    parser.add_argument(
        "--all", action="store_true",
        help=f"Keep scrolling until exhausted (capped at {MAX_SCROLLS} scrolls)",
    )
    parser.add_argument(
        "--stall-limit", type=int, default=STALL_LIMIT,
        help=f"Consecutive empty scrolls before giving up (default {STALL_LIMIT})",
    )
    parser.add_argument("--headed", action="store_true", help="Show the browser window while scraping")
    parser.add_argument("--out", help="Write JSON results to this file instead of stdout")
    args = parser.parse_args()

    if args.command == "tweets" and not args.user:
        parser.error("--user is required for 'tweets'")
    if args.command == "retweeters" and not (args.owner and args.tweet_id):
        parser.error("--owner and --tweet-id are required for 'retweeters'")

    async with async_playwright() as playwright:
        context = await get_context(playwright, args.headed)
        page = context.pages[0] if context.pages else await context.new_page()

        results = await COMMANDS[args.command](page, args)

        await context.close()

    output = json.dumps(results, indent=2, default=str)
    if args.out:
        Path(args.out).write_text(output)
        print(f"Wrote {len(results)} items to {args.out}")
    else:
        print(output)


if __name__ == "__main__":
    asyncio.run(main())
