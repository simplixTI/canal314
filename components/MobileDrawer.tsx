"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "./Logo";
import { CoinIcon, XIcon } from "./icons";

const ZAP_DA_FE_URL = "https://zapdafe.com.br/mensagem";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  loggedIn: boolean;
  coinBalance?: number | null;
}

/**
 * Drawer lateral esquerdo do header mobile (padrão ReelShort), na gramática
 * do app: preto, hairlines, micro-labels, laranja nos acentos.
 * Fecha no backdrop, Esc e na navegação; trava o scroll do body aberto.
 */
export default function MobileDrawer({
  open,
  onClose,
  loggedIn,
  coinBalance,
}: MobileDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Fecha ao navegar
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Esc + trava de scroll
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    onClose();
    router.push("/");
    router.refresh();
  }

  const linkClass =
    "block py-3 text-[15px] font-medium text-white/85 transition hover:text-accent";
  const quietLinkClass =
    "block py-3 text-sm text-white/55 transition hover:text-accent";

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[70] lg:hidden ${open ? "" : "pointer-events-none"}`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/70 transition-opacity duration-300 motion-reduce:transition-none ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Painel */}
      <div
        role="dialog"
        aria-label="Menu"
        className={`absolute inset-y-0 left-0 flex w-[85%] max-w-[320px] flex-col overflow-y-auto border-r border-white/10 bg-[#0c0c0c] transition-transform duration-300 ease-out motion-reduce:transition-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5">
          <Logo size="sm" />
          <button
            onClick={onClose}
            aria-label="Fechar menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/70 transition hover:border-white hover:text-white"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        {loggedIn && (
          <Link
            href="/coins"
            onClick={onClose}
            className="mx-5 mb-2 flex items-center gap-3 border border-white/15 px-4 py-3 transition hover:border-accent"
          >
            <CoinIcon className="h-6 w-6 text-accent" />
            <span className="font-[family-name:var(--font-display)] text-2xl font-semibold leading-none">
              {coinBalance ?? 0}
            </span>
            <span className="micro-label text-white/50">314Coins</span>
          </Link>
        )}

        <nav className="flex flex-col px-5 pt-2">
          <Link href="/" onClick={onClose} className={linkClass}>
            Início
          </Link>
          <Link href="/#categorias" onClick={onClose} className={linkClass}>
            Categorias
          </Link>
          <Link href="/podcast" onClick={onClose} className={linkClass}>
            PodCast
          </Link>
          <a
            href={ZAP_DA_FE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className={linkClass}
          >
            Zap da Fé ↗
          </a>

          <div className="my-3 h-px bg-white/10" aria-hidden />

          <Link
            href="/assinar"
            onClick={onClose}
            className="block py-3 text-[15px] font-semibold text-accent transition hover:text-accent-hover"
          >
            314 Pass
          </Link>
          {loggedIn ? (
            <Link href="/conta" onClick={onClose} className={linkClass}>
              Minha Conta
            </Link>
          ) : (
            <Link href="/login" onClick={onClose} className={linkClass}>
              Entrar/Criar conta
            </Link>
          )}

          <div className="my-3 h-px bg-white/10" aria-hidden />

          <Link href="/termos" onClick={onClose} className={quietLinkClass}>
            Termos de Uso
          </Link>
          <Link href="/privacidade" onClick={onClose} className={quietLinkClass}>
            Privacidade
          </Link>
          <Link href="/contato" onClick={onClose} className={quietLinkClass}>
            Contato
          </Link>

          {loggedIn && (
            <>
              <div className="my-3 h-px bg-white/10" aria-hidden />
              <button
                onClick={handleLogout}
                className="py-3 text-left text-sm text-white/55 transition hover:text-accent"
              >
                Sair
              </button>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}
