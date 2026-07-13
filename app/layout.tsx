import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel } from "next/font/google";
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

export const metadata: Metadata = {
  title: "TITANS — Gods of Robinhood",
  description:
    "Gods of Robinhood. Secure your seat on the Titans allowlist.",
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
        {children}
      </body>
    </html>
  );
}
