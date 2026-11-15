
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inicial = {
  code: "",
  name: "",
  address: "",
  tipo: "REPETIDORA",
  energia: "BIFASICA",
  relogioNumero: "",
  metodoAcesso: "CHAVE",
  segredoNumero: "",
  ntpCode: "",
  acessoGabinetes: "",
  condicaoEstrada: "",
  gsm: false,
  has3g: false,
  has4g: false,
  has5g: false,
  bateria: false,
  bateriaQty: 0,
  tipoBateria: "",
  tecnicoCadastro: "",
  observation: "",
};

const campo =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const rotulo = "mb-1.5 block text-sm font-semibold text-slate-700";

function Secao({ numero, titulo, descricao, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
            {numero}
          </span>
          <div>
            <h2 className="font-bold text-slate-900">{titulo}</h2>
            <p className="text-xs text-slate-500">{descricao}</p>
          </div>
        </div>
      </div>
      <div className="space-y-4 p-5">{children}</div>
    </section>
  );
}

export default function NewSitePage() {
  const router = useRouter();
  const [form, setForm] = useState(inicial);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");

  function alterar(nome, valor) {
    setForm((anterior) => ({ ...anterior, [nome]: valor }));
  }

  async function salvar(evento) {
    evento.preventDefault();
    if (saving) return;

    setErro("");

    const code = form.code.toUpperCase().replace(/\s+/g, "");
    const name = form.name.trim();
    const tecnicoCadastro = form.tecnicoCadastro.trim();

    if (!code) return setErro("Informe a sigla do site.");
    if (!name) return setErro("Informe o nome do site.");
    if (!tecnicoCadastro) {
      return setErro("Informe o nome do técnico responsável.");
    }

    if (
      form.metodoAcesso === "SEGREDO" &&
      !form.segredoNumero.trim()
    ) {
      return setErro("Informe o número do segredo.");
    }

    if (
      form.metodoAcesso === "BRUTF" &&
      !form.ntpCode.trim()
    ) {
      return setErro("Informe o código NTP do Bluetooth.");
    }

    if (form.bateria && !form.tipoBateria) {
      return setErro("Selecione o tipo de bateria.");
    }

    if (
      form.bateria &&
      (!Number.isInteger(Number(form.bateriaQty)) ||
        Number(form.bateriaQty) < 1)
    ) {
      return setErro("Informe a quantidade de baterias.");
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        code,
        name,
        tecnicoCadastro,
        bateriaQty: form.bateria ? Number(form.bateriaQty) : 0,
        tipoBateria: form.bateria ? form.tipoBateria : null,
        condicaoEstrada: form.condicaoEstrada || null,
        relogioNumero: form.relogioNumero.trim() || null,
        segredoNumero:
          form.metodoAcesso === "SEGREDO"
            ? form.segredoNumero.trim()
            : null,
        ntpCode:
          form.metodoAcesso === "BRUTF"
            ? form.ntpCode.trim()
            : null,
      };

      const resposta = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(dados.error || "Erro ao cadastrar site.");
      }

      router.replace("/home");
      router.refresh();
    } catch (error) {
      setErro(error.message || "Erro inesperado.");
    } finally {
      setSaving(false);
    }
  }

  const tecnologias = [
    ["gsm", "GSM"],
    ["has3g", "3G"],
    ["has4g", "4G"],
    ["has5g", "5G"],
  ];

  return (
    <main className="min-h-screen bg-slate-100 pb-12">
        
<header
  style={{
    background: "linear-gradient(120deg, #020617, #1e3a8a, #1d4ed8)",
    color: "#ffffff",
  }}
  className="px-4 py-7 shadow-lg"
>
  <div className="mx-auto max-w-3xl">
    <button
      type="button"
      onClick={() => router.push("/home")}
      style={{
        color: "#ffffff",
        backgroundColor: "#1e40af",
        border: "1px solid #93c5fd",
      }}
      className="mb-5 rounded-lg px-4 py-2 text-sm font-semibold"
    >
      ← Voltar para sites
    </button>

    <h1
      style={{ color: "#ffffff" }}
      className="text-2xl font-extrabold sm:text-3xl"
    >
      Cadastrar novo site
    </h1>

    <p
      style={{ color: "#dbeafe" }}
      className="mt-2 text-sm"
    >
      Central de Sites ICOMON • Informações técnicas
    </p>
  </div>
</header>

      <form
        onSubmit={salvar}
        className="mx-auto mt-6 max-w-3xl space-y-5 px-4"
      >
        <Secao
          numero="1"
          titulo="Identificação"
          descricao="Informações gerais e localização"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={rotulo}>Sigla do site *</label>
              <input
                required
                className={campo}
                placeholder="Ex.: SP001"
                value={form.code}
                onChange={(e) => alterar("code", e.target.value)}
              />
            </div>

            <div>
              <label className={rotulo}>Nome do site *</label>
              <input
                required
                className={campo}
                placeholder="Ex.: Torre Centro"
                value={form.name}
                onChange={(e) => alterar("name", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={rotulo}>Endereço / localização</label>
            <input
              className={campo}
              placeholder="Rua, bairro, cidade ou referência"
              value={form.address}
              onChange={(e) => alterar("address", e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={rotulo}>Tipo do site</label>
              <select
                className={campo}
                value={form.tipo}
                onChange={(e) => alterar("tipo", e.target.value)}
              >
                <option value="REPETIDORA">Repetidora</option>
                <option value="CONCENTRADORA">Concentradora</option>
                <option value="SITE">Site</option>
              </select>
            </div>

            <div>
              <label className={rotulo}>Tipo de energia</label>
              <select
                className={campo}
                value={form.energia}
                onChange={(e) => alterar("energia", e.target.value)}
              >
                <option value="BIFASICA">Bifásica</option>
                <option value="TRIFASICA">Trifásica</option>
              </select>
            </div>
          </div>

          <div>
            <label className={rotulo}>Número do medidor</label>
            <input
              className={campo}
              placeholder="Número do relógio de energia"
              value={form.relogioNumero}
              onChange={(e) =>
                alterar("relogioNumero", e.target.value)
              }
            />
          </div>
        </Secao>

        <Secao
          numero="2"
          titulo="Acesso ao site"
          descricao="Portão, cadeado e gabinetes"
        >
          <div>
            <label className={rotulo}>Acesso ao portão</label>
            <select
              className={campo}
              value={form.metodoAcesso}
              onChange={(e) => {
                const metodoAcesso = e.target.value;
                setForm((anterior) => ({
                  ...anterior,
                  metodoAcesso,
                  segredoNumero:
                    metodoAcesso === "SEGREDO"
                      ? anterior.segredoNumero
                      : "",
                  ntpCode:
                    metodoAcesso === "BRUTF"
                      ? anterior.ntpCode
                      : "",
                }));
              }}
            >
              <option value="CHAVE">Chave padrão</option>
              <option value="SEGREDO">Segredo</option>
              <option value="BRUTF">Bluetooth</option>
              <option value="CABMIL">CABMIL</option>
            </select>
          </div>

          {form.metodoAcesso === "SEGREDO" && (
            <div>
              <label className={rotulo}>Número do segredo *</label>
              <input
                required
                className={campo}
                value={form.segredoNumero}
                onChange={(e) =>
                  alterar("segredoNumero", e.target.value)
                }
                placeholder="Informe o segredo"
              />
            </div>
          )}

          {form.metodoAcesso === "BRUTF" && (
            <div>
              <label className={rotulo}>Código NTP *</label>
              <input
                required
                className={campo}
                value={form.ntpCode}
                onChange={(e) => alterar("ntpCode", e.target.value)}
                placeholder="Código de acesso Bluetooth"
              />
            </div>
          )}

          <div>
            <label className={rotulo}>Acesso aos gabinetes</label>
            <textarea
              rows={3}
              className={campo}
              placeholder="Descreva como os gabinetes são acessados"
              value={form.acessoGabinetes}
              onChange={(e) =>
                alterar("acessoGabinetes", e.target.value)
              }
            />
          </div>
        </Secao>

        <Secao
          numero="3"
          titulo="Condições da estrada"
          descricao="Qual veículo consegue chegar ao site?"
        >
          <div>
            <label className={rotulo}>Condição de acesso</label>
            <select
              className={campo}
              value={form.condicaoEstrada}
              onChange={(e) =>
                alterar("condicaoEstrada", e.target.value)
              }
            >
              <option value="">Não informado</option>
              <option value="VEICULO_PEQUENO">
                Acesso com veículo pequeno
              </option>
              <option value="SOMENTE_4X4">
                Necessário veículo 4x4
              </option>
              <option value="INTRANSITAVEL">
                Estrada intransitável
              </option>
            </select>
          </div>
        </Secao>

        <Secao
          numero="4"
          titulo="Tecnologias e baterias"
          descricao="Redes disponíveis e banco de baterias"
        >
          <div>
            <label className={rotulo}>Tecnologias disponíveis</label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {tecnologias.map(([chave, nome]) => (
                <label
                  key={chave}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-4 text-sm font-bold transition ${
                    form[chave]
                      ? "border-blue-600 bg-blue-50 text-blue-800"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form[chave]}
                    onChange={(e) =>
                      alterar(chave, e.target.checked)
                    }
                    className="accent-blue-600"
                  />
                  {nome}
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <label className="flex cursor-pointer items-center gap-3 font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={form.bateria}
                onChange={(e) => {
                  const bateria = e.target.checked;
                  setForm((anterior) => ({
                    ...anterior,
                    bateria,
                    bateriaQty: bateria
                      ? anterior.bateriaQty || 1
                      : 0,
                    tipoBateria: bateria
                      ? anterior.tipoBateria
                      : "",
                  }));
                }}
                className="h-5 w-5 accent-blue-600"
              />
              Possui banco de baterias
            </label>
          </div>

          {form.bateria && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={rotulo}>Tipo de bateria *</label>
                <select
                  required
                  className={campo}
                  value={form.tipoBateria}
                  onChange={(e) =>
                    alterar("tipoBateria", e.target.value)
                  }
                >
                  <option value="">Selecione</option>
                  <option value="LITIO">Lítio</option>
                  <option value="CHUMBO_ACIDO">
                    Chumbo-ácido / VRLA
                  </option>
                  <option value="OUTRA">Outra</option>
                </select>
              </div>

              <div>
                <label className={rotulo}>Quantidade *</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  className={campo}
                  value={form.bateriaQty}
                  onChange={(e) =>
                    alterar("bateriaQty", e.target.value)
                  }
                />
              </div>
            </div>
          )}
        </Secao>

        <Secao
          numero="5"
          titulo="Responsável e observações"
          descricao="Identificação de quem está cadastrando"
        >
          <div>
            <label className={rotulo}>
              Nome do técnico responsável *
            </label>
            <input
              required
              className={campo}
              placeholder="Nome do técnico"
              value={form.tecnicoCadastro}
              onChange={(e) =>
                alterar("tecnicoCadastro", e.target.value)
              }
            />
          </div>

          <div>
            <label className={rotulo}>Observações gerais</label>
            <textarea
              rows={4}
              className={campo}
              placeholder="Informações adicionais sobre o site"
              value={form.observation}
              onChange={(e) =>
                alterar("observation", e.target.value)
              }
            />
          </div>

          <p className="text-xs text-slate-500">
            A data e a hora do cadastro serão registradas
            automaticamente.
          </p>
        </Secao>

        {erro && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
          >
            {erro}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-2xl bg-blue-700 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Salvando site..." : "Salvar cadastro do site"}
        </button>
      </form>
    </main>
  );
}
