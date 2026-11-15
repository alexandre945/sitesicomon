
export const runtime = "nodejs";

import { prisma } from "../../../lib/prisma/prisma";

const TIPOS = ["REPETIDORA", "CONCENTRADORA", "SITE"];
const ENERGIAS = ["BIFASICA", "TRIFASICA"];
const ACESSOS = ["CHAVE", "SEGREDO", "BRUTF", "CABMIL"];
const ESTRADAS = ["VEICULO_PEQUENO", "SOMENTE_4X4", "INTRANSITAVEL"];
const BATERIAS = ["LITIO", "CHUMBO_ACIDO", "OUTRA"];

function texto(valor) {
  return String(valor ?? "").trim();
}

function opcional(valor) {
  return texto(valor) || null;
}

function erro(mensagem, status = 400) {
  return Response.json({ error: mensagem }, { status });
}

export async function GET() {
  try {
    const sites = await prisma.site.findMany({
      orderBy: { createdAt: "desc" },
    });

    return Response.json(sites);
  } catch (error) {
    console.error("Erro ao listar sites:", error);
    return erro("Não foi possível carregar os sites.", 500);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const code = texto(body.code).toUpperCase().replace(/\s+/g, "");
    const name = texto(body.name);

    if (!code) return erro("Informe a sigla do site.");
    if (!name) return erro("Informe o nome do site.");

    const tipo = body.tipo || "REPETIDORA";
    const energia = body.energia || "BIFASICA";
    const metodoAcesso = body.metodoAcesso || "CHAVE";

    if (!TIPOS.includes(tipo)) {
      return erro("Tipo de site inválido.");
    }

    if (!ENERGIAS.includes(energia)) {
      return erro("Tipo de energia inválido.");
    }

    if (!ACESSOS.includes(metodoAcesso)) {
      return erro("Método de acesso inválido.");
    }

    if (metodoAcesso === "SEGREDO" && !texto(body.segredoNumero)) {
      return erro("Informe o número do segredo.");
    }

    if (metodoAcesso === "BRUTF" && !texto(body.ntpCode)) {
      return erro("Informe o código NTP do Bluetooth.");
    }

    const condicaoEstrada = body.condicaoEstrada || null;

    if (condicaoEstrada && !ESTRADAS.includes(condicaoEstrada)) {
      return erro("Condição da estrada inválida.");
    }

    const bateria = body.bateria === true;
    const bateriaQty = bateria ? Number(body.bateriaQty ?? 0) : 0;
    const tipoBateria = bateria ? body.tipoBateria || null : null;

    if (
      !Number.isInteger(bateriaQty) ||
      bateriaQty < 0 ||
      (bateria && bateriaQty === 0)
    ) {
      return erro("Informe uma quantidade válida de baterias.");
    }

    if (tipoBateria && !BATERIAS.includes(tipoBateria)) {
      return erro("Tipo de bateria inválido.");
    }

    // Obrigatório nos novos cadastros.
    const tecnicoCadastro = texto(body.tecnicoCadastro);

    if (!tecnicoCadastro) {
      return erro("Informe o nome do técnico responsável.");
    }

    const created = await prisma.site.create({
      data: {
        code,
        name,
        address: texto(body.address),

        tipo,
        energia,
        relogioNumero: opcional(body.relogioNumero),

        metodoAcesso,
        segredoNumero:
          metodoAcesso === "SEGREDO"
            ? opcional(body.segredoNumero)
            : null,
        ntpCode:
          metodoAcesso === "BRUTF"
            ? opcional(body.ntpCode)
            : null,

        // Campo antigo preservado para compatibilidade.
        cabmil: metodoAcesso === "CABMIL",

        gsm: body.gsm === true,
        has3g: body.has3g === true,
        has4g: body.has4g === true,
        has5g: body.has5g === true,

        bateria,
        bateriaQty,
        tipoBateria,

        acessoGabinetes: opcional(body.acessoGabinetes),
        condicaoEstrada,

        tecnicoCadastro,
        tecnicoAtualizacao: tecnicoCadastro,
        ultimaVerificacao: new Date(),

        observation: opcional(body.observation),

        historico: {
          create: {
            tecnico: tecnicoCadastro,
            descricao: "Cadastro inicial do site.",
          },
        },
      },
    });

    return Response.json(created, { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar site:", error);

    if (error?.code === "P2002") {
      return erro("Já existe um site cadastrado com essa sigla.", 409);
    }

    return erro("Não foi possível salvar o site.", 500);
  }
}
