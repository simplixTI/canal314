"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";

type Mode = "signin" | "signup";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push(next);
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}${next}` },
        });
        if (error) throw error;
        if (data.session) {
          // Confirmação de e-mail desativada: entra direto com trial ativo
          router.push(next);
          router.refresh();
        } else {
          setNotice(
            "Conta criada! Verifique seu e-mail para confirmar o cadastro e depois entre."
          );
          setMode("signin");
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? traduzErro(err.message)
          : "Algo deu errado. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${next}` },
    });
    if (error) {
      setError(traduzErro(error.message));
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border-b border-white/25 bg-transparent px-0 py-3 text-[15px] text-white placeholder:text-white/30 outline-none transition focus:border-white";

  return (
    <div className="flex min-h-dvh items-center justify-center px-6 py-16">
      <div className="w-full max-w-xs">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>

        <h1 className="mt-10 text-center font-[family-name:var(--font-display)] text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.02em]">
          {mode === "signin" ? "Entrar" : "Criar conta"}
        </h1>
        <p className="mt-3 text-center text-sm text-white/55">
          {mode === "signin"
            ? "Acesse sua conta para continuar assistindo"
            : "3 dias de teste grátis · sem cartão de crédito"}
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div>
            <label htmlFor="email" className="micro-label block text-white/50">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="voce@exemplo.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="micro-label block text-white/50">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="mínimo 6 caracteres"
            />
          </div>

          {error && (
            <p className="border border-white/30 px-4 py-3 text-sm text-white">
              {error}
            </p>
          )}
          {notice && (
            <p className="border border-white/30 px-4 py-3 text-sm text-white/80">
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-black transition hover:bg-white/85 disabled:opacity-40"
          >
            {loading
              ? "Aguarde..."
              : mode === "signin"
                ? "Entrar"
                : "Começar teste grátis"}
          </button>
        </form>

        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/15" />
          <span className="micro-label text-white/40">ou</span>
          <div className="h-px flex-1 bg-white/15" />
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full border border-white/35 px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:border-white disabled:opacity-40"
        >
          Continuar com Google
        </button>

        <p className="mt-10 text-center text-sm text-white/55">
          {mode === "signin" ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setNotice(null);
            }}
            className="font-semibold text-white underline decoration-white/40 hover:decoration-white"
          >
            {mode === "signin" ? "Cadastre-se grátis" : "Entrar"}
          </button>
        </p>
      </div>
    </div>
  );
}

function traduzErro(message: string): string {
  const map: [string, string][] = [
    ["Invalid login credentials", "E-mail ou senha incorretos."],
    ["User already registered", "Este e-mail já está cadastrado. Tente entrar."],
    ["Password should be at least", "A senha precisa de pelo menos 6 caracteres."],
    ["Unable to validate email", "E-mail inválido."],
    ["Email not confirmed", "Confirme seu e-mail antes de entrar."],
  ];
  for (const [key, value] of map) {
    if (message.includes(key)) return value;
  }
  return message;
}
