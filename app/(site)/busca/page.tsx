import { prisma } from "@/lib/prisma";
import { CardArtigo } from "@/components/site/CardArtigo";

type PageProps = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: PageProps) {
  const { q } = await searchParams;
  return {
    title: q ? `Busca: "${q}"` : "Buscar Produtos",
    description: `Resultados de busca para ${q ?? "produtos"}`,
  };
}

export default async function BuscaPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const termo = q?.trim() ?? "";

  const artigos = termo
    ? await prisma.artigo.findMany({
        where: {
          publicado: true,
          OR: [
            { titulo: { contains: termo, mode: "insensitive" } },
            { descricao: { contains: termo, mode: "insensitive" } },
          ],
        },
        include: { categoria: true },
        orderBy: { atualizadoEm: "desc" },
        take: 30,
      })
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Buscar Produtos</h1>
        <form action="/busca" method="GET" className="max-w-xl">
          <div className="flex gap-2">
            <input
              type="search"
              name="q"
              defaultValue={termo}
              placeholder="Buscar produtos..."
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            />
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              Buscar
            </button>
          </div>
        </form>

        {termo && (
          <p className="mt-3 text-slate-500 text-sm">
            {artigos.length > 0 ? (
              <>
                <span className="font-semibold text-slate-900">{artigos.length}</span>{" "}
                resultado{artigos.length !== 1 ? "s" : ""} para{" "}
                <span className="font-semibold text-violet-700">&quot;{termo}&quot;</span>
              </>
            ) : (
              <>
                Nenhum resultado para{" "}
                <span className="font-semibold text-violet-700">&quot;{termo}&quot;</span>
              </>
            )}
          </p>
        )}
      </div>

      {artigos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artigos.map((artigo) => (
            <CardArtigo
              key={artigo.id}
              artigo={artigo}
              categoriaSlug={artigo.categoria.slug}
              categoriaLabel={artigo.categoria.nome}
              categoriaIcone={artigo.categoria.icone}
            />
          ))}
        </div>
      ) : termo ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-slate-700 font-semibold text-lg mb-2">Nenhum resultado encontrado</p>
          <p className="text-slate-400 text-sm">Tente outras palavras-chave.</p>
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-slate-700 font-semibold text-lg mb-2">O que você está procurando?</p>
          <p className="text-slate-400 text-sm">Digite um produto ou categoria para buscar.</p>
        </div>
      )}
    </div>
  );
}
