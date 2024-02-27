import type { Metadata } from "next";
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MyAnalytics } from "./components/my_analytics";
import { Inter } from "next/font/google";
import "./globals.css";

import { Next13NProgress, Link } from 'nextjs13-progress';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Isaac Wasserman",
  description: "The Portfolio of Isaac Wasserman",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Next13NProgress color="#1daeff" height={3} options={{showSpinner: false}} />
      </body>
      {/* <GoogleAnalytics gaId="G-5QKHFSH3PP" />
      <Analytics />
      <SpeedInsights /> */}
      {/* <GoogleTagManager gtmId="GTM-P7QZZ3S3" /> */}
    </html>
  );
}
