import Link from "next/link";
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
        categoria: true,
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
            <Link href="/admin/artigos" className="hover:text-violet-600 transition-colors">Artigos</Link>
            <span>/</span>
            <span className="text-slate-600">Editar</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Editar artigo</h1>
        </div>
        {artigo.publicado && (
          <a
            href={`/${artigo.categoria.slug}/${artigo.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 bg-white border border-slate-200 hover:border-violet-200 px-4 py-2 rounded-lg transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Ver no site
          </a>
        )}
      </div>
      <FormArtigo artigo={artigo} categorias={categorias} produtos={produtos} />
    </div>
  );
}
