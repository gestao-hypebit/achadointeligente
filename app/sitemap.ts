import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const artigos = await prisma.artigo.findMany({
    where: { publicado: true },
    select: { slug: true, atualizadoEm: true, categoria: { select: { slug: true } } },
  });

  const categorias = await prisma.categoria.findMany({ select: { slug: true, criadoEm: true } });

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...categorias.map((c) => ({
      url: `${BASE_URL}/${c.slug}`,
      lastModified: c.criadoEm,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...artigos.map((a) => ({
      url: `${BASE_URL}/${a.categoria.slug}/${a.slug}`,
      lastModified: a.atualizadoEm,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
