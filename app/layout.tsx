import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel } from "next/font/google";
import CustomCursor from "./components/CustomCursor";
import Footer from "./components/Footer";
import LightningVeins from "./components/LightningVeins";
import Nav from "./components/Nav";
import Ouroboros from "./components/Ouroboros";
import Providers from "./components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-display",
  weight: ["600", "700", "900"],
  subsets: ["latin"],
});

const TITLE = "TITANS, Gods of Robinhood";
const DESCRIPTION =
  "Gods of Robinhood. Enter the Pantheon and join the Titans allowlist.";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/titans-banner.png", width: 1500, height: 500 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/titans-banner.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable}`}
      >
        <Providers>
          <CustomCursor />
          <Ouroboros />
          <LightningVeins />
          <Nav />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
