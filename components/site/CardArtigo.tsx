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
      className="block bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-violet-200 transition-all group"
    >
      <div className="h-44 bg-slate-100 overflow-hidden flex items-center justify-center">
        {artigo.imagemCapa ? (
          <img
            src={artigo.imagemCapa}
            alt={artigo.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-5xl opacity-30">{categoriaIcone ?? "📦"}</span>
        )}
      </div>
      <div className="p-5">
        {categoriaLabel && (
          <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-1 rounded-full">
            {categoriaIcone && <span className="mr-1">{categoriaIcone}</span>}
            {categoriaLabel}
          </span>
        )}
        <h3 className="font-bold text-slate-900 mt-2 mb-1 line-clamp-2 group-hover:text-violet-700 transition-colors">
          {artigo.titulo}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2">{artigo.descricao}</p>
        <span className="text-sm text-violet-600 font-medium mt-3 inline-block">Ler mais →</span>
      </div>
    </Link>
  );
}
