import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function GET(_req: Request, ctx: RouteContext<"/api/redirect/[id]">) {
  const { id } = await ctx.params;

  const link = await prisma.linkAfiliado.findUnique({
    where: { id: Number(id) },
  });

  if (!link) return new Response("Not found", { status: 404 });

  await prisma.linkAfiliado.update({
    where: { id: link.id },
    data: { cliques: { increment: 1 } },
  });

  redirect(link.url);
}
