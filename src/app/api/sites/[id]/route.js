export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma/prisma";

// GET /api/sites/:id
export async function GET(req, ctx) {
  const { id } = await ctx.params; // ✅ aqui

  if (!id) {
    return NextResponse.json({ error: "ID ausente na rota" }, { status: 400 });
  }

  const site = await prisma.site.findUnique({
    where: { id }, // id é string (cuid)
  });

  if (!site) {
    return NextResponse.json({ error: "Site não encontrado" }, { status: 404 });
  }

  return NextResponse.json(site);
}

// PUT /api/sites/:id
export async function PUT(req, ctx) {
  const { id } = await ctx.params; // ✅ aqui
  const body = await req.json();

  if (!id) {
    return NextResponse.json({ error: "ID ausente na rota" }, { status: 400 });
  }

  const updated = await prisma.site.update({
    where: { id },
    data: {
      code: body.code,
      name: body.name,
      address: body.address,
      tipo: body.tipo,
      energia: body.energia,
      metodoAcesso: body.metodoAcesso,
      segredoNumero: body.segredoNumero || null,
      ntpCode: body.ntpCode || null,
      cabmil: !!body.cabmil,
      bateria: !!body.bateria,
      bateriaQty: Number(body.bateriaQty || 0),
      gcm: !!body.gcm,
      has5g: !!body.has5g,
      relogioNumero: body.relogioNumero || null,
      observation: body.observation || null,
    },
  });

  return NextResponse.json(updated);
}
