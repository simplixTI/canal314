export default function SetupNotice() {
  return (
    <div className="w-full max-w-sm border border-white/15 p-8 text-center">
      <p className="micro-label text-white/50">Configuração</p>
      <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold uppercase tracking-[-0.02em]">
        Supabase pendente
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-white/60">
        Crie um projeto no Supabase, rode{" "}
        <code className="border border-white/20 px-1.5 py-0.5 text-white/80">
          supabase/schema.sql
        </code>{" "}
        e{" "}
        <code className="border border-white/20 px-1.5 py-0.5 text-white/80">
          supabase/seed.sql
        </code>
        , e preencha o{" "}
        <code className="border border-white/20 px-1.5 py-0.5 text-white/80">
          .env.local
        </code>{" "}
        com a URL e a chave anônima. Passo a passo no README.
      </p>
    </div>
  );
}
