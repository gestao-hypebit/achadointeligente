import { BotaoMercadoLivre } from "./BotaoMercadoLivre";

type ArtigoProdutoCompleto = {
  id: number;
  posicao: number;
  nota?: number | null;
  destaque?: string | null;
  precoAproximado?: number | null;
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
  const temPreco = produtos.some((p) => p.precoAproximado != null);

  return (
    <div className="my-8 overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-violet-950 text-white">
            <th className="text-left px-5 py-3.5 font-semibold text-violet-300 w-12">#</th>
            <th className="text-left px-4 py-3.5 font-semibold">Produto</th>
            <th className="text-left px-4 py-3.5 font-semibold hidden sm:table-cell">Destaque</th>
            {temNota && (
              <th className="text-left px-4 py-3.5 font-semibold hidden sm:table-cell">Nota</th>
            )}
            {temPreco && (
              <th className="text-left px-4 py-3.5 font-semibold hidden md:table-cell">Preço</th>
            )}
            <th className="px-4 py-3.5 w-36"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {produtos.map((ap, idx) => (
            <tr
              key={ap.id}
              className={`transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"} hover:bg-violet-50/40`}
            >
              <td className="px-5 py-3.5">
                <span className="text-sm font-bold text-slate-400">#{ap.posicao}</span>
              </td>
              <td className="px-4 py-3.5 font-semibold text-slate-900">{ap.produto.nome}</td>
              <td className="px-4 py-3.5 hidden sm:table-cell">
                {ap.destaque ? (
                  <span className="text-xs bg-violet-50 text-violet-700 font-bold px-2.5 py-1 rounded-full border border-violet-100">
                    {ap.destaque}
                  </span>
                ) : (
                  <span className="text-slate-300">—</span>
                )}
              </td>
              {temNota && (
                <td className="px-4 py-3.5 hidden sm:table-cell">
                  {ap.nota != null ? (
                    <span className="font-bold text-emerald-600">{ap.nota}/10</span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
              )}
              {temPreco && (
                <td className="px-4 py-3.5 hidden md:table-cell">
                  {ap.precoAproximado != null ? (
                    <span className="font-semibold text-slate-700">
                      {ap.precoAproximado.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
              )}
              <td className="px-4 py-3.5 text-right">
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
