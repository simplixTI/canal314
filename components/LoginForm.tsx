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

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo className="h-14" />
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <h1 className="text-center text-xl font-bold">
            {mode === "signin" ? "Entrar" : "Criar conta grátis"}
          </h1>
          <p className="mt-1 text-center text-xs text-neutral-400">
            {mode === "signin"
              ? "Acesse sua conta para continuar assistindo"
              : "3 dias de teste grátis · sem cartão de crédito"}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm outline-none transition focus:border-white"
                placeholder="voce@exemplo.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium">
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm outline-none transition focus:border-white"
                placeholder="mínimo 6 caracteres"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-900 bg-red-950/50 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}
            {notice && (
              <p className="rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2 text-sm text-neutral-200">
                {notice}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-white px-4 py-3 font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:opacity-50"
            >
              {loading
                ? "Aguarde..."
                : mode === "signin"
                  ? "Entrar"
                  : "Começar teste grátis"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-neutral-500">
            <div className="h-px flex-1 bg-neutral-800" />
            ou
            <div className="h-px flex-1 bg-neutral-800" />
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full rounded-full border border-neutral-700 px-4 py-3 text-sm font-medium transition hover:border-white disabled:opacity-50"
          >
            Continuar com Google
          </button>

          <p className="mt-6 text-center text-sm text-neutral-400">
            {mode === "signin" ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
            <button
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
                setNotice(null);
              }}
              className="font-semibold text-white underline underline-offset-4"
            >
              {mode === "signin" ? "Cadastre-se grátis" : "Entrar"}
            </button>
          </p>
        </div>
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
