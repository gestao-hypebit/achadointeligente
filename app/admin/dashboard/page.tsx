import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const [totalArtigos, publicados, totalCliques, totalProdutos] = await Promise.all([
    prisma.artigo.count(),
    prisma.artigo.count({ where: { publicado: true } }),
    prisma.linkAfiliado.aggregate({ _sum: { cliques: true } }),
    prisma.produto.count(),
  ]);

  const stats = [
    { label: "Total de artigos", value: totalArtigos },
    { label: "Artigos publicados", value: publicados },
    { label: "Cliques de afiliado", value: totalCliques._sum.cliques ?? 0 },
    { label: "Produtos cadastrados", value: totalProdutos },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-1">{s.label}</p>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
