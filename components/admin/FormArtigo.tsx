"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EditorConteudo } from "./EditorConteudo";

type Categoria = { id: number; nome: string; slug: string };
type Produto = { id: number; nome: string; linkAfiliado?: { id: number } | null };

type ProdutoVinculado = {
  produtoId: number;
  nome: string;
  posicao: number;
  nota: string;
  destaque: string;
  pros: string;
  contras: string;
  precoAproximado: string;
};

type ArtigoProdutoExistente = {
  id: number;
  posicao: number;
  nota?: number | null;
  destaque?: string | null;
  pros?: string | null;
  contras?: string | null;
  precoAproximado?: number | null;
  produto: Produto;
};

type Artigo = {
  id: number;
  titulo: string;
  slug: string;
  descricao: string;
  conteudo: string;
  imagemCapa?: string | null;
  categoriaId: number;
  publicado: boolean;
  produtos: ArtigoProdutoExistente[];
};

interface Props {
  artigo?: Artigo;
  categorias: Categoria[];
  produtos: Produto[];
}

export function FormArtigo({ artigo, categorias, produtos }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    titulo: artigo?.titulo ?? "",
    slug: artigo?.slug ?? "",
    descricao: artigo?.descricao ?? "",
    conteudo: artigo?.conteudo ?? "",
    imagemCapa: artigo?.imagemCapa ?? "",
    categoriaId: artigo?.categoriaId ?? (categorias[0]?.id ?? ""),
    publicado: artigo?.publicado ?? false,
  });

  const [produtosVinculados, setProdutosVinculados] = useState<ProdutoVinculado[]>(
    artigo?.produtos.map((ap) => ({
      produtoId: ap.produto.id,
      nome: ap.produto.nome,
      posicao: ap.posicao,
      nota: ap.nota?.toString() ?? "",
      destaque: ap.destaque ?? "",
      pros: ap.pros ? JSON.parse(ap.pros).join("\n") : "",
      contras: ap.contras ? JSON.parse(ap.contras).join("\n") : "",
      precoAproximado: ap.precoAproximado?.toString() ?? "",
    })) ?? []
  );

  const [produtoSelecionado, setProdutoSelecionado] = useState("");

  function update(field: string, value: unknown) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function autoSlug(titulo: string) {
    return titulo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  function adicionarProduto() {
    const id = Number(produtoSelecionado);
    if (!id) return;
    if (produtosVinculados.find((p) => p.produtoId === id)) return;
    const produto = produtos.find((p) => p.id === id);
    if (!produto) return;
    setProdutosVinculados((prev) => [
      ...prev,
      {
        produtoId: id,
        nome: produto.nome,
        posicao: prev.length + 1,
        nota: "",
        destaque: "",
        pros: "",
        contras: "",
        precoAproximado: "",
      },
    ]);
    setProdutoSelecionado("");
  }

  function removerProduto(produtoId: number) {
    setProdutosVinculados((prev) =>
      prev
        .filter((p) => p.produtoId !== produtoId)
        .map((p, i) => ({ ...p, posicao: i + 1 }))
    );
  }

  function updateProduto(produtoId: number, field: string, value: string) {
    setProdutosVinculados((prev) =>
      prev.map((p) => (p.produtoId === produtoId ? { ...p, [field]: value } : p))
    );
  }

  function parseLista(texto: string): string {
    const itens = texto
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    return itens.length ? JSON.stringify(itens) : "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const body = JSON.stringify({
      ...form,
      categoriaId: Number(form.categoriaId),
      produtos: produtosVinculados.map((p) => ({
        produtoId: p.produtoId,
        posicao: p.posicao,
        nota: p.nota ? Number(p.nota) : null,
        destaque: p.destaque || null,
        pros: parseLista(p.pros),
        contras: parseLista(p.contras),
        precoAproximado: p.precoAproximado ? Number(p.precoAproximado) : null,
      })),
    });

    if (artigo) {
      await fetch(`/api/artigos/${artigo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body,
      });
    } else {
      await fetch("/api/artigos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
    }

    setLoading(false);
    router.push("/admin/artigos");
    router.refresh();
  }

  const produtosDisponiveis = produtos.filter(
    (p) => !produtosVinculados.find((pv) => pv.produtoId === p.id)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Informações básicas */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Informações básicas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
            <input
              type="text"
              required
              value={form.titulo}
              onChange={(e) => {
                update("titulo", e.target.value);
                if (!artigo) update("slug", autoSlug(e.target.value));
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL) *</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta descrição *</label>
            <textarea
              required
              value={form.descricao}
              onChange={(e) => update("descricao", e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <p className="text-xs text-gray-400 mt-1">{form.descricao.length} caracteres</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
            <select
              required
              value={form.categoriaId}
              onChange={(e) => update("categoriaId", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL da imagem de capa</label>
            <input
              type="url"
              value={form.imagemCapa}
              onChange={(e) => update("imagemCapa", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="publicado"
              checked={form.publicado}
              onChange={(e) => update("publicado", e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="publicado" className="text-sm font-medium text-gray-700">
              Publicar artigo
            </label>
          </div>
        </div>
      </div>

      {/* Produtos vinculados */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-gray-900">Produtos do artigo</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Os produtos vinculados aparecem na tabela comparativa e nos cards com botão de afiliado.
          </p>
        </div>

        {/* Adicionar produto */}
        <div className="flex gap-2">
          <select
            value={produtoSelecionado}
            onChange={(e) => setProdutoSelecionado(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">Selecionar produto...</option>
            {produtosDisponiveis.map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={adicionarProduto}
            disabled={!produtoSelecionado}
            className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-40"
          >
            + Adicionar
          </button>
        </div>

        {/* Lista de produtos vinculados */}
        {produtosVinculados.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-lg">
            Nenhum produto vinculado. Selecione um produto acima.
          </p>
        )}

        <div className="space-y-4">
          {produtosVinculados.map((pv, idx) => (
            <div key={pv.produtoId} className="border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-violet-100 text-violet-700 text-xs font-bold px-2 py-1 rounded-full">
                    #{idx + 1}
                  </span>
                  <span className="font-medium text-gray-900 text-sm">{pv.nome}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removerProduto(pv.produtoId)}
                  className="text-red-400 hover:text-red-600 text-xs font-medium"
                >
                  Remover
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Destaque <span className="text-gray-400 font-normal">(ex: Melhor Geral)</span>
                  </label>
                  <input
                    type="text"
                    value={pv.destaque}
                    onChange={(e) => updateProduto(pv.produtoId, "destaque", e.target.value)}
                    placeholder="Melhor Geral, Custo-Benefício..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Nota <span className="text-gray-400 font-normal">(0 a 10)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    value={pv.nota}
                    onChange={(e) => updateProduto(pv.produtoId, "nota", e.target.value)}
                    placeholder="8.5"
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Preço aproximado{" "}
                    <span className="text-gray-400 font-normal">(R$, ex: 299.90)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={pv.precoAproximado}
                    onChange={(e) => updateProduto(pv.produtoId, "precoAproximado", e.target.value)}
                    placeholder="299.90"
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Prós <span className="text-gray-400 font-normal">(um por linha)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={pv.pros}
                    onChange={(e) => updateProduto(pv.produtoId, "pros", e.target.value)}
                    placeholder={"Silencioso\nLeve\nCabo longo"}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Contras <span className="text-gray-400 font-normal">(um por linha)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={pv.contras}
                    onChange={(e) => updateProduto(pv.produtoId, "contras", e.target.value)}
                    placeholder={"Reservatório pequeno\nCabo curto"}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Conteúdo do artigo</h2>
        <EditorConteudo value={form.conteudo} onChange={(v) => update("conteudo", v)} />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
        >
          {loading ? "Salvando..." : artigo ? "Salvar alterações" : "Criar artigo"}
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
