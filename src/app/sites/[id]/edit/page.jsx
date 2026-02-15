"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const empty = {
  code: "",
  name: "",
  address: "",
  kind: "REPETIDORA",
  powerType: "BIFASICA",
  metodoAcesso: "CHAVE",
  segredoNumero: "",
  ntpCode: "",
  hasCabmil: false,
  hasBattery: false,
  batteryQty: 0,
  hasGsm: false,
  has5g: false,
  relogioNumero: "",
  observation: "",
};

export default function EditSitePage() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  function setField(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function normalizeCode(v) {
    return (v || "").toUpperCase().replace(/\s+/g, "");
  }

  // ✅ carrega o site
  useEffect(() => {
    async function load() {
      setErr("");
      try {
        const res = await fetch(`/api/sites/${id}`, { cache: "no-store" });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || "Falha ao carregar site.");
        }
        const data = await res.json();

        // banco -> form
        setForm({
          code: data.code || "",
          name: data.name || "",
          address: data.address || "",

          // Tipo / Energia
          kind: data.tipo || "REPETIDORA",
          powerType: data.energia || "BIFASICA",

          // Método de acesso (novo)
          accessType: data.metodoAcesso || "CHAVE",

          // Campos condicionais
          segredoNumero: data.segredoNumero || "",
          ntpCode: data.ntpCode || "",

          // Infra
          hasCabmil: !!data.cabmil,
          hasBattery: !!data.bateria,
          batteryQty: Number(data.bateriaQty || 0),
          hasGsm: !!data.gsm,
          has5g: !!data.has5g,

          // Novo campo
          relogioNumero: data.relogioNumero || "",

          // Extras
          observation: data.observation || "",
        });


        setLoading(false);
      } catch (e) {
        setErr(e?.message || "Erro inesperado.");
        setLoading(false);
      }
    }

    if (id) load();
  }, [id]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    const code = normalizeCode(form.code);
    const name = (form.name || "").trim();

    if (!code) return setErr("Informe a sigla.");
    if (!name) return setErr("Informe o nome.");

    const batteryQty = form.hasBattery ? Number(form.batteryQty || 0) : 0;
    if (form.hasBattery && batteryQty <= 0) {
      return setErr("Se tem bateria, informe a quantidade (mín. 1).");
    }

    setSaving(true);

    try {
      // form -> payload pro backend
      const payload = {
        code,
        name,
        address: (form.address || "").trim(),

        tipo: form.kind,
        energia: form.powerType,
         // Método acesso (novo nome)
        metodoAcesso: form.accessType,

        // Condicionais do cadeado
        segredoNumero:
          form.accessType === "SEGREDO"
            ? (form.segredoNumero || "").trim()
            : null,

        ntpCode:
          form.accessType === "BRUTF"
            ? (form.ntpCode || "").trim()
            : null,

        cabmil: !!form.hasCabmil,
        bateria: !!form.hasBattery,
        bateriaQty: Number(form.batteryQty || 0),

        gsm: !!form.hasGsm,
        has5g: !!form.has5g,
        relogioNumero:
        (form.relogioNumero || "").trim() || null,
        observation: (form.observation || "").trim() || null,
      };

      const res = await fetch(`/api/sites/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Falha ao atualizar.");
      }

      router.replace("/"); // volta pra lista
    } catch (e2) {
      setErr(e2?.message || "Erro inesperado.");
      setSaving(false);
    }
  }

  // classes (igual seu padrão)
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

  if (loading) {
    return (
      <div className={`min-h-screen p-4 ${pageBg}`}>
        <div className="max-w-2xl mx-auto">
          <p className={helpCls}>Carregando...</p>
          {err ? <div className="mt-2 text-sm text-red-500">{err}</div> : null}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 ${pageBg}`}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Editar site</h1>
            <p className={`mt-1 ${helpCls}`}>Atualize os dados e salve.</p>
          </div>

          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border px-3 py-2 text-sm hover:opacity-90 border-zinc-200 dark:border-zinc-800"
          >
            Voltar
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className={`rounded-2xl p-4 space-y-4 ${cardBg}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Sigla</label>
                <input
                  value={form.code}
                  onChange={(e) => setField("code", e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Nome</label>
                <input
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Endereço</label>
              <input
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Número do relógio</label>
              <input
                value={form.relogioNumero}
                onChange={(e) =>
                  setField("relogioNumero", e.target.value)
                }
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Acesso</label>
                <select
                  value={form.accessType}
                  onChange={(e) => setField("accessType", e.target.value)}
                  className={selectCls}
                >
                  <option value="CHAVE">Chave</option>
                  <option value="SEGREDO">Segredo</option>
                  <option value="BRUTF">Brutf</option>
                </select>
                       {/* SEGREDO */}
                    {form.accessType === "SEGREDO" && (
                      <div className="mt-2">
                        <label className={labelCls}>Número do segredo</label>
                        <input
                          value={form.segredoNumero}
                          onChange={(e) =>
                            setField("segredoNumero", e.target.value)
                          }
                          className={inputCls}
                        />
                      </div>
                    )}

                    {/* BRUTF */}
                    {form.accessType === "BRUTF" && (
                      <div className="mt-2">
                        <label className={labelCls}>Código NTP</label>
                        <input
                          value={form.ntpCode}
                          onChange={(e) =>
                            setField("ntpCode", e.target.value)
                          }
                          className={inputCls}
                        />
                      </div>
                    )}
              </div>

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
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}
