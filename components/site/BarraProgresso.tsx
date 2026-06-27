'use client'
import { useEffect, useState } from 'react'

export function BarraProgresso() {
  const [progresso, setProgresso] = useState(0)

  useEffect(() => {
    function calcular() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgresso(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }
    window.addEventListener('scroll', calcular, { passive: true })
    calcular()
    return () => window.removeEventListener('scroll', calcular)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-violet-500 to-amber-400 transition-[width] duration-75 ease-linear"
        style={{ width: `${progresso}%` }}
      />
    </div>
  )
}
