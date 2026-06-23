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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Novo produto
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Produto</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Link ML</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Cliques</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {produtos.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{p.nome}</td>
                <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                  {p.linkAfiliado?.url ?? (
                    <span className="text-gray-400 italic">Sem link</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">{p.linkAfiliado?.cliques ?? 0}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/produtos/${p.id}`}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Editar
                    </Link>
                    <BotaoDeletar action={deletarProduto.bind(null, p.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {produtos.length === 0 && (
          <p className="text-center text-gray-500 py-8">Nenhum produto cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
}
