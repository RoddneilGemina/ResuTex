import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ResuTex | LaTeX ATS Resume Studio",
  description:
    "ResuTex: Editorial LaTeX ATS Resume Studio and Intelligent Tailoring Engine designed with Figma's monochrome canvas and pastel color block design system.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-white text-black`}
    >
      <body className="min-h-full flex flex-col bg-white text-black selection:bg-[#dceeb1] selection:text-black">
        {children}
      </body>
    </html>
  );
}
