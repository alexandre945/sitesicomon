"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (data.ok) {
      router.push("/home");
    } else {
      alert("Senha inválida");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      
      <form
        onSubmit={handleLogin}
        className="
          w-full max-w-sm
          bg-white dark:bg-zinc-900
          border border-black/20 dark:border-zinc-800
          rounded-2xl
          p-6
          shadow-lg
          space-y-4
        "
      >
        <h1 className="text-xl font-semibold text-center text-black dark:text-zinc-100">
          Login OEM Sites
        </h1>

        <input
          type="password"
          placeholder="Digite a senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="
            w-full
            rounded-xl
            border
            px-3 py-2
            outline-none
            bg-white text-black border-black
            focus:border-black
            dark:bg-zinc-950 dark:text-zinc-100 dark:border-zinc-800
          "
        />

        <button
          type="submit"
          className="
            w-full
            rounded-xl
            border
            px-3 py-2
            bg-black text-white
            hover:bg-zinc-800
            dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-300
          "
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
