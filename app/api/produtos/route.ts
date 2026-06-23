import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const produtos = await prisma.produto.findMany({
    include: { linkAfiliado: true },
    orderBy: { criadoEm: "desc" },
  });
  return Response.json(produtos);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const { linkAfiliado, linkUrl, ...produtoData } = body;
  const url = linkAfiliado?.url || linkUrl || null;
  const produto = await prisma.produto.create({
    data: {
      ...produtoData,
      ...(url ? { linkAfiliado: { create: { url } } } : {}),
    },
    include: { linkAfiliado: true },
  });
  return Response.json(produto, { status: 201 });
}
