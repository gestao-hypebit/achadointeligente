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

type FormData = { nome: string; slug: string; icone: string; descricao: string };

const emptyForm: FormData = { nome: "", slug: "", icone: "", descricao: "" };

function autoSlug(nome: string) {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [deletePending, startDeleteTransition] = useTransition();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<FormData>(emptyForm);
  const [loadingEdit, setLoadingEdit] = useState(false);

  useEffect(() => {
    fetch("/api/categorias").then((r) => r.json()).then(setCategorias);
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoadingCreate(true);
    await fetch("/api/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const updated = await fetch("/api/categorias").then((r) => r.json());
    setCategorias(updated);
    setForm(emptyForm);
    setLoadingCreate(false);
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setLoadingEdit(true);
    await fetch(`/api/categorias/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    const updated = await fetch("/api/categorias").then((r) => r.json());
    setCategorias(updated);
    setEditingId(null);
    setEditForm(emptyForm);
    setLoadingEdit(false);
  }

  function startEditing(c: Categoria) {
    setEditingId(c.id);
    setEditForm({ nome: c.nome, slug: c.slug, icone: c.icone ?? "", descricao: c.descricao ?? "" });
  }

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

  const inputCls = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white";

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Categorias</h1>
        <p className="text-sm text-slate-400 mt-0.5">{categorias.length} categori{categorias.length === 1 ? "a" : "as"}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Criar categoria */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Nova categoria</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nome *</label>
              <input
                type="text"
                required
                value={form.nome}
                onChange={(e) => {
                  const nome = e.target.value;
                  setForm((f) => ({ ...f, nome, slug: autoSlug(nome) }));
                }}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Slug (URL) *</label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className={inputCls}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Ícone (emoji)</label>
                <input
                  type="text"
                  value={form.icone}
                  onChange={(e) => setForm((f) => ({ ...f, icone: e.target.value }))}
                  placeholder="🏠"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Descrição</label>
                <input
                  type="text"
                  value={form.descricao}
                  onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
                  className={inputCls}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loadingCreate}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {loadingCreate ? "Criando..." : "Criar categoria"}
            </button>
          </form>
        </div>

        {/* Lista */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Categorias existentes</h2>

          {categorias.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">Nenhuma categoria cadastrada.</p>
          ) : (
            <div className="space-y-2">
              {categorias.map((c) => (
                <div key={c.id}>
                  {editingId === c.id ? (
                    /* Edição inline */
                    <form onSubmit={handleEdit} className="border border-violet-200 bg-violet-50/40 rounded-xl p-3 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-0.5">Nome</label>
                          <input
                            type="text"
                            required
                            value={editForm.nome}
                            onChange={(e) => setEditForm((f) => ({ ...f, nome: e.target.value }))}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-0.5">Slug</label>
                          <input
                            type="text"
                            required
                            value={editForm.slug}
                            onChange={(e) => setEditForm((f) => ({ ...f, slug: e.target.value }))}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-0.5">Ícone</label>
                          <input
                            type="text"
                            value={editForm.icone}
                            onChange={(e) => setEditForm((f) => ({ ...f, icone: e.target.value }))}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-0.5">Descrição</label>
                          <input
                            type="text"
                            value={editForm.descricao}
                            onChange={(e) => setEditForm((f) => ({ ...f, descricao: e.target.value }))}
                            className={inputCls}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={loadingEdit}
                          className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {loadingEdit ? "Salvando..." : "Salvar"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="text-slate-500 hover:text-slate-700 text-xs px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Exibição normal */
                    <div className="flex items-center gap-2 py-2.5 px-3 border border-transparent hover:border-slate-100 hover:bg-slate-50 rounded-xl transition-all group">
                      {c.icone && <span className="text-lg leading-none shrink-0">{c.icone}</span>}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">{c.nome}</p>
                        <p className="text-xs text-slate-400">/{c.slug}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEditing(c)}
                          className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all"
                          title="Editar"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeletar(c.id)}
                          disabled={deletePending}
                          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40"
                          title="Excluir"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
