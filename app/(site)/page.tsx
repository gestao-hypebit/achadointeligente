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
  const totalArtigos = categorias.reduce((acc, c) => acc + c._count.artigos, 0);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-violet-950 text-white py-24 px-4 overflow-hidden">
        {/* Radial spotlight */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139,92,246,0.45), transparent)",
          }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(167,139,250,0.8) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          {/* Editorial eyebrow */}
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400/80 mb-6">
            Análises independentes · Guia de compras
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-[1.08] tracking-tight">
            Encontre o seu{" "}
            <span className="text-amber-400 relative">
              Achado Inteligente
            </span>
          </h1>
          <p className="text-base text-violet-300/90 mb-10 max-w-xl mx-auto leading-relaxed">
            Comparativos honestos e análises detalhadas para você comprar
            com segurança — sem arrependimento.
          </p>

          <form action="/busca" method="GET" className="max-w-lg mx-auto mb-12">
            <div className="flex gap-2 bg-white/10 border border-white/20 rounded-2xl p-1.5 backdrop-blur-sm">
              <input
                type="search"
                name="q"
                placeholder="Buscar produtos, categorias..."
                className="flex-1 px-4 py-2.5 bg-white text-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-6 py-2.5 rounded-xl transition-colors text-sm whitespace-nowrap"
              >
                Buscar
              </button>
            </div>
          </form>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-violet-400/70">
            <span>
              {totalArtigos > 0
                ? `${totalArtigos}+ análises publicadas`
                : "Análises em crescimento"}
            </span>
            <span className="hidden sm:inline text-violet-800">·</span>
            <span>{categorias.length} categorias</span>
            <span className="hidden sm:inline text-violet-800">·</span>
            <span>Atualizado semanalmente</span>
          </div>
        </div>
      </section>

      {/* Category chips */}
      {categorias.length > 0 && (
        <section className="bg-white border-b border-slate-200/80 py-3 px-4">
          <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto hide-scrollbar">
            {categorias.map((cat) => (
              <Link
                key={cat.id}
                href={`/${cat.slug}`}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-violet-600 hover:text-white border border-slate-200 hover:border-violet-600 rounded-full text-sm text-slate-700 transition-all whitespace-nowrap font-medium"
              >
                {cat.icone && <span>{cat.icone}</span>}
                {cat.nome}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Articles by category */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {categorias.map((cat, idx) => (
          <section
            key={cat.id}
            className={idx > 0 ? "mt-20 pt-16 border-t border-slate-200/70" : ""}
          >
            {/* Section header */}
            <div className="flex items-center justify-between mb-7">
              <div className="flex items-center gap-3">
                {cat.icone && (
                  <span className="text-3xl leading-none">{cat.icone}</span>
                )}
                <div>
                  <h2 className="text-xl font-bold text-slate-900 leading-tight tracking-tight">
                    {cat.nome}
                  </h2>
                  {cat.descricao && (
                    <p className="text-sm text-slate-400 mt-0.5">{cat.descricao}</p>
                  )}
                </div>
              </div>
              <Link
                href={`/${cat.slug}`}
                className="shrink-0 text-sm font-semibold text-violet-600 hover:text-violet-900 bg-violet-50 hover:bg-violet-100 px-4 py-2 rounded-full transition-colors border border-violet-100"
              >
                Ver todos ({cat._count.artigos})
              </Link>
            </div>

            {cat.artigos.length > 0 ? (
              /* Editorial grid: featured card (2/3) + stacked smaller cards (1/3) */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
                <div className={cat.artigos.length > 1 ? "lg:col-span-2 flex flex-col" : "lg:col-span-3"}>
                  <CardArtigo
                    artigo={cat.artigos[0]}
                    categoriaSlug={cat.slug}
                    categoriaLabel={cat.nome}
                    categoriaIcone={cat.icone}
                    featured
                  />
                </div>

                {cat.artigos.length > 1 && (
                  <div className="flex flex-col gap-5">
                    {cat.artigos.slice(1).map((artigo) => (
                      <CardArtigo
                        key={artigo.id}
                        artigo={artigo}
                        categoriaSlug={cat.slug}
                        categoriaLabel={cat.nome}
                        categoriaIcone={cat.icone}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center">
                <span className="text-3xl opacity-25 block mb-2">{cat.icone ?? "📦"}</span>
                <p className="text-slate-400 text-sm">
                  Nenhum artigo publicado nesta categoria ainda.
                </p>
              </div>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
