import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Canal314 — Micro-documentários verticais",
  description:
    "Micro-séries verticais sobre os grandes nomes da fé e da política do Brasil. Episódios de 1 a 2 minutos.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-neutral-950 text-neutral-100 min-h-screen">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
