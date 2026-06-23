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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Artigos</h1>
        <Link
          href="/admin/artigos/novo"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Novo artigo
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Título</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Categoria</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Data</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {artigos.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{a.titulo}</td>
                <td className="px-4 py-3 text-gray-600">{a.categoria.nome}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      a.publicado
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {a.publicado ? "Publicado" : "Rascunho"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(a.criadoEm).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/artigos/${a.id}`}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Editar
                    </Link>
                    <BotaoDeletar action={deletarArtigo.bind(null, a.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {artigos.length === 0 && (
          <p className="text-center text-gray-500 py-8">Nenhum artigo criado ainda.</p>
        )}
      </div>
    </div>
  );
}
