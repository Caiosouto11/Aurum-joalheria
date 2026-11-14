import * as productsService from "../services/products.service.js";
import { listCombos } from "../services/combos.service.js";

const parseNumber = (value) => {
  if (value === undefined || value === "") return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? NaN : n;
};

export async function index(req, res) {
  const { category, material, q, sort, featured } = req.query;
  const min = parseNumber(req.query.min);
  const max = parseNumber(req.query.max);

  if (Number.isNaN(min) || Number.isNaN(max)) {
    return res.status(400).json({ error: "Os filtros 'min' e 'max' devem ser números." });
  }

  const products = await productsService.listProducts({
    category, material, min, max, q, sort, featured,
  });

  res.json(products);
}

export async function show(req, res) {
  const product = await productsService.getProductBySlug(req.params.slug);

  if (!product) {
    return res.status(404).json({ error: "Produto não encontrado." });
  }

  res.json(product);
}

export async function categories(req, res) {
  res.json(await productsService.listCategories());
}

export async function combos(req, res) {
  res.json(await listCombos());
}
