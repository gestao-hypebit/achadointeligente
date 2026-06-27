import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Divulgação de Afiliados",
  description: "Como o Achado Inteligente funciona e como ganhamos comissões de afiliado.",
};

export default function DivulgacaoAfiadosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-violet-600 hover:underline text-sm mb-8 inline-flex items-center gap-1">
        ← Voltar ao início
      </Link>

      <h1 className="text-3xl font-bold text-slate-900 mt-4 mb-2 tracking-tight">
        Divulgação de Afiliados
      </h1>
      <p className="text-sm text-slate-400 mb-10">Transparência sobre como este site funciona</p>

      <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-violet-600">
        <p className="lead">
          O <strong>Achado Inteligente</strong> acredita em total transparência com seus leitores. Esta página explica
          como o site funciona e de que forma geramos receita.
        </p>

        <h2>Somos participantes do programa de afiliados do Mercado Livre</h2>
        <p>
          Este site participa do <strong>Programa de Afiliados do Mercado Livre</strong>. Isso significa que alguns dos
          links presentes em nossos artigos são links de afiliado: quando você clica em um desses links e realiza uma
          compra, podemos receber uma pequena comissão do Mercado Livre.
        </p>
        <p>
          <strong>Esse custo não é repassado para você.</strong> O preço que você paga é exatamente o mesmo que pagaria
          acessando o Mercado Livre diretamente.
        </p>

        <h2>Nossas avaliações são independentes</h2>
        <p>
          A presença de links de afiliado <strong>não influencia nossas avaliações</strong>. Avaliamos os produtos com
          base em pesquisa, especificações técnicas e experiência de uso real — não com base em quais produtos geram
          mais comissão.
        </p>
        <p>
          Se um produto tem uma desvantagem relevante, nós a mencionamos. Se o melhor produto de uma categoria não
          estiver disponível com link de afiliado, ainda assim o recomendamos.
        </p>

        <h2>Google AdSense</h2>
        <p>
          Além de links de afiliado, este site exibe anúncios do <strong>Google AdSense</strong>. Esses anúncios são
          selecionados automaticamente pelo Google com base no conteúdo da página e no histórico de navegação do visitante.
          Não temos controle sobre quais anúncios são exibidos.
        </p>

        <h2>Como identificar um link de afiliado</h2>
        <p>
          Todos os links de afiliado deste site direcionam para o Mercado Livre e são identificados com o texto
          "Ver no Mercado Livre". Esses links sempre levam à página do produto na plataforma, onde você pode verificar
          o preço atual, avaliações de compradores e condições de entrega antes de comprar.
        </p>

        <h2>Dúvidas?</h2>
        <p>
          Se você tiver qualquer dúvida sobre nossa política de afiliados, entre em contato pelo e-mail:{" "}
          <a href="mailto:contato@achadointeligente.com.br">contato@achadointeligente.com.br</a>
        </p>
      </div>
    </div>
  );
}
