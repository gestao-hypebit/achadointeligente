import Link from "next/link";

type Props = {
  artigo: {
    id: number;
    titulo: string;
    slug: string;
    descricao: string;
    imagemCapa?: string | null;
  };
  categoriaSlug: string;
  categoriaLabel?: string;
  categoriaIcone?: string | null;
  featured?: boolean;
};

export function CardArtigo({
  artigo,
  categoriaSlug,
  categoriaLabel,
  categoriaIcone,
  featured = false,
}: Props) {
  const badge = categoriaLabel ? (
    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
      {categoriaIcone && <span>{categoriaIcone}</span>}
      {categoriaLabel}
    </span>
  ) : null;

  if (featured) {
    return (
      <Link
        href={`/${categoriaSlug}/${artigo.slug}`}
        className="group flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 h-full"
      >
        {/* Image */}
        <div className="relative sm:w-[42%] h-56 sm:h-auto shrink-0 overflow-hidden">
          {artigo.imagemCapa ? (
            <>
              <img
                src={artigo.imagemCapa}
                alt={artigo.titulo}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent sm:bg-none" />
              {/* Mobile-only title overlay */}
              <div className="sm:hidden absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-bold text-white text-base leading-snug line-clamp-2">
                  {artigo.titulo}
                </h3>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-50 to-violet-100 flex flex-col items-center justify-center">
              <span className="text-6xl opacity-20">{categoriaIcone ?? "📦"}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="hidden sm:flex flex-col flex-1 p-7">
          {badge && <div className="mb-4">{badge}</div>}

          <h3 className="font-bold text-slate-900 text-xl lg:text-2xl leading-tight mb-3 group-hover:text-violet-700 transition-colors duration-200">
            {artigo.titulo}
          </h3>

          <p className="text-sm text-slate-500 leading-relaxed flex-1 line-clamp-4">
            {artigo.descricao}
          </p>

          <span className="text-sm font-semibold text-violet-600 mt-6 inline-flex items-center gap-1.5 group-hover:gap-3 transition-all duration-200">
            Ler análise completa
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>

        {/* Mobile-only body (below image) */}
        <div className="sm:hidden flex flex-col flex-1 p-4">
          {badge && <div className="mb-2">{badge}</div>}
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{artigo.descricao}</p>
          <span className="text-xs font-semibold text-violet-600 mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
            Ler análise completa
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </Link>
    );
  }

  /* Standard vertical card */
  return (
    <Link
      href={`/${categoriaSlug}/${artigo.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 h-full"
    >
      <div className="relative h-44 overflow-hidden shrink-0">
        {artigo.imagemCapa ? (
          <>
            <img
              src={artigo.imagemCapa}
              alt={artigo.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            {categoriaLabel && (
              <span className="absolute top-3 left-3 text-xs font-bold uppercase tracking-wide text-white bg-violet-600/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/20">
                {categoriaIcone && <span className="mr-1">{categoriaIcone}</span>}
                {categoriaLabel}
              </span>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-bold text-white text-sm leading-snug line-clamp-2 group-hover:text-amber-200 transition-colors duration-200">
                {artigo.titulo}
              </h3>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-50 to-violet-100 flex flex-col items-center justify-center">
            <span className="text-4xl opacity-25 mb-1">{categoriaIcone ?? "📦"}</span>
            {categoriaLabel && (
              <span className="text-xs font-medium text-violet-400">{categoriaLabel}</span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        {!artigo.imagemCapa && (
          <>
            {badge && <div className="mb-2">{badge}</div>}
            <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-violet-700 transition-colors text-base leading-snug">
              {artigo.titulo}
            </h3>
          </>
        )}

        <p className="text-sm text-slate-500 line-clamp-2 flex-1 leading-relaxed">
          {artigo.descricao}
        </p>

        <span className="text-xs font-semibold text-violet-600 mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
          Ler análise completa
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
