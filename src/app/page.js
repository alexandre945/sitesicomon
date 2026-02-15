"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function Badge({ children }) {
return ( <span
   className="
     text-xs rounded-full border px-2 py-1
     border-black text-black
     dark:border-zinc-800 dark:text-zinc-200
   "
 >
{children} </span>
);
}

function Row({ label, value }) {
return ( <div className="flex items-start justify-between gap-4 py-2 border-b border-black/20 dark:border-zinc-800/60 last:border-b-0"> <div className="text-sm text-black dark:text-zinc-400">{label}</div> <div className="text-sm text-black dark:text-zinc-100 text-right max-w-[60%] break-words">
{value ?? "—"} </div> </div>
);
}

export default function Home() {
const router = useRouter();
const [q, setQ] = useState("");
const [sites, setSites] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [openSite, setOpenSite] = useState(null);

async function loadSites() {
setLoading(true);
setError("");
try {
const res = await fetch("/api/sites", { cache: "no-store" });
if (!res.ok) throw new Error("Falha ao buscar sites");
const data = await res.json();
setSites(Array.isArray(data) ? data : []);
} catch (e) {
setError(e?.message || "Erro ao buscar sites");
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

return sites.filter((s) => {
  const code = (s.code || "").toLowerCase();
  const name = (s.name || "").toLowerCase();
  const address = (s.address || "").toLowerCase();
  const tipo = (s.tipo || "").toLowerCase();
  const relogioNumero = (s.relogioNumero || "").toLowerCase();

  return (
    code.includes(term) ||
    name.includes(term) ||
    address.includes(term) ||
    tipo.includes(term) ||
    relogioNumero.includes(term)
  );
});


}, [q, sites]);

const pageBg =
"bg-white text-black dark:bg-zinc-950 dark:text-zinc-100";

const inputCls =
"mt-1 w-full rounded-xl border px-3 py-2 outline-none " +
"bg-white text-black border-black focus:border-black " +
"dark:bg-zinc-950 dark:text-zinc-100 dark:border-zinc-800 dark:focus:border-zinc-600";

const cardBase =
"rounded-2xl p-4 transition " +
"bg-white/90 border border-black/20 hover:bg-white " +
"dark:bg-zinc-900/30 dark:border-zinc-800 dark:hover:bg-zinc-900/50";

const buttonSoft =
"rounded-xl border px-3 py-2 text-sm " +
"border-black bg-white text-black hover:bg-zinc-100 " +
"dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-100 dark:hover:bg-zinc-900/70";

return (
<div className={`min-h-screen p-4 ${pageBg}`}> <div className="max-w-3xl mx-auto"> <header className="flex items-center justify-between gap-2"> <h1 className="text-xl font-semibold">Sites (Torres)</h1>


      <div className="flex items-center gap-2">
        <button onClick={loadSites} className={buttonSoft}>
          Atualizar
        </button>

        <Link href="/sites/new" className={buttonSoft}>
          + Novo site
        </Link>
      </div>
    </header>

    <div className="mt-4">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar por sigla, nome, endereço ou tipo..."
        className={inputCls}
      />
    </div>

    <div className="mt-4 space-y-3">
      {loading && (
        <div className={cardBase}>
          <div className="text-sm text-black/70 dark:text-zinc-400">
            Carregando...
          </div>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className={cardBase}>
          <div className="text-sm text-black/70 dark:text-zinc-400">
            Nenhum site encontrado.
          </div>
        </div>
      )}

      {filtered.map((s) => {
        const isConcentradora =
          (s.tipo ?? "").toUpperCase() === "CONCENTRADORA";

        const borderHighlight = isConcentradora
          ? "!border-green-600/70 border-4 dark:!border-green-500/60"
          : "";

        return (
          <div key={s.id} className={`${cardBase} ${borderHighlight}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm text-black dark:text-zinc-400">
                  {s.code}
                </div>

                <div className="text-lg font-semibold">
                  {s.name}
                </div>

                <div className="text-sm text-black dark:text-zinc-400 mt-1">
                  {s.address}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge>
                    {s.tipo === "CONCENTRADORA"
                      ? "Concentradora"
                      : s.tipo === "REPETIDORA"
                      ? "Repetidora"
                      : "Site"}
                  </Badge>

                  <Badge>
                    {s.energia === "TRIFASICA"
                      ? "Trifásica"
                      : "Bifásica"}
                  </Badge>
                  <Badge>
                    {
                      s.relogioNumero
                      ? `Relógio: ${s.relogioNumero}`
                      : "Sem nº de relógio"
                    }
                  </Badge>

                  <Badge>
                    {s.has5g ? "5G: Sim" : "5G: Não"}

                  </Badge>
                  <Badge>
                    {s.cabmil ? "CABMIL: Sim" : "CABMIL: Não"}
                  </Badge>
                  <Badge>
                    {s.gsm ? "GSM: Sim" : "GSM: Não"}
                  </Badge>

                  <Badge>
                    {s.bateria
                      ? `Bateria: ${Number(s.bateriaQty || 0)}`
                      : "Sem bateria"}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => setOpenSite(s)}
                  className={buttonSoft}
                >
                  Ver mais
                </button>

                <button
                  className={buttonSoft}
                  onClick={() =>
                    router.push(`/sites/${s.id}/edit`)
                  }
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {openSite && (
      <div
        className="fixed inset-0 z-50 bg-black/60 p-4 flex items-center justify-center"
        onClick={() => setOpenSite(null)}
      >
        <div
          className="w-full max-w-2xl rounded-2xl border border-black bg-white p-4 text-black
                     dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-black dark:text-zinc-400">
                {openSite.code}
              </div>
              <div className="text-lg font-semibold">
                {openSite.name}
              </div>
              <div className="text-sm text-black dark:text-zinc-400">
                {openSite.address}
              </div>

            </div>

            <button
              onClick={() => setOpenSite(null)}
              className={buttonSoft}
            >
              Fechar
            </button>
          </div>

          <div className="mt-4 rounded-xl border border-black/20 bg-white/60 p-3
                          dark:border-zinc-800 dark:bg-zinc-900/20">

            <Row
              label="Tipo"
              value={
                openSite.tipo === "CONCENTRADORA"
                  ? "Concentradora"
                  : openSite.tipo === "REPETIDORA"
                  ? "Repetidora"
                  : "Site"
              }
            />

            <Row
              label="Energia"
              value={
                openSite.energia === "TRIFASICA"
                  ? "Trifásica"
                  : "Bifásica"
              }
            />

            <Row
              label="Cadeado"
              value={
                openSite.metodoAcesso === "CHAVE"
                  ? "Chave"
                  : openSite.metodoAcesso === "SEGREDO"
                  ? `Segredo: ${openSite.segredoNumero || "—"}`
                  : openSite.metodoAcesso === "BRUTF"
                  ? `BRUTF (NTP): ${openSite.ntpCode || "—"}`
                  : "—"
              }
            />

            <Row label="CABMIL" value={openSite.cabmil ? "Sim" : "Não"} />
            <Row label="GSM" value={openSite.gsm ? "Sim" : "Não"} />
            <Row label="5G" value={openSite.has5g ? "Sim" : "Não"} />

            <Row
              label="Relógio"
              value={openSite.relogioNumero ? openSite.relogioNumero : "Sem nº de relógio"}
            />


            <Row
              label="Bateria"
              value={
                openSite.bateria
                  ? `Sim (${Number(openSite.bateriaQty || 0)})`
                  : "Não"
              }
            />

            <Row
              label="Observação"
              value={openSite.observation || "—"}
            />
          </div>
        </div>
      </div>
    )}
  </div>
</div>


);
}
