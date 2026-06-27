import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const categoria = await prisma.categoria.update({
    where: { id: Number(id) },
    data: {
      nome: body.nome,
      slug: body.slug,
      icone: body.icone || null,
      descricao: body.descricao || null,
    },
  });

  return Response.json(categoria);
}
