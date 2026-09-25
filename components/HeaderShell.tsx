"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoLink } from "./Logo";
import MobileDrawer from "./MobileDrawer";
import SearchOverlay from "./SearchOverlay";
import { useScrolled } from "./useScrolled";
import { CoinIcon, MenuIcon, SearchIcon, UserCircleIcon } from "./icons";

const NAV_ITEMS = [
  { href: "/", label: "Início" },
  { href: "/#categorias", label: "Categorias" },
  { href: "/podcast", label: "PodCast" },
] as const;

const ZAP_DA_FE_URL = "https://zapdafe.com.br/mensagem";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href.includes("#")) return false;
  return pathname.startsWith(href);
}

/**
 * Header por breakpoint:
 * - < lg (mobile): padrão ReelShort — hambúrguer (drawer), logo centrada,
 *   busca real + avatar à direita; abas na segunda linha com underline
 *   laranja na ativa.
 * - >= lg (desktop): logo + nav inline + Entrar/Conta/coin chip (inalterado).
 * Em ambos, parado no topo o header flutua sobre o hero com o degradê
 * cinematográfico; rolou a página, vira uma barra de vidro fosco cinza
 * (`bg-[#202020]/85` + blur) — senão as abas somem em cima das fotos.
 * Some na rota /assistir, onde o player tem seu próprio chrome.
 */
export default function HeaderShell({
  loggedIn,
  coinBalance,
  userInitial,
}: {
  loggedIn: boolean;
  coinBalance?: number | null;
  userInitial?: string | null;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const scrolled = useScrolled();

  if (pathname.startsWith("/assistir")) return null;

  // Traje do header: degradê no topo, barra fosca com conteúdo por baixo.
  const barra = scrolled
    ? "bg-[#202020]/85 backdrop-blur-md border-b border-white/10"
    : "border-b border-transparent";

  return (
    <>
      {/* ===================== Desktop (>= lg) — inalterado ===================== */}
      <header
        className={`pointer-events-none fixed inset-x-0 top-0 z-50 hidden w-full transition-colors duration-300 lg:block ${barra}`}
      >
        {!scrolled && <div className="scrim-top absolute inset-0 h-24" aria-hidden />}
        <div className="relative flex items-center px-5 py-4">
          <span className="pointer-events-auto">
            <LogoLink />
          </span>
          <nav className="pointer-events-auto ml-7 flex items-center gap-5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`micro-label tracking-[0.22em] transition ${
                  isActive(pathname, item.href)
                    ? "text-accent"
                    : "text-white/70 hover:text-accent"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={ZAP_DA_FE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="micro-label tracking-[0.22em] text-white/70 transition hover:text-accent"
            >
              Zap da Fé
            </a>
          </nav>
          <nav className="pointer-events-auto ml-auto flex items-center gap-4">
            {loggedIn ? (
              <>
                <Link
                  href="/coins"
                  aria-label={`Saldo de ${coinBalance ?? 0} 314Coins`}
                  className="flex items-center gap-1.5 border border-white/25 px-3 py-1.5 text-xs font-semibold text-white/85 transition hover:border-accent hover:text-accent"
                >
                  <CoinIcon className="h-4 w-4 text-accent" />
                  {coinBalance ?? 0}
                </Link>
                <Link
                  href="/conta"
                  className="micro-label text-white/80 transition hover:text-accent"
                >
                  Conta
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="micro-label border border-white/40 px-3.5 py-2 text-white transition hover:border-accent hover:text-accent"
              >
                Entrar
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* ===================== Mobile (< lg) — padrão ReelShort ===================== */}
      <header
        className={`pointer-events-none fixed inset-x-0 top-0 z-50 w-full transition-colors duration-300 lg:hidden ${barra}`}
      >
        {!scrolled && <div className="scrim-top absolute inset-0 h-28" aria-hidden />}

        {/* Linha 1: hambúrguer · logo centrada · busca + avatar */}
        <div className="relative flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menu"
            className="pointer-events-auto flex h-10 w-10 items-center justify-center text-white/85 transition hover:text-white"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <span className="pointer-events-auto absolute left-1/2 -translate-x-1/2">
            <LogoLink />
          </span>
          <div className="pointer-events-auto flex items-center gap-1.5">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar séries"
              className="flex h-10 w-10 items-center justify-center text-white/85 transition hover:text-white"
            >
              <SearchIcon className="h-5 w-5" />
            </button>
            {loggedIn ? (
              <Link
                href="/conta"
                aria-label="Minha conta"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 text-sm font-bold text-white transition hover:border-accent hover:text-accent"
              >
                {userInitial ?? "·"}
              </Link>
            ) : (
              <Link
                href="/login"
                aria-label="Entrar ou criar conta"
                className="flex h-10 w-10 items-center justify-center text-white/85 transition hover:text-accent"
              >
                <UserCircleIcon className="h-6 w-6" />
              </Link>
            )}
          </div>
        </div>

        {/* Linha 2: abas com underline laranja na ativa */}
        <nav className="no-scrollbar pointer-events-auto relative flex items-center gap-6 overflow-x-auto border-b border-white/10 px-5">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`micro-label relative whitespace-nowrap py-3 tracking-[0.16em] transition ${
                  active ? "text-accent" : "text-white/70 hover:text-accent"
                }`}
              >
                {item.label}
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-accent"
                  />
                )}
              </Link>
            );
          })}
          <a
            href={ZAP_DA_FE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="micro-label relative whitespace-nowrap py-3 tracking-[0.16em] text-white/70 transition hover:text-accent"
          >
            Zap da Fé ↗
          </a>
        </nav>
      </header>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        loggedIn={loggedIn}
        coinBalance={coinBalance}
      />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
