import type { Metadata, Viewport } from "next";
import { Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI-агент адаптации HORECA",
  description:
    "Прототип AI-агента для диагностики знаний и персонального маршрута адаптации сотрудников HORECA-франчайзинговой сети.",
};

export const viewport: Viewport = {
  themeColor: "#fbf4e8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${manrope.variable} ${geistMono.variable} bg-background`}>
      <body>{children}</body>
    </html>
  );
}
