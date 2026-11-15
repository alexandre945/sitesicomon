
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const tipoLabel = {
  SITE: "Site",
  REPETIDORA: "Repetidora",
  CONCENTRADORA: "Concentradora",
};

const acessoLabel = {
  CHAVE: "Chave padrão",
  SEGREDO: "Segredo",
  BRUTF: "Bluetooth",
  CABMIL: "CABMIL",
};

function Badge({ children, green = false }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        green
          ? "bg-emerald-100 text-emerald-800"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {children}
    </span>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-3 sm:flex-row sm:justify-between sm:gap-4">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="break-words text-sm font-medium text-slate-800 sm:max-w-[65%] sm:text-right">
        {value ?? "—"}
      </span>
    </div>
  );
}

export default function Home() {
  const router = useRouter();

  const [sites, setSites] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSite, setOpenSite] = useState(null);

  async function loadSites() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/sites", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Não foi possível carregar os sites.");
      }

      const data = await res.json();
      setSites(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Erro ao buscar sites.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSites();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();

    if (!term) return sites;

    return sites.filter((site) =>
      [
        site.code,
        site.name,
        site.address,
        site.tipo,
        site.relogioNumero,
      ]
        .some((value) =>
          String(value ?? "").toLowerCase().includes(term)
        )
    );
  }, [q, sites]);

  const totalConcentradoras = sites.filter(
    (s) => s.tipo === "CONCENTRADORA"
  ).length;

  const totalRepetidoras = sites.filter(
    (s) => s.tipo === "REPETIDORA"
  ).length;

  const buttonBase =
    "rounded-xl px-4 py-2 text-sm font-semibold transition " +
    "focus-visible:outline focus-visible:outline-2 " +
    "focus-visible:outline-offset-2 focus-visible:outline-blue-600";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* CABEÇALHO */}
      <header className="bg-gradient-to-r from-blue-950 to-blue-700 text-white shadow-md">
        <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                ICOMON • Gestão de infraestrutura
              </div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Central de Sites
              </h1>
              <p className="mt-1 text-sm text-blue-100">
                Consulta e gerenciamento de informações técnicas
              </p>
            </div>

            <button
              onClick={loadSites}
              disabled={loading}
              className={`${buttonBase} border border-white/30 bg-white/10 text-white hover:bg-white/20 disabled:opacity-50`}
            >
              ↻ Atualizar
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        {/* INDICADORES */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <StatCard
            label="Sites cadastrados"
            value={sites.length}
            icon="▣"
            color="blue"
          />

          <StatCard
            label="Concentradoras"
            value={totalConcentradoras}
            icon="◈"
            color="green"
          />

          <div className="col-span-2 md:col-span-1">
            <StatCard
              label="Repetidoras"
              value={totalRepetidoras}
              icon="▤"
              color="purple"
            />
          </div>
        </section>

        {/* PESQUISA */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1">
              <label
                htmlFor="search-sites"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Pesquisar site
              </label>

              <input
                id="search-sites"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Sigla, nome, endereço, tipo ou medidor..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <Link
              href="/sites/new"
              className={`${buttonBase} inline-flex items-center justify-center bg-blue-700 py-3 text-white hover:bg-blue-800`}
            >
              + Novo site
            </Link>
          </div>
        </section>

        {/* LISTAGEM */}
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Sites cadastrados
              </h2>
              <p className="text-sm text-slate-500">
                Informações disponíveis para consulta
              </p>
            </div>

            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
              {filtered.length} resultado(s)
            </span>
          </div>

          {loading && (
            <div className="rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm">
              Carregando sites...
            </div>
          )}

          {!loading && error && (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700"
            >
              <p>{error}</p>
              <button
                onClick={loadSites}
                className="mt-3 font-semibold underline"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              Nenhum site encontrado.
            </div>
          )}

          {!loading && !error && (
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map((site) => {
                const concentradora =
                  site.tipo === "CONCENTRADORA";

                return (
                  <article
                    key={site.id}
                    className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${
                      concentradora
                        ? "border-emerald-400 ring-1 ring-emerald-200"
                        : "border-slate-200"
                    }`}
                  >
                    <div
                      className={`h-1.5 ${
                        concentradora
                          ? "bg-emerald-500"
                          : "bg-blue-600"
                      }`}
                    />

                    <div className="p-5">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                            {site.code}
                          </span>

                          <h3 className="mt-1 break-words text-xl font-bold text-slate-900">
                            {site.name}
                          </h3>

                          <p className="mt-1 break-words text-sm text-slate-500">
                            📍 {site.address || "Endereço não informado"}
                          </p>
                        </div>

                        <Badge green={concentradora}>
                          {tipoLabel[site.tipo] || "Site"}
                        </Badge>
                      </div>

                      <div className="my-4 flex flex-wrap gap-2">
                        <Badge>
                          {site.energia === "TRIFASICA"
                            ? "Trifásica"
                            : "Bifásica"}
                        </Badge>

                        <Badge>
                          {site.relogioNumero
                            ? `Medidor: ${site.relogioNumero}`
                            : "Sem medidor"}
                        </Badge>

                        <Badge>
                          5G: {site.has5g ? "Sim" : "Não"}
                        </Badge>

                        <Badge>
                          GSM: {site.gsm ? "Sim" : "Não"}
                        </Badge>

                        <Badge>
                          {site.bateria
                            ? `Baterias: ${site.bateriaQty || 0}`
                            : "Sem bateria"}
                        </Badge>
                      </div>

                      <div className="flex gap-2 border-t border-slate-100 pt-4">
                        <button
                          onClick={() => setOpenSite(site)}
                          className={`${buttonBase} flex-1 bg-blue-50 text-blue-700 hover:bg-blue-100`}
                        >
                          Ver detalhes
                        </button>

                        <button
                          onClick={() =>
                            router.push(`/sites/${site.id}/edit`)
                          }
                          className={`${buttonBase} flex-1 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
                        >
                          Editar
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* DETALHES DO SITE */}
      {openSite && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-5"
          onClick={() => setOpenSite(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Detalhes do site ${openSite.code}`}
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 bg-blue-900 p-5 text-white">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                  {openSite.code}
                </p>

                <h2 className="mt-1 break-words text-xl font-bold">
                  {openSite.name}
                </h2>

                <p className="mt-1 text-sm text-blue-100">
                  {openSite.address}
                </p>
              </div>

              <button
                onClick={() => setOpenSite(null)}
                aria-label="Fechar detalhes"
                className="rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto p-5">
              <SectionTitle>Informações gerais</SectionTitle>

              <InfoRow
                label="Tipo de site"
                value={tipoLabel[openSite.tipo] || "Site"}
              />

              <InfoRow
                label="Energia"
                value={
                  openSite.energia === "TRIFASICA"
                    ? "Trifásica"
                    : "Bifásica"
                }
              />

              <InfoRow
                label="Número do medidor"
                value={openSite.relogioNumero || "Não informado"}
              />

              <SectionTitle>Acesso ao site</SectionTitle>

              <InfoRow
                label="Tipo de acesso"
                value={
                  acessoLabel[openSite.metodoAcesso] || "Não informado"
                }
              />

              {openSite.metodoAcesso === "SEGREDO" && (
                <InfoRow
                  label="Segredo"
                  value={openSite.segredoNumero || "Não informado"}
                />
              )}

              {openSite.metodoAcesso === "BRUTF" && (
                <InfoRow
                  label="Código NTP"
                  value={openSite.ntpCode || "Não informado"}
                />
              )}

              {openSite.cabmil && (
                <InfoRow label="CABMIL (cadastro antigo)" value="Sim" />
              )}

              <SectionTitle>Equipamentos</SectionTitle>

              <InfoRow
                label="GSM"
                value={openSite.gsm ? "Sim" : "Não"}
              />

              <InfoRow
                label="5G"
                value={openSite.has5g ? "Sim" : "Não"}
              />

              <InfoRow
                label="Baterias"
                value={
                  openSite.bateria
                    ? `Sim — ${openSite.bateriaQty || 0} unidade(s)`
                    : "Não"
                }
              />

              <SectionTitle>Observações</SectionTitle>

              <p className="mt-2 whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                {openSite.observation || "Nenhuma observação cadastrada."}
              </p>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 p-4">
              <button
                onClick={() => setOpenSite(null)}
                className={`${buttonBase} border border-slate-200 bg-white text-slate-700`}
              >
                Fechar
              </button>

              <button
                onClick={() =>
                  router.push(`/sites/${openSite.id}/edit`)
                }
                className={`${buttonBase} bg-blue-700 text-white hover:bg-blue-800`}
              >
                Editar site
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-emerald-100 text-emerald-700",
    purple: "bg-violet-100 text-violet-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-xl ${
          colors[color] || colors.blue
        }`}
      >
        {icon}
      </div>

      <p className="text-xs font-medium text-slate-500 sm:text-sm">
        {label}
      </p>

      <p className="mt-1 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 className="mb-1 mt-6 border-b border-blue-100 pb-2 text-sm font-bold uppercase tracking-wider text-blue-800 first:mt-0">
      {children}
    </h3>
  );
}
