"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const empty = {
  code: "",
  name: "",
  address: "",
  relogioNumero: "",

  kind: "REPETIDORA", // REPETIDORA | CONCENTRADORA | SITE
  powerType: "BIFASICA", // BIFASICA | TRIFASICA

  lockMethod: "CHAVE", // CHAVE | SEGREDO | BRUTF
  segredoNumero: "",
  ntpCode: "",

  hasCabmil: false,
  hasBattery: false,
  batteryQty: 0,
  hasGsm: false,
  has5g: false,
  observation: "",
};

export default function NewSitePage() {
  const router = useRouter();
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  // theme (rápido, sem lib)
  const [theme, setTheme] = useState("dark"); // "dark" | "light"

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  function setField(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function normalizeCode(v) {
    return v.toUpperCase().replace(/\s+/g, "");
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    const code = normalizeCode(form.code);
    const name = form.name.trim();

    if (!code) return setErr("Informe a sigla.");
    if (!name) return setErr("Informe o nome.");

    // valida bateria
    const batteryQty = form.hasBattery ? Number(form.batteryQty || 0) : 0;
    if (form.hasBattery && batteryQty <= 0) {
      return setErr("Se tem bateria, informe a quantidade (mín. 1).");
    }

    // valida método do cadeado
    const lockMethod = (form.lockMethod || "").toUpperCase();

    if (lockMethod === "SEGREDO") {
      const seg = (form.segredoNumero || "").trim();
      if (!seg) return setErr("Informe o número do segredo.");
    }

    if (lockMethod === "BRUTF") {
      const ntp = (form.ntpCode || "").trim();
      if (!ntp) return setErr("Informe o código NTP.");
    }

    setSaving(true);

    try {
      const payload = {
        code,
        name,
        address: form.address.trim(),
        relogioNumero: form.relogioNumero ? form.relogioNumero.trim() : null,


        // enums do banco
        tipo: form.kind,
        energia: form.powerType,
        metodoAcesso: form.lockMethod,

        // campos extras (só preenche quando necessário)
        segredoNumero:
          lockMethod === "SEGREDO" ? form.segredoNumero.trim() : null,
        ntpCode: lockMethod === "BRUTF" ? form.ntpCode.trim() : null,

        cabmil: !!form.hasCabmil,
        bateria: !!form.hasBattery,
        bateriaQty: batteryQty,

        gsm: !!form.hasGsm,
        has5g: !!form.has5g,
        observation: form.observation.trim() || null,
      };

      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Falha ao salvar no banco.");
      }

      router.replace("/");
    } catch (e2) {
      setErr(e2?.message || "Erro inesperado.");
      setSaving(false);
    }
  }

  // cores (light/dark) com classes do Tailwind
  const pageBg = "bg-zinc-100 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100";
  const cardBg =
    "border border-zinc-200 bg-white/70 dark:border-zinc-800 dark:bg-zinc-900/30";

  const inputCls =
    "mt-1 w-full rounded-xl border px-3 py-2 outline-none " +
    "bg-white text-black border-black focus:border-black " +
    "dark:bg-zinc-950 dark:text-zinc-100 dark:border-zinc-800 dark:focus:border-zinc-600";

  const labelCls = "text-sm font-medium text-black dark:text-zinc-300";
  const helpCls = "text-sm text-zinc-500 dark:text-zinc-400";

  const selectCls =
    "mt-1 w-full rounded-xl border px-3 py-2 outline-none " +
    "bg-white text-black border-black " +
    "focus:border-black focus:ring-0 " +
    "dark:bg-zinc-950 dark:text-zinc-100 dark:border-zinc-800";

  const smallInputCls =
    "mt-1 w-full rounded-xl border px-3 py-2 outline-none " +
    "bg-white text-black border-black focus:border-black " +
    "dark:bg-zinc-950 dark:text-zinc-100 dark:border-zinc-800 dark:focus:border-zinc-600";

  return (
    <div className={`min-h-screen p-4 ${pageBg}`}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Novo site</h1>
            <p className={`mt-1 ${helpCls}`}>Cadastre a torre para consulta rápida.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl border px-3 py-2 text-sm hover:opacity-90 border-zinc-200 dark:border-zinc-800"
            >
              Voltar
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className={`rounded-2xl p-4 space-y-4 ${cardBg}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Sigla</label>
                <input
                  value={form.code}
                  onChange={(e) => setField("code", e.target.value)}
                  placeholder="Ex: SP001"
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Nome</label>
                <input
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="Ex: Torre Centro"
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Endereço</label>
              <input
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
                placeholder="Rua, número, bairro..."
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Tipo do site</label>
                <select
                  value={form.kind}
                  onChange={(e) => setField("kind", e.target.value)}
                  className={selectCls}
                >
                  <option value="REPETIDORA">Repetidora</option>
                  <option value="CONCENTRADORA">Concentradora</option>
                  <option value="SITE">Site</option>
                </select>
              </div>

              <div>
                <label className={labelCls}>Energia</label>
                <select
                  value={form.powerType}
                  onChange={(e) => setField("powerType", e.target.value)}
                  className={selectCls}
                >
                  <option value="BIFASICA">Bifásica</option>
                  <option value="TRIFASICA">Trifásica</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Nº do relógio</label>
                <input
                  value={form.relogioNumero}
                  onChange={(e) => setField("relogioNumero", e.target.value)}
                  placeholder="Ex: 123456"
                  className={inputCls}
                />
              </div>

            </div>

            {/* CADEADO / MÉTODO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Cadeado (método)</label>
                <select
                  value={form.lockMethod}
                  onChange={(e) => {
                    const v = e.target.value;
                    setField("lockMethod", v);

                    // limpa campos extras quando troca método
                    if (v !== "SEGREDO") setField("segredoNumero", "");
                    if (v !== "BRUTF") setField("ntpCode", "");
                  }}
                  className={selectCls}
                >
                  <option value="CHAVE">Chave</option>
                  <option value="SEGREDO">Segredo</option>
                  <option value="BRUTF">BRUTF</option>
                </select>
              </div>

              {/* Campo condicional */}
              {form.lockMethod === "SEGREDO" ? (
                <div>
                  <label className={labelCls}>Número do segredo</label>
                  <input
                    value={form.segredoNumero}
                    onChange={(e) => setField("segredoNumero", e.target.value)}
                    placeholder="Ex: 1234"
                    className={smallInputCls}
                  />
                </div>
              ) : form.lockMethod === "BRUTF" ? (
                <div>
                  <label className={labelCls}>Código NTP</label>
                  <input
                    value={form.ntpCode}
                    onChange={(e) => setField("ntpCode", e.target.value)}
                    placeholder="Ex: NTP-001"
                    className={smallInputCls}
                  />
                </div>
              ) : (
                <div className="sm:flex sm:items-end">
                  {/* <div className={helpCls}>Sem campo extra para chave.</div> */}
                </div>
              )}
            </div>

            {/* CHECKS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-end gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.hasCabmil}
                    onChange={(e) => setField("hasCabmil", e.target.checked)}
                  />
                  Cabmil
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.hasGsm}
                    onChange={(e) => setField("hasGsm", e.target.checked)}
                  />
                  GSM
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.has5g}
                    onChange={(e) => setField("has5g", e.target.checked)}
                  />
                  5G
                </label>
              </div>
            </div>

            {/* BATERIA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.hasBattery}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setField("hasBattery", checked);
                    if (!checked) setField("batteryQty", 0);
                  }}
                />
                Possui bateria
              </label>

              <div>
                <label className={labelCls}>Qtd baterias</label>
                <input
                  type="number"
                  min={0}
                  value={form.hasBattery ? form.batteryQty : 0}
                  disabled={!form.hasBattery}
                  onChange={(e) => setField("batteryQty", Number(e.target.value))}
                  className={`${inputCls} disabled:opacity-50`}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Observação</label>
              <textarea
                rows={3}
                value={form.observation}
                onChange={(e) => setField("observation", e.target.value)}
                placeholder="Ex: acesso difícil em dias de chuva..."
                className={inputCls}
              />
            </div>
          </div>

          {err ? <div className="text-sm text-red-500">{err}</div> : null}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-zinc-950 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-950 py-2 font-medium disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar site"}
          </button>
        </form>
      </div>
    </div>
  );
}
