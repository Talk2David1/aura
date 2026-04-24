import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Visionix AI - Video Studio",
  description: "Create AI-powered faceless videos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased bg-bg-tertiary text-text-primary h-[100dvh] flex flex-col md:flex-row overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
