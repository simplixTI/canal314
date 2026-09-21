import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/data";
import { LogoLink } from "./Logo";

export default async function Header() {
  const supabase = await createClient();
  const user = supabase ? await getUser(supabase) : null;

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <LogoLink />
        <nav className="flex items-center gap-2 text-sm">
          {user ? (
            <>
              <Link
                href="/conta"
                className="rounded-full border border-neutral-700 px-4 py-1.5 font-medium text-neutral-200 transition hover:border-white hover:text-white"
              >
                Minha conta
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-1.5 font-medium text-neutral-300 transition hover:text-white"
              >
                Entrar
              </Link>
              <Link
                href="/login"
                className="rounded-full bg-white px-4 py-1.5 font-semibold text-neutral-950 transition hover:bg-neutral-200"
              >
                Teste grátis
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
