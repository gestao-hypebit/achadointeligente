"use client";

import { useState, useEffect, useTransition } from "react";
import { deletarCategoria } from "@/app/actions/deletar";

type Categoria = {
  id: number;
  nome: string;
  slug: string;
  icone?: string | null;
  descricao?: string | null;
};

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [form, setForm] = useState({ nome: "", slug: "", icone: "", descricao: "" });
  const [loading, setLoading] = useState(false);
  const [deletePending, startDeleteTransition] = useTransition();

  function handleDeletar(id: number) {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;
    startDeleteTransition(async () => {
      try {
        await deletarCategoria(id);
        setCategorias((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        alert(err instanceof Error ? err.message : "Erro ao excluir.");
      }
    });
  }

  useEffect(() => {
    fetch("/api/categorias")
      .then((r) => r.json())
      .then(setCategorias);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const updated = await fetch("/api/categorias").then((r) => r.json());
    setCategorias(updated);
    setForm({ nome: "", slug: "", icone: "", descricao: "" });
    setLoading(false);
  }

  const fields = [
    { name: "nome", label: "Nome", required: true },
    { name: "slug", label: "Slug (URL)", required: true },
    { name: "icone", label: "Ícone (emoji)" },
    { name: "descricao", label: "Descrição" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Categorias</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Nova categoria</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  type="text"
                  required={field.required}
                  value={(form as Record<string, string>)[field.name]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [field.name]: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Criar categoria"}
            </button>
          </form>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Categorias existentes</h2>
          <div className="space-y-2">
            {categorias.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0"
              >
                {c.icone && <span>{c.icone}</span>}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{c.nome}</p>
                  <p className="text-xs text-gray-400">/{c.slug}</p>
                </div>
                <button
                  onClick={() => handleDeletar(c.id)}
                  disabled={deletePending}
                  className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-40 transition-colors"
                >
                  Excluir
                </button>
              </div>
            ))}
            {categorias.length === 0 && (
              <p className="text-gray-400 text-sm">Nenhuma categoria ainda.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
