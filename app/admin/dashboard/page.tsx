import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const [totalArtigos, publicados, totalCliquesAgg, totalProdutos, topProdutos, topArtigos] =
    await Promise.all([
      prisma.artigo.count(),
      prisma.artigo.count({ where: { publicado: true } }),
      prisma.linkAfiliado.aggregate({ _sum: { cliques: true } }),
      prisma.produto.count(),
      prisma.linkAfiliado.findMany({
        orderBy: { cliques: "desc" },
        take: 5,
        where: { cliques: { gt: 0 } },
        include: { produto: { select: { nome: true } } },
      }),
      prisma.artigo.findMany({
        where: { publicado: true },
        orderBy: { atualizadoEm: "desc" },
        take: 5,
        select: {
          id: true,
          titulo: true,
          slug: true,
          atualizadoEm: true,
          categoria: { select: { slug: true } },
        },
      }),
    ]);

  const stats = [
    { label: "Total de artigos", value: totalArtigos },
    { label: "Artigos publicados", value: publicados },
    { label: "Cliques de afiliado", value: totalCliquesAgg._sum.cliques ?? 0 },
    { label: "Produtos cadastrados", value: totalProdutos },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-1">{s.label}</p>
            <p className="text-3xl font-bold text-gray-900">{s.value.toLocaleString("pt-BR")}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top produtos por cliques */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Top produtos por cliques</h2>
          {topProdutos.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhum clique registrado ainda.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left pb-2 font-medium text-gray-500">#</th>
                  <th className="text-left pb-2 font-medium text-gray-500">Produto</th>
                  <th className="text-right pb-2 font-medium text-gray-500">Cliques</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topProdutos.map((link, i) => (
                  <tr key={link.id}>
                    <td className="py-2.5 text-gray-400 font-bold w-8">{i + 1}</td>
                    <td className="py-2.5 text-gray-900 font-medium">{link.produto.nome}</td>
                    <td className="py-2.5 text-right font-bold text-violet-700">
                      {link.cliques.toLocaleString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Artigos mais recentes */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Artigos publicados recentemente</h2>
          {topArtigos.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhum artigo publicado ainda.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {topArtigos.map((a) => (
                <li key={a.id} className="py-2.5 flex items-center justify-between gap-2">
                  <a
                    href={`/${a.categoria.slug}/${a.slug}`}
                    target="_blank"
                    className="text-sm text-gray-900 hover:text-violet-700 font-medium truncate flex-1"
                  >
                    {a.titulo}
                  </a>
                  <span className="text-xs text-gray-400 shrink-0">
                    {new Date(a.atualizadoEm).toLocaleDateString("pt-BR")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
