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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const artigoUrl = `${siteUrl}/${artigo.categoria.slug}/${artigo.slug}`;

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: artigo.titulo,
    description: artigo.descricao,
    image: artigo.imagemCapa ? [artigo.imagemCapa] : undefined,
    datePublished: artigo.criadoEm,
    dateModified: artigo.atualizadoEm,
    url: artigoUrl,
    publisher: {
      "@type": "Organization",
      name: "Achado Inteligente",
      url: siteUrl,
    },
    author: {
      "@type": "Organization",
      name: "Achado Inteligente",
    },
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: siteUrl },
      { "@type": "ListItem", position: 2, name: artigo.categoria.nome, item: `${siteUrl}/${artigo.categoria.slug}` },
      { "@type": "ListItem", position: 3, name: artigo.titulo, item: artigoUrl },
    ],
  };

  const jsonLdItemList = artigo.produtos.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: artigo.titulo,
    itemListElement: artigo.produtos.map((ap, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: ap.produto.nome,
      url: ap.produto.linkAfiliado ? `${siteUrl}/api/redirect/${ap.produto.linkAfiliado.id}` : undefined,
    })),
  } : null;

  const jsonLdProducts = artigo.produtos
    .filter((ap) => ap.nota != null || ap.precoAproximado != null)
    .map((ap) => ({
      "@context": "https://schema.org",
      "@type": "Product",
      name: ap.produto.nome,
      description: ap.produto.descricao ?? undefined,
      image: ap.produto.imagem ?? undefined,
      ...(ap.nota != null && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: ap.nota,
          bestRating: 10,
          worstRating: 0,
          ratingCount: 1,
        },
      }),
      ...(ap.precoAproximado != null && ap.produto.linkAfiliado && {
        offers: {
          "@type": "Offer",
          price: ap.precoAproximado,
          priceCurrency: "BRL",
          availability: "https://schema.org/InStock",
          url: `${siteUrl}/api/redirect/${ap.produto.linkAfiliado.id}`,
        },
      }),
    }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      {jsonLdItemList && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }}
        />
      )}
      {jsonLdProducts.map((p, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(p) }}
        />
      ))}

      <Breadcrumb
        items={[
          { label: artigo.categoria.nome, href: `/${artigo.categoria.slug}` },
          { label: artigo.titulo },
        ]}
      />

      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-4 mb-3 leading-tight tracking-tight">
        {artigo.titulo}
      </h1>

      <div className="flex items-center gap-3 mb-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 border border-violet-100 px-3 py-1 rounded-full">
          {artigo.categoria.icone && <span>{artigo.categoria.icone}</span>}
          {artigo.categoria.nome}
        </span>
        <span className="text-xs text-slate-400">
          Atualizado em{" "}
          {new Date(artigo.atualizadoEm).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      {artigo.produtos.length > 0 && (
        <TabelaComparativa produtos={artigo.produtos} />
      )}

      <div
        className="prose prose-slate max-w-none my-8 prose-headings:text-slate-900 prose-headings:font-bold prose-headings:tracking-tight prose-a:text-violet-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-2"
        dangerouslySetInnerHTML={{ __html: artigo.conteudo }}
      />

      {artigo.produtos.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100 tracking-tight">
            Análises Completas
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
