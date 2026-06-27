import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BotaoDeletar } from "@/components/admin/BotaoDeletar";
import { deletarProduto } from "@/app/actions/deletar";

export default async function ProdutosPage() {
  const produtos = await prisma.produto.findMany({
    include: { linkAfiliado: true },
    orderBy: { criadoEm: "desc" },
  });

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Produtos</h1>
          <p className="text-sm text-slate-400 mt-0.5">{produtos.length} produto{produtos.length !== 1 ? "s" : ""} cadastrado{produtos.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Novo produto
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Produto</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Link ML</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliques</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {produtos.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    {p.imagem ? (
                      <img
                        src={p.imagem}
                        alt={p.nome}
                        className="w-10 h-10 object-contain rounded-lg bg-slate-50 border border-slate-100 p-1 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 truncate">{p.nome}</p>
                      {p.descricao && (
                        <p className="text-xs text-slate-400 truncate max-w-xs">{p.descricao}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  {p.linkAfiliado?.url ? (
                    <a
                      href={p.linkAfiliado.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full hover:bg-emerald-100 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      Link ativo
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                      Sem link
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <span className={`text-sm font-bold tabular-nums ${
                    (p.linkAfiliado?.cliques ?? 0) > 0 ? "text-violet-700" : "text-slate-300"
                  }`}>
                    {(p.linkAfiliado?.cliques ?? 0).toLocaleString("pt-BR")}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/produtos/${p.id}`}
                      className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all"
                      title="Editar"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </Link>
                    <BotaoDeletar action={deletarProduto.bind(null, p.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {produtos.length === 0 && (
          <div className="text-center py-16">
            <p className="text-3xl mb-3 opacity-20">📦</p>
            <p className="text-slate-400 text-sm mb-4">Nenhum produto cadastrado ainda.</p>
            <Link href="/admin/produtos/novo" className="text-violet-600 hover:underline text-sm font-medium">
              Cadastrar primeiro produto →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
