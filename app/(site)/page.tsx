import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CardArtigo } from "@/components/site/CardArtigo";

async function getCategorias() {
  return prisma.categoria.findMany({
    include: {
      artigos: {
        where: { publicado: true },
        orderBy: { criadoEm: "desc" },
        take: 3,
      },
      _count: { select: { artigos: { where: { publicado: true } } } },
    },
    orderBy: { criadoEm: "asc" },
  });
}

export default async function HomePage() {
  const categorias = await getCategorias();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-700 to-violet-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Encontre o seu <span className="text-amber-400">Achado Inteligente</span>
          </h1>
          <p className="text-lg text-violet-200 mb-8 max-w-xl mx-auto">
            Reviews independentes e comparativos detalhados para você comprar com segurança e confiança.
          </p>
          <form action="/busca" method="GET" className="max-w-lg mx-auto">
            <div className="flex gap-2">
              <input
                type="search"
                name="q"
                placeholder="Buscar produtos, categorias..."
                className="flex-1 px-5 py-3 rounded-xl bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-lg"
              />
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg whitespace-nowrap"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Category chips */}
      {categorias.length > 0 && (
        <section className="bg-white border-b border-slate-100 py-4 px-4">
          <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto hide-scrollbar">
            {categorias.map((cat) => (
              <Link
                key={cat.id}
                href={`/${cat.slug}`}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-violet-50 border border-slate-200 hover:border-violet-300 rounded-full text-sm text-slate-700 hover:text-violet-700 transition-all whitespace-nowrap font-medium"
              >
                {cat.icone && <span>{cat.icone}</span>}
                {cat.nome}
                <span className="text-xs text-slate-400 ml-1">({cat._count.artigos})</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Articles by category */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {categorias.map((cat) => (
          <section key={cat.id} className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              {cat.icone && (
                <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-xl shrink-0">
                  {cat.icone}
                </div>
              )}
              <div className="min-w-0">
                <h2 className="text-2xl font-bold text-slate-900">{cat.nome}</h2>
                {cat.descricao && (
                  <p className="text-sm text-slate-500 truncate">{cat.descricao}</p>
                )}
              </div>
              <Link
                href={`/${cat.slug}`}
                className="ml-auto text-sm font-medium text-violet-600 hover:text-violet-800 transition-colors whitespace-nowrap shrink-0"
              >
                Ver todos ({cat._count.artigos}) →
              </Link>
            </div>

            {cat.artigos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cat.artigos.map((artigo) => (
                  <CardArtigo
                    key={artigo.id}
                    artigo={artigo}
                    categoriaSlug={cat.slug}
                    categoriaLabel={cat.nome}
                    categoriaIcone={cat.icone}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center">
                <p className="text-slate-400 text-sm">Nenhum artigo publicado nesta categoria ainda.</p>
              </div>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
