import { notFound } from "next/navigation";
import { FormArtigo } from "@/components/admin/FormArtigo";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditarArtigoPage({ params }: PageProps) {
  const { id } = await params;
  const [artigo, categorias, produtos] = await Promise.all([
    prisma.artigo.findUnique({
      where: { id: Number(id) },
      include: {
        produtos: {
          include: { produto: { include: { linkAfiliado: true } } },
          orderBy: { posicao: "asc" },
        },
      },
    }),
    prisma.categoria.findMany({ orderBy: { nome: "asc" } }),
    prisma.produto.findMany({ include: { linkAfiliado: true }, orderBy: { nome: "asc" } }),
  ]);

  if (!artigo) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Artigo</h1>
      <FormArtigo artigo={artigo} categorias={categorias} produtos={produtos} />
    </div>
  );
}
