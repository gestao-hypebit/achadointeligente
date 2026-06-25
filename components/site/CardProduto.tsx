import { BotaoMercadoLivre } from "./BotaoMercadoLivre";

type ArtigoProdutoCompleto = {
  id: number;
  posicao: number;
  nota?: number | null;
  destaque?: string | null;
  pros?: string | null;
  contras?: string | null;
  precoAproximado?: number | null;
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

const positionConfig: Record<number, {
  bar: string;
  headerBg: string;
  badgeBg: string;
  badgeText: string;
  medal: string;
}> = {
  1: {
    bar: "#F59E0B",
    headerBg: "bg-gradient-to-r from-amber-400 to-amber-500",
    badgeBg: "bg-amber-600/25",
    badgeText: "text-amber-950",
    medal: "🥇",
  },
  2: {
    bar: "#7C3AED",
    headerBg: "bg-gradient-to-r from-violet-600 to-violet-700",
    badgeBg: "bg-white/20",
    badgeText: "text-white",
    medal: "🥈",
  },
  3: {
    bar: "#64748B",
    headerBg: "bg-gradient-to-r from-slate-500 to-slate-600",
    badgeBg: "bg-white/20",
    badgeText: "text-white",
    medal: "🥉",
  },
};

const defaultConfig = {
  bar: "#E2E8F0",
  headerBg: "bg-gradient-to-r from-violet-600 to-violet-700",
  badgeBg: "bg-white/20",
  badgeText: "text-white",
  medal: "",
};

function Estrelas({ nota }: { nota: number }) {
  const estrelas = Math.round(nota / 2);
  return (
    <div className="flex items-center gap-0.5" aria-label={`Nota ${nota} de 10`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`text-base leading-none ${i <= estrelas ? "text-amber-400" : "text-slate-200"}`}
        >
          ★
        </span>
      ))}
      <span className="text-sm text-slate-500 ml-2 font-semibold">{nota}/10</span>
    </div>
  );
}

export function CardProduto({ artigoProduto: ap }: Props) {
  const pros: string[] = ap.pros ? JSON.parse(ap.pros) : [];
  const contras: string[] = ap.contras ? JSON.parse(ap.contras) : [];
  const cfg = positionConfig[ap.posicao] ?? defaultConfig;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Position accent bar */}
      <div className="h-[3px] w-full" style={{ background: cfg.bar }} />

      {/* Destaque header */}
      {ap.destaque && (
        <div className={`${cfg.headerBg} px-6 py-3 flex items-center gap-3`}>
          <span className={`text-xs font-black px-2 py-0.5 rounded-full ${cfg.badgeBg} ${cfg.badgeText}`}>
            {cfg.medal || `#${ap.posicao}`}
          </span>
          <span className={`font-semibold text-sm ${ap.posicao === 1 ? "text-amber-950" : "text-white"}`}>
            {ap.destaque}
          </span>
        </div>
      )}

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
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base leading-none">{cfg.medal}</span>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                  #{ap.posicao}
                </span>
              </div>
            )}
            <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
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

        {/* CTA rápida — acima da dobra */}
        {ap.produto.linkAfiliado && (
          <div className="mb-5 flex items-center gap-3 flex-wrap">
            <BotaoMercadoLivre
              linkId={ap.produto.linkAfiliado.id}
              nomeProduto={ap.produto.nome}
              variante="compacto"
              preco={ap.precoAproximado}
            />
            <span className="text-xs text-slate-400">Preço pode mudar — confirme no ML</span>
          </div>
        )}

        {/* Pros / Contras */}
        {(pros.length > 0 || contras.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {pros.length > 0 && (
              <div className="bg-emerald-50/80 border border-emerald-100 rounded-xl p-4">
                <p className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-2.5">
                  Prós
                </p>
                <ul className="space-y-1.5">
                  {pros.map((p, i) => (
                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="text-emerald-500 font-black shrink-0 mt-0.5">+</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {contras.length > 0 && (
              <div className="bg-red-50/80 border border-red-100 rounded-xl p-4">
                <p className="text-xs font-black text-red-600 uppercase tracking-widest mb-2.5">
                  Contras
                </p>
                <ul className="space-y-1.5">
                  {contras.map((c, i) => (
                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="text-red-400 font-black shrink-0 mt-0.5">−</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Affiliate CTA — bottom */}
        {ap.produto.linkAfiliado && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/70 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-black text-amber-800 uppercase tracking-widest">
                Disponível no Mercado Livre
              </p>
              {ap.precoAproximado ? (
                <p className="text-sm font-bold text-amber-900 mt-0.5">
                  a partir de{" "}
                  {ap.precoAproximado.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              ) : null}
              <p className="text-xs text-amber-700/60 mt-0.5">
                Preço pode mudar — confirme no ML
              </p>
            </div>
            <BotaoMercadoLivre
              linkId={ap.produto.linkAfiliado.id}
              nomeProduto={ap.produto.nome}
              preco={ap.precoAproximado}
            />
          </div>
        )}
      </div>
    </div>
  );
}
