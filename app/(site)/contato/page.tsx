import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a equipe do Achado Inteligente para dúvidas, sugestões ou parcerias.",
};

export default function ContatoPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-violet-600 hover:underline text-sm mb-8 inline-flex items-center gap-1">
        ← Voltar ao início
      </Link>

      <h1 className="text-3xl font-bold text-slate-900 mt-4 mb-2 tracking-tight">
        Contato
      </h1>
      <p className="text-sm text-slate-400 mb-10">Estamos à disposição para ouvir você</p>

      <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-violet-600">
        <p className="lead">
          Tem uma dúvida sobre algum artigo, encontrou uma informação desatualizada, quer sugerir um produto para
          análise ou propor uma parceria? Entre em contato pelo e-mail abaixo — respondemos o mais rápido possível.
        </p>

        <h2>E-mail</h2>
        <p>
          <a href="mailto:contato@achadointeligente.com.br">contato@achadointeligente.com.br</a>
        </p>

        <h2>O que você pode nos enviar</h2>
        <ul>
          <li>Correções ou atualizações sobre um produto ou artigo</li>
          <li>Sugestões de produtos ou categorias para novos comparativos</li>
          <li>Dúvidas sobre nossa política de privacidade ou de afiliados</li>
          <li>Propostas de parceria comercial</li>
        </ul>

        <p>
          Para saber mais sobre quem somos, visite a página <Link href="/sobre">Sobre</Link>.
        </p>
      </div>
    </div>
  );
}
