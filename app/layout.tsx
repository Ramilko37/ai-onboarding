import type { Metadata, Viewport } from "next";
import { Geist_Mono, Manrope, Montserrat } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
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
    <html
      lang="ru"
      className={`${manrope.variable} ${montserrat.variable} ${geistMono.variable} bg-background`}
    >
      <body>{children}</body>
    </html>
  );
}
