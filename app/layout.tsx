import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";

import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export function generateViewport() {
  return {
    themeColor: "#000",
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
    width: "device-width",
    height: "device-height",
    userScalable: false,
    colorScheme: "dark",
  };
}

export const metadata: Metadata = {
  title: "GG",
  description: "GG",
  themeColor: "#000000",
  openGraph: {
    title: "GG",
    description: "GG",
    url: "https://gg.zip",
    images: [
      {
        url: "https://gg.zip/og.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "GG",
    description: "GG",
    images: [
      {
        url: "https://gg.zip/og.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <video autoPlay muted loop id="background">
          <source src="/assets/video/bg.mp4" type="video/mp4" />
        </video>
        <Navigation />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
