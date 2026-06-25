import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const artigos = await prisma.artigo.findMany({
    include: { categoria: true },
    orderBy: { criadoEm: "desc" },
  });
  return Response.json(artigos);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const { produtos: artigoProdutos, ...artigoData } = body;

  const artigo = await prisma.artigo.create({
    data: {
      ...artigoData,
      produtos: artigoProdutos?.length
        ? {
            create: artigoProdutos.map((ap: ArtigoProdutoInput) => ({
              produtoId: ap.produtoId,
              posicao: ap.posicao,
              nota: ap.nota ?? null,
              destaque: ap.destaque || null,
              pros: ap.pros || null,
              contras: ap.contras || null,
              precoAproximado: ap.precoAproximado ?? null,
            })),
          }
        : undefined,
    },
  });

  return Response.json(artigo, { status: 201 });
}

type ArtigoProdutoInput = {
  produtoId: number;
  posicao: number;
  nota?: number | null;
  destaque?: string | null;
  pros?: string | null;
  contras?: string | null;
  precoAproximado?: number | null;
};
