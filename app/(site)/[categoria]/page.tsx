import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CardArtigo } from "@/components/site/CardArtigo";

async function getCategoria(slug: string) {
  return prisma.categoria.findUnique({
    where: { slug },
    include: {
      artigos: {
        where: { publicado: true },
        orderBy: { criadoEm: "desc" },
      },
      _count: { select: { artigos: { where: { publicado: true } } } },
    },
  });
}

type PageProps = { params: Promise<{ categoria: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { categoria: slug } = await params;
  const cat = await getCategoria(slug);
  if (!cat) return {};
  return {
    title: cat.nome,
    description: cat.descricao ?? `Análises e comparativos de ${cat.nome}`,
  };
}

export default async function CategoriaPage({ params }: PageProps) {
  const { categoria: slug } = await params;
  const cat = await getCategoria(slug);
  if (!cat) notFound();

  return (
    <>
      {/* Category banner */}
      <section className="bg-gradient-to-br from-violet-700 to-violet-900 text-white py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="text-violet-300 hover:text-white text-sm mb-4 inline-flex items-center gap-1 transition-colors"
          >
            ← Voltar ao início
          </Link>
          <div className="flex items-center gap-4 mt-2">
            {cat.icone && (
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-4xl backdrop-blur-sm shrink-0">
                {cat.icone}
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{cat.nome}</h1>
              {cat.descricao && (
                <p className="text-violet-200 mt-1">{cat.descricao}</p>
              )}
              <p className="text-violet-300 text-sm mt-2">
                {cat._count.artigos} {cat._count.artigos === 1 ? "artigo" : "artigos"} publicados
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {cat.artigos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cat.artigos.map((artigo) => (
              <CardArtigo
                key={artigo.id}
                artigo={artigo}
                categoriaSlug={cat.slug}
                categoriaIcone={cat.icone}
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-16 text-center">
            <span className="text-5xl mb-4 block opacity-30">{cat.icone ?? "📦"}</span>
            <p className="text-slate-500 mb-4">Nenhum artigo publicado nesta categoria ainda.</p>
            <Link href="/" className="text-violet-600 hover:underline text-sm inline-block">
              ← Voltar ao início
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
