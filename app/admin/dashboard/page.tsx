import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const [totalArtigos, publicados, rascunhos, totalCliquesAgg, totalProdutos, topProdutos, topArtigos] =
    await Promise.all([
      prisma.artigo.count(),
      prisma.artigo.count({ where: { publicado: true } }),
      prisma.artigo.count({ where: { publicado: false } }),
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

  const totalCliques = totalCliquesAgg._sum.cliques ?? 0;

  const stats = [
    {
      label: "Artigos publicados",
      value: publicados,
      sub: rascunhos > 0 ? `${rascunhos} rascunho${rascunhos > 1 ? "s" : ""}` : "Todos publicados",
      color: "text-violet-600",
      bg: "bg-violet-50",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      label: "Total de artigos",
      value: totalArtigos,
      sub: "incluindo rascunhos",
      color: "text-slate-600",
      bg: "bg-slate-50",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      ),
    },
    {
      label: "Cliques de afiliado",
      value: totalCliques.toLocaleString("pt-BR"),
      sub: "cliques no Mercado Livre",
      color: "text-amber-600",
      bg: "bg-amber-50",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
    },
    {
      label: "Produtos cadastrados",
      value: totalProdutos,
      sub: "no banco de dados",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header + quick actions */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">Visão geral do site</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link
            href="/admin/artigos/novo"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Novo artigo
          </Link>
          <Link
            href="/admin/produtos/novo"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold px-4 py-2 rounded-lg border border-slate-200 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Novo produto
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-100 p-5 flex items-start gap-4">
            <div className={`${s.bg} ${s.color} p-2.5 rounded-lg shrink-0`}>
              {s.icon}
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-slate-900 leading-none mb-1">{s.value}</p>
              <p className="text-xs font-medium text-slate-500 leading-snug">{s.label}</p>
              <p className="text-xs text-slate-300 mt-0.5 truncate">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top produtos por cliques */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900">Top produtos por cliques</h2>
            <Link href="/admin/produtos" className="text-xs text-violet-600 hover:underline font-medium">
              Ver todos →
            </Link>
          </div>
          {topProdutos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-2 opacity-20">👆</p>
              <p className="text-sm text-slate-400">Nenhum clique registrado ainda.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {topProdutos.map((link, i) => {
                const max = topProdutos[0].cliques || 1;
                const pct = Math.round((link.cliques / max) * 100);
                return (
                  <div key={link.id} className="flex items-center gap-3 py-2">
                    <span className="text-xs font-bold text-slate-300 w-4 text-right shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{link.produto.nome}</p>
                      <div className="h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-violet-400 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-violet-700 shrink-0 tabular-nums">
                      {link.cliques.toLocaleString("pt-BR")}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Artigos recentes */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900">Artigos publicados recentemente</h2>
            <Link href="/admin/artigos" className="text-xs text-violet-600 hover:underline font-medium">
              Ver todos →
            </Link>
          </div>
          {topArtigos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-2 opacity-20">📄</p>
              <p className="text-sm text-slate-400">Nenhum artigo publicado ainda.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-50">
              {topArtigos.map((a) => (
                <li key={a.id} className="py-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-800 truncate flex-1">{a.titulo}</p>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-slate-300">
                      {new Date(a.atualizadoEm).toLocaleDateString("pt-BR")}
                    </span>
                    <a
                      href={`/${a.categoria.slug}/${a.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:text-violet-600 transition-colors"
                      title="Ver no site"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
