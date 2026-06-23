"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function verificarAuth() {
  const session = await auth();
  if (!session) throw new Error("Não autorizado");
}

export async function deletarArtigo(id: number) {
  await verificarAuth();
  await prisma.artigo.delete({ where: { id } });
  revalidatePath("/admin/artigos");
}

export async function deletarProduto(id: number) {
  await verificarAuth();
  await prisma.$transaction([
    prisma.artigoProduto.deleteMany({ where: { produtoId: id } }),
    prisma.linkAfiliado.deleteMany({ where: { produtoId: id } }),
    prisma.produto.delete({ where: { id } }),
  ]);
  revalidatePath("/admin/produtos");
}

export async function deletarCategoria(id: number) {
  await verificarAuth();
  const count = await prisma.artigo.count({ where: { categoriaId: id } });
  if (count > 0) {
    throw new Error(`Não é possível excluir: esta categoria possui ${count} artigo(s). Remova os artigos primeiro.`);
  }
  await prisma.categoria.delete({ where: { id } });
  revalidatePath("/admin/categorias");
}
