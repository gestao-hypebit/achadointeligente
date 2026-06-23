import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { HeaderClient } from "./HeaderClient";

async function getCategorias() {
  return prisma.categoria.findMany({ orderBy: { nome: "asc" }, take: 8 });
}

export async function Header() {
  const categorias = await getCategorias();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main row */}
        <div className="flex items-center h-16 gap-4 relative">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/logoafiliados.png"
              alt="Achado Inteligente"
              width={160}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          <div className="flex-1" />

          {/* Client: search + hamburger */}
          <HeaderClient categorias={categorias} />
        </div>

        {/* Category nav - desktop only */}
        <nav className="hidden md:flex gap-1 pb-2 overflow-x-auto hide-scrollbar">
          {categorias.map((c) => (
            <Link
              key={c.id}
              href={`/${c.slug}`}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-slate-600 hover:text-violet-700 hover:bg-violet-50 transition-colors whitespace-nowrap"
            >
              {c.icone && <span>{c.icone}</span>}
              {c.nome}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
