import type { Metadata, Viewport } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const display = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Canal314 — Micro-documentários verticais",
  description:
    "Micro-séries verticais sobre os grandes nomes da fé e da política do Brasil. Episódios de 1 a 2 minutos.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-dvh bg-[#0a0a0a]">
        <div className="relative min-h-dvh w-full">
          <Header />
          {children}
          <Footer />
          {/* Grão de filme sobre o app inteiro */}
          <div
            aria-hidden
            className="film-grain pointer-events-none fixed inset-0 z-[60] w-full opacity-[0.05]"
          />
        </div>
      </body>
    </html>
  );
}
