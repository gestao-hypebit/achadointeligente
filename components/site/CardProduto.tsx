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
    <div className="flex items-center gap-1" aria-label={`Nota ${nota} de 10`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`text-base leading-none ${i <= estrelas ? "text-amber-400" : "text-slate-200"}`}
        >
          ★
        </span>
      ))}
      <span className="text-sm text-slate-500 ml-1.5 font-medium">{nota}/10</span>
    </div>
  );
}

export function CardProduto({ artigoProduto: ap }: Props) {
  const pros: string[] = ap.pros ? JSON.parse(ap.pros) : [];
  const contras: string[] = ap.contras ? JSON.parse(ap.contras) : [];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Destaque header */}
      {ap.destaque ? (
        <div className="bg-gradient-to-r from-violet-600 to-violet-700 px-6 py-3 flex items-center gap-3">
          <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            #{ap.posicao}
          </span>
          <span className="text-white font-semibold">{ap.destaque}</span>
        </div>
      ) : null}

      <div className="p-6">
        {/* Product info row */}
        <div className="flex items-start gap-5 mb-6">
          {ap.produto.imagem && (
            <div className="shrink-0 w-24 h-24 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
              <img
                src={ap.produto.imagem}
                alt={ap.produto.nome}
                className="max-w-full max-h-full object-contain p-2"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            {!ap.destaque && (
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                #{ap.posicao}
              </span>
            )}
            <h3 className="text-xl font-bold text-slate-900 mt-0.5 mb-2 leading-tight">
              {ap.produto.nome}
            </h3>
            {ap.nota != null && <Estrelas nota={ap.nota} />}
            {ap.produto.descricao && (
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                {ap.produto.descricao}
              </p>
            )}
          </div>
        </div>

        {/* Pros / Contras */}
        {(pros.length > 0 || contras.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {pros.length > 0 && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2.5">
                  Prós
                </p>
                <ul className="space-y-1.5">
                  {pros.map((p, i) => (
                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="text-emerald-500 font-bold shrink-0 mt-0.5">+</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {contras.length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-2.5">
                  Contras
                </p>
                <ul className="space-y-1.5">
                  {contras.map((c, i) => (
                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="text-red-400 font-bold shrink-0 mt-0.5">−</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Affiliate CTA */}
        {ap.produto.linkAfiliado && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                Disponível no Mercado Livre
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Preço atualizado ao clicar
              </p>
            </div>
            <BotaoMercadoLivre
              linkId={ap.produto.linkAfiliado.id}
              nomeProduto={ap.produto.nome}
            />
          </div>
        )}
      </div>
    </div>
  );
}
