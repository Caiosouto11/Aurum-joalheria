import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fotos do Unsplash (uso livre). Ordem = ordem dos produtos de cada categoria.
const photo = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&h=1000&q=80`;

const PHOTOS = {
  aneis: [
    "1611955167811-4711904bb9f8",
    "1622398925373-3f91b1e275f5",
    "1598560917807-1bae44bd2be8",
    "1631982690223-8aa4be0a2497",
  ],
  colares: [
    "1611107683227-e9060eccd846",
    "1744369382892-eb5b6a2fdc6f",
    "1506630448388-4e683c67ddb0",
    "1588444968576-f8fe92ce56fd",
  ],
  brincos: [
    "1701777892740-88419a701472",
    "1653227907864-560dce4c252d",
    "1671644730555-916aa8d8157f",
    "1758995115857-2de1eb6283d0",
  ],
  pulseiras: [
    "1639065643006-e217c4fee12e",
    "1619119069152-a2b331eb392a",
    "1626122738142-bbd66f671eca",
    "1668365179846-3333fe14f552",
  ],
};
const counters = {};

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
    const n = (counters[cat] = (counters[cat] ?? -1) + 1);
    const pool = PHOTOS[cat];
    await prisma.product.create({
      data: {
        name,
        slug: slugify(name),
        description,
        price,
        material,
        featured,
        images: [photo(pool[n % pool.length]), photo(pool[(n + 1) % pool.length])],
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
