"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoLink } from "./Logo";
import { CoinIcon } from "./icons";

const NAV_ITEMS = [
  { href: "/", label: "Início" },
  { href: "/#categorias", label: "Categorias" },
  { href: "/podcast", label: "PodCast" },
] as const;

const ZAP_DA_FE_URL = "https://zapdafe.com.br/mensagem";

/**
 * Chrome mínimo sobre o conteúdo: logo + seções à esquerda, conta à direita.
 * Item ativo em laranja (como o item ativo do ReelShort). No mobile as seções
 * caem para uma segunda linha da barra; no desktop ficam ao lado da logo.
 * Some na rota /assistir, onde o player tem seu próprio chrome.
 */
export default function HeaderShell({
  loggedIn,
  coinBalance,
}: {
  loggedIn: boolean;
  coinBalance?: number | null;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/assistir")) return null;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 w-full">
      <div className="scrim-top absolute inset-0 h-28 sm:h-24" aria-hidden />
      <div className="relative flex flex-wrap items-center px-5 py-4">
        <span className="pointer-events-auto order-1">
          <LogoLink />
        </span>
        <nav className="pointer-events-auto order-3 mt-2.5 flex w-full items-center gap-4 sm:order-2 sm:ml-7 sm:mt-0 sm:w-auto sm:gap-5">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/"
              ? pathname === "/"
              : !item.href.includes("#") && pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`micro-label tracking-[0.14em] transition sm:tracking-[0.22em] ${
                  active
                    ? "text-accent"
                    : "text-white/70 hover:text-accent"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href={ZAP_DA_FE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="micro-label tracking-[0.14em] text-white/70 transition hover:text-accent sm:tracking-[0.22em]"
          >
            Zap da Fé
          </a>
        </nav>
        <nav className="pointer-events-auto order-2 ml-auto flex items-center gap-4 sm:order-3">
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
  );
}
