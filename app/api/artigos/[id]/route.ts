import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

type ArtigoProdutoInput = {
  produtoId: number;
  posicao: number;
  nota?: number | null;
  destaque?: string | null;
  pros?: string | null;
  contras?: string | null;
};

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;
  const artigoId = Number(id);
  const body = await req.json();
  const { produtos: artigoProdutos, ...artigoData } = body;

  const artigo = await prisma.$transaction(async (tx) => {
    const updated = await tx.artigo.update({
      where: { id: artigoId },
      data: {
        titulo: artigoData.titulo,
        slug: artigoData.slug,
        descricao: artigoData.descricao,
        conteudo: artigoData.conteudo,
        imagemCapa: artigoData.imagemCapa || null,
        categoriaId: Number(artigoData.categoriaId),
        publicado: artigoData.publicado,
      },
    });

    await tx.artigoProduto.deleteMany({ where: { artigoId } });

    if (artigoProdutos?.length) {
      await tx.artigoProduto.createMany({
        data: artigoProdutos.map((ap: ArtigoProdutoInput) => ({
          artigoId,
          produtoId: ap.produtoId,
          posicao: ap.posicao,
          nota: ap.nota ?? null,
          destaque: ap.destaque || null,
          pros: ap.pros || null,
          contras: ap.contras || null,
        })),
      });
    }

    return updated;
  });

  return Response.json(artigo);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;
  await prisma.artigo.delete({ where: { id: Number(id) } });
  return new Response(null, { status: 204 });
}
