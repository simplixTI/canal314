"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoLink } from "./Logo";

/**
 * Chrome mínimo sobre o conteúdo: logo pequena + entrada de conta.
 * Some na rota /assistir, onde o player tem seu próprio chrome.
 */
export default function HeaderShell({ loggedIn }: { loggedIn: boolean }) {
  const pathname = usePathname();
  if (pathname.startsWith("/assistir")) return null;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 w-full">
      <div className="scrim-top absolute inset-0 h-20" aria-hidden />
      <div className="relative flex items-center justify-between px-5 py-4">
        <span className="pointer-events-auto">
          <LogoLink />
        </span>
        <nav className="pointer-events-auto flex items-center gap-4">
          {loggedIn ? (
            <Link
              href="/conta"
              className="micro-label text-white/80 transition hover:text-white"
            >
              Conta
            </Link>
          ) : (
            <Link
              href="/login"
              className="micro-label border border-white/40 px-3.5 py-2 text-white transition hover:border-white"
            >
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
