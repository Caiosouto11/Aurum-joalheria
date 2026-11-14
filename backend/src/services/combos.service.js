import { prisma } from "../lib/prisma.js";

// Combos definidos no servidor: o desconto nunca depende do que vem do front.
const COMBOS = [
  {
    id: "presente",
    title: "Combo Presente",
    description: "Colar e brincos para presentear alguém especial.",
    discount: 15,
    slugs: ["colar-ponto-de-luz", "brinco-argola-classica"],
  },
  {
    id: "prata",
    title: "Combo Prata",
    description: "Anel, pulseira e brincos em prata 925 para o dia a dia.",
    discount: 20,
    slugs: ["anel-lua-nova", "pulseira-elos-grossos", "brinco-perola-barroca"],
  },
  {
    id: "riviera",
    title: "Combo Riviera",
    description: "Colar e pulseira riviera em ouro 18k.",
    discount: 12,
    slugs: ["colar-riviera", "pulseira-riviera"],
  },
];

export async function listCombos() {
  const slugs = [...new Set(COMBOS.flatMap((c) => c.slugs))];

  const found = await prisma.product.findMany({
    where: { slug: { in: slugs } },
    include: { category: true, variants: { orderBy: { id: "asc" } } },
  });
  const bySlug = new Map(found.map((p) => [p.slug, { ...p, price: Number(p.price) }]));

  return COMBOS.map((combo) => {
    const products = combo.slugs.map((s) => bySlug.get(s)).filter(Boolean);
    const original = products.reduce((sum, p) => sum + p.price, 0);
    const price = Math.round(original * (100 - combo.discount)) / 100;
    return {
      id: combo.id,
      title: combo.title,
      description: combo.description,
      discount: combo.discount,
      products,
      original,
      price,
    };
  }).filter((c) => c.products.length === COMBOS.find((x) => x.id === c.id).slugs.length);
}
