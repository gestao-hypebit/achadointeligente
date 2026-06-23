import { notFound } from "next/navigation";
import { FormProduto } from "@/components/admin/FormProduto";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditarProdutoPage({ params }: PageProps) {
  const { id } = await params;
  const produto = await prisma.produto.findUnique({
    where: { id: Number(id) },
    include: { linkAfiliado: true },
  });
  if (!produto) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Produto</h1>
      <FormProduto produto={produto} />
    </div>
  );
}
