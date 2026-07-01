import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça o Achado Inteligente: quem somos, como testamos e escolhemos os produtos que recomendamos.",
};

export default function SobrePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-violet-600 hover:underline text-sm mb-8 inline-flex items-center gap-1">
        ← Voltar ao início
      </Link>

      <h1 className="text-3xl font-bold text-slate-900 mt-4 mb-2 tracking-tight">
        Sobre o Achado Inteligente
      </h1>
      <p className="text-sm text-slate-400 mb-10">Quem somos e como trabalhamos</p>

      <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-violet-600">
        <p className="lead">
          O <strong>Achado Inteligente</strong> é um site de conteúdo informativo dedicado a ajudar você a escolher
          melhor antes de comprar. Publicamos guias, comparativos e reviews sobre produtos do dia a dia, sempre com
          foco em explicar de forma clara o que realmente importa na hora da decisão.
        </p>

        <h2>Nossa missão</h2>
        <p>
          Comprar online pode ser confuso: dezenas de opções parecidas, especificações técnicas difíceis de entender
          e avaliações contraditórias. Nosso objetivo é organizar essa informação em artigos objetivos, que respondem
          à pergunta "qual é o melhor produto para o meu caso?" sem enrolação.
        </p>

        <h2>Como escolhemos os produtos</h2>
        <p>
          Cada artigo é baseado em pesquisa de especificações técnicas, comparação de preços, análise de avaliações
          de outros compradores e experiência prática com as categorias de produto abordadas. Sempre que relevante,
          indicamos prós e contras reais de cada item — inclusive quando um produto não é a melhor escolha para
          determinado perfil de uso.
        </p>

        <h2>Independência editorial</h2>
        <p>
          Este site participa do Programa de Afiliados do Mercado Livre, o que significa que podemos receber uma
          comissão quando você compra através de um dos nossos links, sem custo adicional para você. Essa relação
          comercial não influencia nossas recomendações — mais detalhes em nossa{" "}
          <Link href="/divulgacao-afiliados">página de Divulgação de Afiliados</Link>.
        </p>

        <h2>Conteúdo sempre atualizado</h2>
        <p>
          Revisamos periodicamente nossos artigos para manter preços, disponibilidade e recomendações condizentes
          com o mercado atual. A data da última atualização é sempre exibida no topo de cada artigo.
        </p>

        <h2>Fale com a gente</h2>
        <p>
          Tem uma sugestão de produto, encontrou uma informação desatualizada ou quer entrar em contato por qualquer
          outro motivo? Visite nossa <Link href="/contato">página de Contato</Link>.
        </p>
      </div>
    </div>
  );
}
