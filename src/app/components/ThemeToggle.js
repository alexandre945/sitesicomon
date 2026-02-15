"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);

    const saved = localStorage.getItem("theme");
    const isDark = saved === "dark";

    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);

    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  // ✅ NÃO renderiza no SSR (evita mismatch do texto/ícone)
  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      className="
        rounded-xl border px-3 py-2 text-sm
        border-black bg-white text-black hover:bg-zinc-100
        dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800
      "
    >
      {dark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
