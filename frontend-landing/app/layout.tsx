import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cryptosure.me"),
  title: {
    default: "CryptoSure | Where crypto protection is a Sure thing",
    template: "%s | CryptoSure",
  },
  description:
    "CryptoSure is developing a privacy-first insurance experience for crypto wallets, digital assets, and the partners who protect them.",
  openGraph: {
    title: "CryptoSure | Where crypto protection is a Sure thing",
    description:
      "Explore a privacy-first insurance concept for crypto wallets, digital assets, and the partners who protect them.",
    url: "https://cryptosure.me",
    siteName: "CryptoSure",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1536,
        height: 1024,
        alt: "CryptoSure, privacy-first insurance for crypto wallets and digital assets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CryptoSure | Where crypto protection is a Sure thing",
    description:
      "Explore a privacy-first insurance concept for crypto wallets, digital assets, and underwriting partners.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
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
        className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
