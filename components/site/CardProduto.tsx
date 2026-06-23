import { BotaoMercadoLivre } from "./BotaoMercadoLivre";

type ArtigoProdutoCompleto = {
  id: number;
  posicao: number;
  nota?: number | null;
  destaque?: string | null;
  pros?: string | null;
  contras?: string | null;
  produto: {
    id: number;
    nome: string;
    descricao?: string | null;
    imagem?: string | null;
    linkAfiliado?: { id: number } | null;
  };
};

interface Props {
  artigoProduto: ArtigoProdutoCompleto;
}

function Estrelas({ nota }: { nota: number }) {
  const estrelas = Math.round(nota / 2);
  return (
    <div className="flex items-center gap-0.5" aria-label={`Nota ${nota} de 10`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`text-lg leading-none ${i <= estrelas ? "text-amber-400" : "text-slate-200"}`}>
          ★
        </span>
      ))}
      <span className="text-sm text-slate-500 ml-2">{nota}/10</span>
    </div>
  );
}

export function CardProduto({ artigoProduto: ap }: Props) {
  const pros: string[] = ap.pros ? JSON.parse(ap.pros) : [];
  const contras: string[] = ap.contras ? JSON.parse(ap.contras) : [];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {ap.destaque && (
        <div className="bg-gradient-to-r from-violet-600 to-violet-700 px-6 py-2.5 flex items-center gap-3">
          <span className="text-violet-300 text-xs font-bold uppercase tracking-wide">#{ap.posicao}</span>
          <span className="text-white font-semibold text-sm">{ap.destaque}</span>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start gap-5 mb-5">
          <div className="flex-1 min-w-0">
            {!ap.destaque && (
              <span className="text-xs font-semibold text-slate-400 uppercase">#{ap.posicao}</span>
            )}
            <h3 className="text-xl font-bold text-slate-900 mt-0.5 mb-2 leading-tight">
              {ap.produto.nome}
            </h3>
            {ap.nota != null && <Estrelas nota={ap.nota} />}
            {ap.produto.descricao && (
              <p className="text-sm text-slate-600 mt-2">{ap.produto.descricao}</p>
            )}
          </div>
        </div>

        {(pros.length > 0 || contras.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 bg-slate-50 rounded-xl p-4">
            {pros.length > 0 && (
              <div>
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">✅ Prós</p>
                <ul className="space-y-1.5">
                  {pros.map((p, i) => (
                    <li key={i} className="text-sm text-slate-700 flex items-start gap-1.5">
                      <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {contras.length > 0 && (
              <div>
                <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-2">❌ Contras</p>
                <ul className="space-y-1.5">
                  {contras.map((c, i) => (
                    <li key={i} className="text-sm text-slate-700 flex items-start gap-1.5">
                      <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {ap.produto.linkAfiliado && (
          <div className="mt-2 bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col items-center gap-4">
            {ap.produto.imagem && (
              <div className="w-40 h-40 flex items-center justify-center">
                <img
                  src={ap.produto.imagem}
                  alt={ap.produto.nome}
                  className="max-w-full max-h-full object-contain drop-shadow-sm"
                />
              </div>
            )}
            <div className="text-center">
              <p className="text-xs text-slate-400 mb-3">Clique para ver o preço atual</p>
              <BotaoMercadoLivre
                linkId={ap.produto.linkAfiliado.id}
                nomeProduto={ap.produto.nome}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
