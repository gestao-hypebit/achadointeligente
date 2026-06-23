"use client";

import { useState } from "react";
import Link from "next/link";

type Categoria = { id: number; nome: string; slug: string; icone?: string | null };

interface Props {
  categorias: Categoria[];
}

export function HeaderClient({ categorias }: Props) {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3">
        {/* Search - desktop */}
        <form action="/busca" method="GET" className="hidden md:flex">
          <div className="relative">
            <input
              type="search"
              name="q"
              placeholder="Buscar produtos..."
              className="w-56 lg:w-72 px-4 py-1.5 text-sm border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-slate-50"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors"
              aria-label="Buscar"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>
        </form>

        {/* Hamburger - mobile */}
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuAberto ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuAberto && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 space-y-1">
            <form action="/busca" method="GET" className="mb-3">
              <div className="relative">
                <input
                  type="search"
                  name="q"
                  placeholder="Buscar produtos..."
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-label="Buscar"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </button>
              </div>
            </form>
            {categorias.map((c) => (
              <Link
                key={c.id}
                href={`/${c.slug}`}
                onClick={() => setMenuAberto(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
              >
                {c.icone && <span>{c.icone}</span>}
                <span className="text-sm font-medium">{c.nome}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
