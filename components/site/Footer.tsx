import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

async function getCategorias() {
  return prisma.categoria.findMany({
    orderBy: { nome: "asc" },
    take: 8,
    select: { id: true, nome: true, slug: true, icone: true },
  });
}

export async function Footer() {
  const categorias = await getCategorias();

  return (
    <footer className="bg-violet-950 text-slate-300 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Col 1: brand */}
          <div>
            <Link href="/" className="inline-flex items-center mb-4 bg-white rounded-xl px-3 py-2">
              <Image
                src="/logoafiliados.png"
                alt="Achado Inteligente"
                width={200}
                height={52}
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-violet-300/70 leading-relaxed mb-4">
              Análises independentes e comparativos dos melhores produtos para você tomar a decisão certa antes de comprar.
            </p>
            <p className="text-xs text-violet-400/50 leading-relaxed">
              Este site participa de programas de afiliados. Ao comprar pelos nossos links, podemos receber uma comissão sem custo adicional para você.
            </p>
          </div>

          {/* Col 2: quick links */}
          <div>
            <h3 className="text-xs font-black text-violet-300/80 uppercase tracking-[0.15em] mb-4">Links Rápidos</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/", label: "Início" },
                { href: "/busca", label: "Buscar Produtos" },
                { href: "/sobre", label: "Sobre" },
                { href: "/contato", label: "Contato" },
                { href: "/politica-de-privacidade", label: "Política de Privacidade" },
                { href: "/divulgacao-afiliados", label: "Divulgação de Afiliados" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-violet-300/60 hover:text-violet-300 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: categories */}
          <div>
            <h3 className="text-xs font-black text-violet-300/80 uppercase tracking-[0.15em] mb-4">Categorias</h3>
            <ul className="space-y-2.5 text-sm">
              {categorias.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/${c.slug}`}
                    className="text-violet-300/60 hover:text-violet-300 transition-colors flex items-center gap-1.5"
                  >
                    {c.icone && <span className="text-base">{c.icone}</span>}
                    {c.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-violet-900 pt-6 flex flex-col md:flex-row justify-between gap-2 text-xs text-violet-400/60">
          <p>© 2026 Achado Inteligente. Todos os direitos reservados.</p>
          <p>Feito com ❤️ para ajudar você a comprar melhor.</p>
        </div>
      </div>
    </footer>
  );
}
