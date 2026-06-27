import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BotaoDeletar } from "@/components/admin/BotaoDeletar";
import { deletarArtigo } from "@/app/actions/deletar";

export default async function ArtigosPage() {
  const artigos = await prisma.artigo.findMany({
    include: { categoria: true },
    orderBy: { criadoEm: "desc" },
  });

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Artigos</h1>
          <p className="text-sm text-slate-400 mt-0.5">{artigos.length} artigo{artigos.length !== 1 ? "s" : ""} no total</p>
        </div>
        <Link
          href="/admin/artigos/novo"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Novo artigo
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Título</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Categoria</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {artigos.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3.5 font-medium text-slate-800 max-w-xs">
                  <p className="truncate">{a.titulo}</p>
                </td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {a.categoria.icone && <span>{a.categoria.icone}</span>}
                    {a.categoria.nome}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    a.publicado
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-amber-50 text-amber-700 border border-amber-100"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${a.publicado ? "bg-emerald-500" : "bg-amber-400"}`} />
                    {a.publicado ? "Publicado" : "Rascunho"}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-400">
                  {new Date(a.criadoEm).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    {a.publicado && (
                      <a
                        href={`/${a.categoria.slug}/${a.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-300 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all"
                        title="Ver no site"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    )}
                    <Link
                      href={`/admin/artigos/${a.id}`}
                      className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all"
                      title="Editar"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </Link>
                    <BotaoDeletar action={deletarArtigo.bind(null, a.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {artigos.length === 0 && (
          <div className="text-center py-16">
            <p className="text-3xl mb-3 opacity-20">📄</p>
            <p className="text-slate-400 text-sm mb-4">Nenhum artigo criado ainda.</p>
            <Link href="/admin/artigos/novo" className="text-violet-600 hover:underline text-sm font-medium">
              Criar primeiro artigo →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
