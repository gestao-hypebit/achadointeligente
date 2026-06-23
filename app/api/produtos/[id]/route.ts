import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const produtoId = Number(id);

  const produto = await prisma.$transaction(async (tx) => {
    const p = await tx.produto.update({
      where: { id: produtoId },
      data: {
        nome: body.nome,
        descricao: body.descricao || null,
        imagem: body.imagem || null,
      },
    });

    if (body.linkUrl) {
      await tx.linkAfiliado.upsert({
        where: { produtoId },
        create: { produtoId, url: body.linkUrl },
        update: { url: body.linkUrl },
      });
    }

    return p;
  });

  return Response.json(produto);
}
