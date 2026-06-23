import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const categoria = await prisma.categoria.upsert({
    where: { slug: "aspiradores" },
    update: {},
    create: {
      nome: "Aspiradores de Pó",
      slug: "aspiradores",
      descricao: "Reviews e comparativos dos melhores aspiradores de pó",
      icone: "🧹",
    },
  });

  const produto1 = await prisma.produto.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nome: "Electrolux STK15",
      descricao: "Aspirador de pó potente e silencioso, ideal para apartamentos",
      linkAfiliado: {
        create: { url: "https://mercadolivre.com.br/aspirador-electrolux-stk15" },
      },
    },
  });

  const produto2 = await prisma.produto.upsert({
    where: { id: 2 },
    update: {},
    create: {
      nome: "WAP GTW 10",
      descricao: "Excelente custo-benefício com ótima sucção",
      linkAfiliado: {
        create: { url: "https://mercadolivre.com.br/aspirador-wap-gtw10" },
      },
    },
  });

  await prisma.artigo.upsert({
    where: { slug: "melhor-aspirador-de-po-2026" },
    update: {},
    create: {
      titulo: "Melhores Aspiradores de Pó para Apartamento em 2026",
      slug: "melhor-aspirador-de-po-2026",
      descricao:
        "Testamos os melhores aspiradores de pó para apartamento. Confira nosso ranking com prós, contras e preços.",
      conteudo: `<p>Escolher o aspirador de pó certo faz toda a diferença na limpeza do seu apartamento. Neste guia, testamos os principais modelos disponíveis no mercado brasileiro.</p><h2>O que considerar antes de comprar</h2><p>Antes de comprar um aspirador, considere: potência de sucção, nível de ruído, capacidade do reservatório e facilidade de uso.</p>`,
      imagemCapa: null,
      publicado: true,
      categoriaId: categoria.id,
      produtos: {
        create: [
          {
            produtoId: produto1.id,
            posicao: 1,
            nota: 9.2,
            destaque: "Melhor Geral",
            pros: JSON.stringify(["Silencioso", "Leve", "Cabo longo"]),
            contras: JSON.stringify(["Preço um pouco elevado"]),
          },
          {
            produtoId: produto2.id,
            posicao: 2,
            nota: 8.5,
            destaque: "Melhor Custo-Benefício",
            pros: JSON.stringify(["Preço acessível", "Boa sucção"]),
            contras: JSON.stringify(["Reservatório pequeno", "Mais barulhento"]),
          },
        ],
      },
    },
  });

  const senhaHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "dev.rafaelcesar@gmail.com" },
    update: {},
    create: {
      email: "dev.rafaelcesar@gmail.com",
      senha: senhaHash,
      nome: "Rafael",
    },
  });

  console.log("Seed concluído!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
