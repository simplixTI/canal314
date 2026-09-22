import type { ReactNode } from "react";

/**
 * Casca das páginas institucionais (termos, privacidade, contato): mesma
 * abertura das páginas internas — micro-label laranja, título display, texto
 * em coluna estreita — porque texto jurídico longo só se lê em medida curta.
 */
export default function LegalPage({
  kicker,
  titulo,
  resumo,
  atualizado,
  children,
}: {
  kicker: string;
  titulo: string;
  resumo: string;
  atualizado?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden px-6 pb-24 pt-32">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 top-20 select-none font-[family-name:var(--font-display)] text-[16rem] font-bold leading-none text-white/[0.04]"
      >
        314
      </span>

      <div className="relative mx-auto w-full max-w-2xl">
        <p className="micro-label text-accent">{kicker}</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl font-semibold uppercase leading-[0.95] tracking-[-0.02em]">
          {titulo}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/60">{resumo}</p>
        {atualizado && (
          <p className="mt-6 border-t border-white/10 pt-4 text-xs text-white/35">
            Última atualização: {atualizado}
          </p>
        )}

        <div className="mt-12 space-y-10">{children}</div>
      </div>
    </div>
  );
}

export function Secao({
  titulo,
  children,
}: {
  titulo: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="micro-label text-white/80">{titulo}</h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/55">
        {children}
      </div>
    </section>
  );
}
