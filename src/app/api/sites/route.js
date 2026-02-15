export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma/prisma";

export async function GET() {
  const sites = await prisma.site.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json(sites);
}

export async function POST(req) {
  try {
    const body = await req.json();

    // validações mínimas (igual você já vinha usando)
    const code = String(body.code || "").trim();
    const name = String(body.name || "").trim();

    if (!code) {
      return Response.json({ error: "Informe a sigla." }, { status: 400 });
    }
    if (!name) {
      return Response.json({ error: "Informe o nome." }, { status: 400 });
    }

    // regra: se metodoAcesso = SEGREDO exige segredoNumero
    if (body.metodoAcesso === "SEGREDO" && !String(body.segredoNumero || "").trim()) {
      return Response.json({ error: "Informe o número do segredo." }, { status: 400 });
    }

    // regra: se metodoAcesso = BRUTF exige ntpCode
    if (body.metodoAcesso === "BRUTF" && !String(body.ntpCode || "").trim()) {
      return Response.json({ error: "Informe o código NTP." }, { status: 400 });
    }

    const created = await prisma.site.create({
      data: {
        code,
        name,
        address: String(body.address || "").trim(),

        tipo: body.tipo, // REPETIDORA | CONCENTRADORA | SITE
        energia: body.energia,
        relogioNumero: body.relogioNumero ? String(body.relogioNumero || "").trim() : null,

      
        metodoAcesso: body.metodoAcesso, // CHAVE | SEGREDO | BRUTF
        ntpCode: body.metodoAcesso === "BRUTF" ? String(body.ntpCode || "").trim() : null,
        segredoNumero:
          body.metodoAcesso === "SEGREDO" ? String(body.segredoNumero || "").trim() : null,

        cabmil: !!body.cabmil,
        bateria: !!body.bateria,
        bateriaQty: Number(body.bateriaQty || 0),

        gcm: !!body.gcm,
        has5g: !!body.has5g,
        observation: body.observation ? String(body.observation).trim() : null,
      },
    });

    return Response.json(created, { status: 201 });
  } catch (e) {
    return Response.json(
      { error: e?.message || "Erro ao salvar no banco." },
      { status: 500 }
    );
  }
}
