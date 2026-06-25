interface Props {
  linkId: number;
  nomeProduto: string;
  variante?: "primario" | "compacto";
  preco?: number | null;
}

export function BotaoMercadoLivre({ linkId, nomeProduto, variante = "primario", preco }: Props) {
  const base =
    "inline-flex items-center gap-2 font-semibold rounded-xl transition-colors min-h-[44px]";
  const estilos = {
    primario: `${base} bg-amber-400 hover:bg-amber-500 text-slate-900 px-6 py-3 text-base shadow-sm`,
    compacto: `${base} bg-amber-400 hover:bg-amber-500 text-slate-900 px-4 py-2 text-sm`,
  };

  const precoFormatado = preco
    ? preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : null;

  return (
    <a
      href={`/api/redirect/${linkId}`}
      target="_blank"
      rel="nofollow noopener sponsored"
      aria-label={`Ver ${nomeProduto} no Mercado Livre`}
      className={estilos[variante]}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17" />
      </svg>
      {precoFormatado ? `Ver por ${precoFormatado} no ML →` : "Ver no Mercado Livre →"}
    </a>
  );
}
