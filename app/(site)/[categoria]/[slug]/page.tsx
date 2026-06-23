import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TabelaComparativa } from "@/components/site/TabelaComparativa";
import { CardProduto } from "@/components/site/CardProduto";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { CardArtigo } from "@/components/site/CardArtigo";

async function getArtigo(slug: string) {
  return prisma.artigo.findUnique({
    where: { slug, publicado: true },
    include: {
      categoria: true,
      produtos: {
        include: { produto: { include: { linkAfiliado: true } } },
        orderBy: { posicao: "asc" },
      },
    },
  });
}

async function getRelacionados(categoriaId: number, artigoId: number) {
  return prisma.artigo.findMany({
    where: { publicado: true, categoriaId, NOT: { id: artigoId } },
    take: 3,
    orderBy: { criadoEm: "desc" },
    select: { id: true, titulo: true, slug: true, descricao: true, imagemCapa: true },
  });
}

type PageProps = { params: Promise<{ categoria: string; slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const artigo = await getArtigo(slug);
  if (!artigo) return {};
  return {
    title: artigo.titulo,
    description: artigo.descricao,
    openGraph: {
      title: artigo.titulo,
      description: artigo.descricao,
      images: artigo.imagemCapa ? [artigo.imagemCapa] : [],
    },
  };
}

export default async function ArtigoPage({ params }: PageProps) {
  const { categoria, slug } = await params;
  const artigo = await getArtigo(slug);
  if (!artigo || artigo.categoria.slug !== categoria) notFound();

  const relacionados = await getRelacionados(artigo.categoriaId, artigo.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: artigo.titulo,
    itemListElement: artigo.produtos.map((ap, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: ap.produto.nome,
    })),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb
        items={[
          { label: artigo.categoria.nome, href: `/${artigo.categoria.slug}` },
          { label: artigo.titulo },
        ]}
      />

      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-4 mb-2 leading-tight">
        {artigo.titulo}
      </h1>

      <p className="text-sm text-slate-400 mb-6">
        Atualizado em{" "}
        {new Date(artigo.atualizadoEm).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </p>

      {artigo.produtos.length > 0 && (
        <TabelaComparativa produtos={artigo.produtos} />
      )}

      <div
        className="prose prose-slate max-w-none my-8 prose-headings:text-slate-900 prose-a:text-violet-600 prose-a:no-underline hover:prose-a:underline"
        dangerouslySetInnerHTML={{ __html: artigo.conteudo }}
      />

      {artigo.produtos.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-200">
            Reviews Completos
          </h2>
          <div className="space-y-8">
            {artigo.produtos.map((ap) => (
              <CardProduto key={ap.id} artigoProduto={ap} />
            ))}
          </div>
        </section>
      )}

      {relacionados.length > 0 && (
        <section className="mt-16 pt-10 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Artigos Relacionados em{" "}
            <Link href={`/${artigo.categoria.slug}`} className="text-violet-600 hover:underline">
              {artigo.categoria.nome}
            </Link>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relacionados.map((rel) => (
              <CardArtigo
                key={rel.id}
                artigo={rel}
                categoriaSlug={artigo.categoria.slug}
                categoriaIcone={artigo.categoria.icone}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
