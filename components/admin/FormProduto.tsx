"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Produto = {
  id: number;
  nome: string;
  descricao?: string | null;
  imagem?: string | null;
  linkAfiliado?: { id: number; url: string } | null;
};

interface Props {
  produto?: Produto;
}

export function FormProduto({ produto }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: produto?.nome ?? "",
    descricao: produto?.descricao ?? "",
    imagem: produto?.imagem ?? "",
    linkUrl: produto?.linkAfiliado?.url ?? "",
  });
  const [previewError, setPreviewError] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (field === "imagem") setPreviewError(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const body = {
      nome: form.nome,
      descricao: form.descricao || null,
      imagem: form.imagem || null,
      linkUrl: form.linkUrl || null,
      linkAfiliado: form.linkUrl ? { url: form.linkUrl } : undefined,
    };

    if (produto) {
      await fetch(`/api/produtos/${produto.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    setLoading(false);
    router.push("/admin/produtos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do produto *</label>
        <input
          type="text"
          required
          value={form.nome}
          onChange={(e) => update("nome", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          rows={2}
          value={form.descricao}
          onChange={(e) => update("descricao", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Imagem do produto
          <span className="text-gray-400 font-normal ml-1">(URL — clique direito na foto do produto no ML → Copiar endereço da imagem)</span>
        </label>
        <input
          type="url"
          value={form.imagem}
          onChange={(e) => update("imagem", e.target.value)}
          placeholder="https://..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {form.imagem && !previewError && (
          <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg inline-flex items-center gap-3">
            <img
              src={form.imagem}
              alt="Preview"
              className="w-20 h-20 object-contain"
              onError={() => setPreviewError(true)}
            />
            <span className="text-xs text-gray-500">Preview da imagem</span>
          </div>
        )}
        {previewError && (
          <p className="mt-1 text-xs text-red-500">Não foi possível carregar a imagem. Verifique a URL.</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Link de afiliado (Mercado Livre)</label>
        <input
          type="url"
          value={form.linkUrl}
          onChange={(e) => update("linkUrl", e.target.value)}
          placeholder="https://mercadolivre.com.br/..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
        >
          {loading ? "Salvando..." : produto ? "Salvar alterações" : "Criar produto"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900 text-sm px-4 py-2"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
