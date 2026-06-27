import Link from "next/link";
import { FormArtigo } from "@/components/admin/FormArtigo";
import { prisma } from "@/lib/prisma";

export default async function NovoArtigoPage() {
  const [categorias, produtos] = await Promise.all([
    prisma.categoria.findMany({ orderBy: { nome: "asc" } }),
    prisma.produto.findMany({ include: { linkAfiliado: true }, orderBy: { nome: "asc" } }),
  ]);

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
          <Link href="/admin/artigos" className="hover:text-violet-600 transition-colors">Artigos</Link>
          <span>/</span>
          <span className="text-slate-600">Novo</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Novo artigo</h1>
      </div>
      <FormArtigo categorias={categorias} produtos={produtos} />
    </div>
  );
}
