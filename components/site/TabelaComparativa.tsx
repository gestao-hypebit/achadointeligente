import { BotaoMercadoLivre } from "./BotaoMercadoLivre";

type ArtigoProdutoCompleto = {
  id: number;
  posicao: number;
  nota?: number | null;
  destaque?: string | null;
  produto: {
    id: number;
    nome: string;
    linkAfiliado?: { id: number } | null;
  };
};

interface Props {
  produtos: ArtigoProdutoCompleto[];
}

export function TabelaComparativa({ produtos }: Props) {
  const temNota = produtos.some((p) => p.nota != null);

  return (
    <div className="my-8 overflow-x-auto rounded-2xl border border-violet-200 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-violet-600 to-violet-700 text-white">
            <th className="text-left px-4 py-3 font-semibold">#</th>
            <th className="text-left px-4 py-3 font-semibold">Produto</th>
            <th className="text-left px-4 py-3 font-semibold">Destaque</th>
            {temNota && <th className="text-left px-4 py-3 font-semibold">Nota</th>}
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {produtos.map((ap, idx) => (
            <tr key={ap.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
              <td className="px-4 py-3 font-bold text-violet-400">{ap.posicao}</td>
              <td className="px-4 py-3 font-medium text-slate-900">{ap.produto.nome}</td>
              <td className="px-4 py-3">
                {ap.destaque ? (
                  <span className="text-xs bg-violet-100 text-violet-700 font-semibold px-2 py-1 rounded-full">
                    {ap.destaque}
                  </span>
                ) : (
                  <span className="text-slate-300">—</span>
                )}
              </td>
              {temNota && (
                <td className="px-4 py-3">
                  {ap.nota != null && (
                    <span className="font-bold text-emerald-600">{ap.nota}/10</span>
                  )}
                </td>
              )}
              <td className="px-4 py-3 text-right">
                {ap.produto.linkAfiliado && (
                  <BotaoMercadoLivre
                    linkId={ap.produto.linkAfiliado.id}
                    nomeProduto={ap.produto.nome}
                    variante="compacto"
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
