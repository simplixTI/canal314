export default function SetupNotice() {
  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-neutral-700 bg-neutral-900 p-6 text-center">
      <h2 className="text-lg font-bold">Supabase ainda não configurado</h2>
      <p className="mt-2 text-sm text-neutral-400">
        Para ver o catálogo, crie um projeto no Supabase, rode{" "}
        <code className="rounded bg-neutral-800 px-1">supabase/schema.sql</code> e{" "}
        <code className="rounded bg-neutral-800 px-1">supabase/seed.sql</code>, e
        preencha o arquivo{" "}
        <code className="rounded bg-neutral-800 px-1">.env.local</code> com a URL e a
        chave anônima do projeto. Veja o passo a passo no README.
      </p>
    </div>
  );
}
