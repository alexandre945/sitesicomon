 
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        router.push("/home");
        router.refresh();
      } else {
        setError("Senha inválida. Tente novamente.");
      }
    } catch {
      setError("Não foi possível conectar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      {/* Elementos decorativos */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Identidade */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-blue-400/30 bg-blue-600/20 shadow-xl shadow-blue-950">
            <svg
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 20V4" />
              <path d="m7 20 5-16 5 16" />
              <path d="M8.5 15h7" />
              <path d="M10 10h4" />
              <path d="M5 7a10 10 0 0 1 0 10" />
              <path d="M19 7a10 10 0 0 0 0 10" />
              <path d="M2 4a15 15 0 0 0 0 16" />
              <path d="M22 4a15 15 0 0 1 0 16" />
            </svg>
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-blue-300">
            ICOMON
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Central de Sites
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            Gestão e consulta de informações técnicas
          </p>
        </div>

        {/* Formulário */}
        <form
          onSubmit={handleLogin}
          className="space-y-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl sm:p-9"
        >
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Bem-vindo!
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Digite a senha para acessar o sistema.
            </p>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Senha de acesso
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 pr-16 text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 text-sm font-semibold text-blue-700 hover:text-blue-900"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-800 to-blue-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-blue-900/20 transition hover:from-blue-900 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar no sistema →"}
          </button>

          <p className="text-center text-xs text-slate-400">
            Acesso exclusivo para equipe autorizada
          </p>
        </form>

        <p className="mt-7 text-center text-xs text-slate-500">
          Central de Sites ICOMON • Plataforma técnica
        </p>
      </div>
    </main>
  );
}
