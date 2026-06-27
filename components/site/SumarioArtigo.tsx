'use client'
import { useEffect, useState } from 'react'

export type ItemSumario = { id: string; texto: string; nivel: number }

export function SumarioArtigo({ itens }: { itens: ItemSumario[] }) {
  const [ativo, setAtivo] = useState<string>('')

  useEffect(() => {
    if (itens.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setAtivo(visible[0].target.id)
        }
      },
      { rootMargin: '-10% 0% -70% 0%', threshold: 0 }
    )
    itens.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [itens])

  if (itens.length < 2) return null

  return (
    <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto hide-scrollbar">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 mb-3 px-1">
        Neste artigo
      </p>
      <nav>
        <ul className="space-y-0.5">
          {itens.map((item) => {
            const isAtivo = ativo === item.id
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={[
                    'block text-[13px] py-1.5 px-2 rounded-lg leading-snug transition-all duration-150',
                    item.nivel === 3 ? 'ml-3' : '',
                    isAtivo
                      ? 'text-violet-700 font-semibold bg-violet-50'
                      : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50',
                  ].join(' ')}
                >
                  {item.texto}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
