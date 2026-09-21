import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-black text-neutral-700">404</p>
      <h1 className="mt-4 text-xl font-bold">Página não encontrada</h1>
      <p className="mt-2 text-sm text-neutral-400">
        A série ou episódio que você procura não existe ou foi removido.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
      >
        Voltar ao catálogo
      </Link>
    </div>
  );
}
