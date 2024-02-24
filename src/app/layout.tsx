import type { Metadata } from "next";
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
    </html>
  );
}
