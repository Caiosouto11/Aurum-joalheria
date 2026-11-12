import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const img = (text) =>
  `https://placehold.co/800x800/171717/d4af37?text=${encodeURIComponent(text)}`;

const aros = ["Aro 12", "Aro 14", "Aro 16", "Aro 18", "Aro 20"];
const correntes = ["40 cm", "45 cm", "50 cm", "60 cm"];
const pulseiras = ["16 cm", "18 cm", "20 cm"];
const unico = ["Tamanho único"];

const categories = [
  { name: "Anéis", slug: "aneis" },
  { name: "Colares", slug: "colares" },
  { name: "Brincos", slug: "brincos" },
  { name: "Pulseiras", slug: "pulseiras" },
];

// [categoria, nome, preço, material, destaque, tamanhos, descrição]
const products = [
  ["aneis", "Anel Solitário Aurora", 1890, "Ouro 18k", true, aros, "Anel clássico com zircônia central lapidada em ouro 18k."],
  ["aneis", "Aliança Eterna", 1290, "Ouro 18k", false, aros, "Aliança lisa de acabamento polido, conforto para o dia a dia."],
  ["aneis", "Anel Lua Nova", 420, "Prata 925", false, aros, "Anel minimalista em prata 925 com formato de meia-lua."],
  ["aneis", "Anel Trilho de Estrelas", 560, "Prata 925", true, aros, "Anel com trilho de zircônias em prata 925 banhada a ródio."],
  ["colares", "Colar Ponto de Luz", 980, "Ouro 18k", true, correntes, "Corrente fina com pingente de ponto de luz em ouro 18k."],
  ["colares", "Colar Riviera", 2450, "Ouro 18k", false, correntes, "Colar riviera com pedras brilhantes, ideal para ocasiões especiais."],
  ["colares", "Gargantilha Veneziana", 390, "Prata 925", false, correntes, "Gargantilha em malha veneziana de prata 925."],
  ["colares", "Colar Pingente Coração", 450, "Prata 925", false, correntes, "Pingente de coração vazado em prata 925."],
  ["brincos", "Brinco Argola Clássica", 760, "Ouro 18k", true, unico, "Argola média de ouro 18k com fecho de pressão."],
  ["brincos", "Brinco Gota de Cristal", 640, "Prata 925", false, unico, "Brinco pendente com cristal em formato de gota."],
  ["brincos", "Brinco Ear Cuff Estrela", 310, "Prata 925", false, unico, "Ear cuff delicado com estrelas, sem necessidade de furo."],
  ["brincos", "Brinco Pérola Barroca", 520, "Prata 925", false, unico, "Pérola barroca cultivada com haste em prata 925."],
  ["pulseiras", "Pulseira Riviera", 1650, "Ouro 18k", false, pulseiras, "Pulseira riviera de ouro 18k com zircônias."],
  ["pulseiras", "Pulseira Elos Grossos", 480, "Prata 925", true, pulseiras, "Pulseira de elos grossos com fecho lagosta."],
  ["pulseiras", "Pulseira Berloques", 540, "Prata 925", false, pulseiras, "Pulseira com berloques de estrela, lua e coração."],
  ["pulseiras", "Bracelete Torcido", 890, "Ouro 18k", false, pulseiras, "Bracelete fino torcido em ouro 18k."],
];

const slugify = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

async function main() {
  // limpa na ordem certa por causa das relações
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const catIds = {};
  for (const c of categories) {
    const created = await prisma.category.create({ data: c });
    catIds[c.slug] = created.id;
  }

  for (const [cat, name, price, material, featured, sizes, description] of products) {
    await prisma.product.create({
      data: {
        name,
        slug: slugify(name),
        description,
        price,
        material,
        featured,
        images: [img(name), img(`${name} 2`), img(`${name} 3`)],
        categoryId: catIds[cat],
        variants: {
          create: sizes.map((label) => ({
            label,
            stock: Math.floor(Math.random() * 8) + 2,
          })),
        },
      },
    });
  }

  console.log(`✅ Seed concluído: ${categories.length} categorias e ${products.length} produtos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
