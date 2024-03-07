import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";

import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "GG",
  description: "GG",
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
