import { FormArtigo } from "@/components/admin/FormArtigo";
import { prisma } from "@/lib/prisma";

export default async function NovoArtigoPage() {
  const [categorias, produtos] = await Promise.all([
    prisma.categoria.findMany({ orderBy: { nome: "asc" } }),
    prisma.produto.findMany({ include: { linkAfiliado: true }, orderBy: { nome: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Novo Artigo</h1>
      <FormArtigo categorias={categorias} produtos={produtos} />
    </div>
  );
}
