"use client";

import { useTransition } from "react";

interface Props {
  action: () => Promise<void>;
  mensagem?: string;
}

export function BotaoDeletar({ action, mensagem = "Tem certeza que deseja excluir? Esta ação não pode ser desfeita." }: Props) {
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
      className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-40 transition-colors"
    >
      {pending ? "Excluindo..." : "Excluir"}
    </button>
  );
}
