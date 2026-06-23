import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const categorias = await prisma.categoria.findMany({ orderBy: { nome: "asc" } });
  return Response.json(categorias);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const categoria = await prisma.categoria.create({ data: body });
  return Response.json(categoria, { status: 201 });
}
