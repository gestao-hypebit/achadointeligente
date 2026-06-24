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
};

export function CardArtigo({ artigo, categoriaSlug, categoriaLabel, categoriaIcone }: Props) {
  return (
    <Link
      href={`/${categoriaSlug}/${artigo.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Image area */}
      <div className="relative h-52 overflow-hidden shrink-0">
        {artigo.imagemCapa ? (
          <>
            <img
              src={artigo.imagemCapa}
              alt={artigo.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* Category badge */}
            {categoriaLabel && (
              <span className="absolute top-3 left-3 text-xs font-semibold text-white bg-violet-600/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                {categoriaIcone && <span className="mr-1">{categoriaIcone}</span>}
                {categoriaLabel}
              </span>
            )}

            {/* Title overlaid on image */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-bold text-white text-sm leading-snug line-clamp-2 group-hover:text-amber-200 transition-colors duration-200">
                {artigo.titulo}
              </h3>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-50 to-violet-100 flex flex-col items-center justify-center">
            <span className="text-5xl opacity-30 mb-2">{categoriaIcone ?? "📦"}</span>
            {categoriaLabel && (
              <span className="text-xs font-medium text-violet-400">{categoriaLabel}</span>
            )}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title + category only when no image */}
        {!artigo.imagemCapa && (
          <>
            {categoriaLabel && (
              <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full w-fit mb-2">
                {categoriaIcone && <span className="mr-1">{categoriaIcone}</span>}
                {categoriaLabel}
              </span>
            )}
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
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
