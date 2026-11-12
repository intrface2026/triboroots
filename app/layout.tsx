import type { Metadata } from "next";
import {
  Baloo_2,
  Fredoka,
  Geist_Mono,
  Kalam,
  Plus_Jakarta_Sans,
} from "next/font/google";
import FluffyKittenCursor from "@/components/FluffyKittenCursor";
import ContentShield from "@/components/ContentShield";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  display: "swap",
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin", "devanagari"],
  display: "swap",
});

const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin", "devanagari"],
  weight: ["400", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TriboRoots Hostel",
  description:
    "TriboRoots Hostel — Community stays, vibrant nights, and rooted adventures.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${fredoka.variable} ${baloo.variable} ${kalam.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <FluffyKittenCursor />
        <ContentShield />
        {children}
      </body>
    </html>
  );
}
