import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Política de privacidade e uso de dados do Achado Inteligente.",
};

export default function PoliticaPrivacidadePage() {
  const ultimaAtualizacao = "27 de junho de 2026";

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-violet-600 hover:underline text-sm mb-8 inline-flex items-center gap-1">
        ← Voltar ao início
      </Link>

      <h1 className="text-3xl font-bold text-slate-900 mt-4 mb-2 tracking-tight">
        Política de Privacidade
      </h1>
      <p className="text-sm text-slate-400 mb-10">Última atualização: {ultimaAtualizacao}</p>

      <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-violet-600">
        <h2>1. Informações que coletamos</h2>
        <p>
          O <strong>Achado Inteligente</strong> é um site de conteúdo informativo. Não coletamos dados pessoais
          identificáveis de nossos visitantes, como nome, e-mail ou CPF, exceto quando você nos contata voluntariamente.
        </p>
        <p>
          Podemos coletar automaticamente informações técnicas como endereço IP, tipo de navegador, páginas visitadas e
          tempo de permanência, por meio de ferramentas de análise como o Google Analytics. Esses dados são anonimizados
          e usados exclusivamente para melhorar o site.
        </p>

        <h2>2. Cookies</h2>
        <p>
          Utilizamos cookies para fins de análise de tráfego (Google Analytics) e exibição de anúncios (Google AdSense).
          Você pode desativar os cookies nas configurações do seu navegador, mas isso pode afetar a experiência de uso do site.
        </p>

        <h2>3. Google AdSense e publicidade</h2>
        <p>
          Este site exibe anúncios do Google AdSense. O Google pode usar cookies para exibir anúncios relevantes com base
          em visitas anteriores a este site ou a outros sites. Você pode desativar a publicidade personalizada em{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
            adssettings.google.com
          </a>.
        </p>

        <h2>4. Links de afiliado</h2>
        <p>
          Este site contém links de afiliado do Mercado Livre. Quando você clica em um desses links e realiza uma compra,
          podemos receber uma comissão. Esse processo não envolve a coleta de dados pessoais seus — apenas registramos
          o clique de forma anônima para fins de rastreamento de desempenho.
        </p>

        <h2>5. Compartilhamento de dados</h2>
        <p>
          Não vendemos, alugamos ou compartilhamos dados pessoais com terceiros, exceto quando exigido por lei ou por
          determinação judicial.
        </p>

        <h2>6. Seus direitos (LGPD)</h2>
        <p>
          De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a solicitar acesso,
          correção ou exclusão de quaisquer dados pessoais que possamos ter armazenado. Para exercer esses direitos,
          entre em contato pelo e-mail indicado abaixo.
        </p>

        <h2>7. Contato</h2>
        <p>
          Dúvidas sobre esta política? Entre em contato conosco pelo e-mail:{" "}
          <a href="mailto:contato@achadointeligente.com.br">contato@achadointeligente.com.br</a>
        </p>
      </div>
    </div>
  );
}
