import { prisma } from "../lib/prisma.js";

const SORTS = {
  newest: { createdAt: "desc" },
  price_asc: { price: "asc" },
  price_desc: { price: "desc" },
  name: { name: "asc" },
};

// Prisma devolve Decimal como string no JSON; convertemos para número.
const formatProduct = (product) => ({
  ...product,
  price: Number(product.price),
});

export async function listProducts({ category, material, min, max, q, sort, featured }) {
  const where = {};

  if (category) where.category = { slug: category };
  if (material) where.material = { equals: material, mode: "insensitive" };
  if (featured === "true") where.featured = true;

  if (min !== undefined || max !== undefined) {
    where.price = {};
    if (min !== undefined) where.price.gte = min;
    if (max !== undefined) where.price.lte = max;
  }

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: SORTS[sort] ?? SORTS.newest,
    include: { category: true, variants: { orderBy: { id: "asc" } } },
  });

  return products.map(formatProduct);
}

export async function getProductBySlug(slug) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: { orderBy: { id: "asc" } },
    },
  });

  return product ? formatProduct(product) : null;
}

export function listCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}
