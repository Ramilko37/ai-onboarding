import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Onboarding MVP",
  description: "Demo-first AI onboarding agent with route, assistant, sources, escalations, and HR dashboard"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
