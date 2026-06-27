"use client";

import { useTransition } from "react";

interface Props {
  action: () => Promise<void>;
  mensagem?: string;
}

export function BotaoDeletar({
  action,
  mensagem = "Tem certeza que deseja excluir? Esta ação não pode ser desfeita.",
}: Props) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(mensagem)) return;
    startTransition(async () => {
      try {
        await action();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Erro ao excluir.");
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      title="Excluir"
      className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40"
    >
      {pending ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-spin">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      )}
    </button>
  );
}
