"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { InstagramIcon, TikTokIcon, YouTubeIcon } from "./icons";
import { SITE } from "@/lib/site";

/**
 * Rodapé do site: marca à esquerda, colunas de links à direita — a estrutura
 * clássica de streaming (referência do dono: reelshort.com/pt). Some na rota
 * /assistir, como o header: o player é imersivo e tem chrome próprio.
 *
 * Os destinos vêm todos de rotas que existem (ou de `lib/site.ts`); nada de
 * link morto no rodapé, que é onde as pessoas procuram o que é real.
 */

const COLUNAS = [
  {
    titulo: "Canal",
    links: [
      { label: "Início", href: "/" },
      { label: "Categorias", href: "/#categorias" },
      { label: "PodCast", href: "/podcast" },
      { label: "Zap da Fé", href: SITE.zapDaFe, externo: true },
    ],
  },
  {
    titulo: "Assistir",
    links: [
      { label: "314 Pass", href: "/assinar" },
      { label: "Comprar 314Coins", href: "/coins" },
      { label: "Minha conta", href: "/conta" },
    ],
  },
  {
    titulo: "Sobre",
    links: [
      { label: "Termos de Uso", href: "/termos" },
      { label: "Política de Privacidade", href: "/privacidade" },
      { label: "Contate-nos", href: "/contato" },
    ],
  },
] as const;

const REDES = [
  { label: "YouTube", href: SITE.social.youtube, Icon: YouTubeIcon },
  { label: "Instagram", href: SITE.social.instagram, Icon: InstagramIcon },
  { label: "TikTok", href: SITE.social.tiktok, Icon: TikTokIcon },
] as const;

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/assistir")) return null;

  return (
    <footer className="relative mt-16 overflow-hidden border-t border-white/10 bg-black">
      {/* Marca d'água da casa — o mesmo 314 gigante das páginas internas */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-16 right-2 hidden select-none font-[family-name:var(--font-display)] text-[12rem] font-bold leading-none text-white/[0.03] sm:block"
      >
        314
      </span>

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-2 gap-x-6 gap-y-12 px-6 py-16 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-10">
        <div className="col-span-2 lg:col-span-1">
          <Link href="/" aria-label="Canal314 — página inicial" className="inline-block">
            <Logo />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/45">
            Micro-documentários verticais sobre os grandes nomes da fé e da
            política do Brasil.
          </p>
          <p className="mt-4 text-xs text-white/35">
            © {new Date().getFullYear()} {SITE.nome}. Todos os direitos
            reservados.
          </p>

          <ul className="mt-7 flex items-center gap-3">
            {REDES.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:border-accent hover:text-accent"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {COLUNAS.map((coluna) => (
          <nav key={coluna.titulo} aria-label={coluna.titulo}>
            <h2 className="micro-label text-white/80">{coluna.titulo}</h2>
            <ul className="mt-5 space-y-3.5">
              {coluna.links.map((link) => (
                <li key={link.label}>
                  {"externo" in link && link.externo ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/55 transition hover:text-accent"
                    >
                      {link.label} ↗
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 transition hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {coluna.titulo === "Sobre" && (
              <p className="mt-5 max-w-[220px] text-xs leading-relaxed text-white/30">
                Atendimento: {SITE.atendimento}
              </p>
            )}
          </nav>
        ))}
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-start gap-2 border-t border-white/[0.07] px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <p className="micro-label text-white/30">{SITE.selo}</p>
        <p className="text-xs text-white/30">
          Episódios 1 e 2 grátis · 314Coins ou 314 Pass para o resto
        </p>
      </div>
    </footer>
  );
}
