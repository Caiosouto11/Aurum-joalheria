import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";

const SORTS = [
  { value: "newest", label: "Mais recentes" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "name", label: "Nome (A a Z)" },
];

const MATERIALS = ["Ouro 18k", "Prata 925"];

const PRICES = [
  { value: "0-500", label: "Até R$ 500" },
  { value: "500-1000", label: "R$ 500 a R$ 1.000" },
  { value: "1000-", label: "Acima de R$ 1.000" },
];

const selectClass =
  "border border-ink/20 bg-paper px-3 py-2 text-sm text-ink hover:border-ink/50";

export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");

  const categoria = params.get("categoria") ?? "";
  const material = params.get("material") ?? "";
  const preco = params.get("preco") ?? "";
  const q = params.get("q") ?? "";
  const sort = params.get("sort") ?? "newest";

  const [search, setSearch] = useState(q);
  useEffect(() => setSearch(q), [q]);

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    const [min, max] = preco ? preco.split("-") : [];

    setStatus("loading");
    api
      .get("/products", {
        params: {
          category: categoria || undefined,
          material: material || undefined,
          min: min || undefined,
          max: max || undefined,
          q: q || undefined,
          sort,
        },
      })
      .then((res) => {
        if (cancelled) return;
        setProducts(res.data);
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));

    return () => {
      cancelled = true;
    };
  }, [categoria, material, preco, q, sort]);

  function update(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  }

  const hasFilters = categoria || material || preco || q;

  const pill = (active) =>
    `px-4 py-2 text-sm border transition-colors ${
      active
        ? "border-ink bg-ink text-paper"
        : "border-ink/20 text-ink/80 hover:border-ink/60"
    }`;

  return (
    <section className="page">
      <h1 className="font-serif text-6xl">Catálogo</h1>

      <div className="mt-8 flex flex-wrap gap-2">
        <button className={pill(!categoria)} onClick={() => update("categoria", "")}>
          Todas
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className={pill(categoria === c.slug)}
            onClick={() => update("categoria", c.slug)}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            update("q", search.trim());
          }}
          className="flex"
        >
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar joia"
            aria-label="Buscar joia"
            className="w-48 border border-ink/20 bg-paper px-3 py-2 text-sm placeholder:text-ink/40"
          />
          <button type="submit" className="bg-ink px-4 text-sm text-paper hover:bg-accent">
            Buscar
          </button>
        </form>

        <select
          aria-label="Material"
          value={material}
          onChange={(e) => update("material", e.target.value)}
          className={selectClass}
        >
          <option value="">Todos os materiais</option>
          {MATERIALS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select
          aria-label="Faixa de preço"
          value={preco}
          onChange={(e) => update("preco", e.target.value)}
          className={selectClass}
        >
          <option value="">Qualquer preço</option>
          {PRICES.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>

        <select
          aria-label="Ordenar"
          value={sort}
          onChange={(e) => update("sort", e.target.value === "newest" ? "" : e.target.value)}
          className={`${selectClass} md:ml-auto`}
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="mt-10">
        {status === "loading" && <p className="text-ink/60">Carregando joias...</p>}

        {status === "error" && (
          <p className="text-ink/80">
            Não foi possível carregar o catálogo. Confira se a API está rodando em{" "}
            <code>localhost:3333</code>.
          </p>
        )}

        {status === "ready" && products.length === 0 && (
          <div>
            <p className="text-ink/80">Nenhuma joia encontrada com esses filtros.</p>
            {hasFilters && (
              <button
                onClick={() => setParams({})}
                className="mt-3 text-accent underline"
              >
                Limpar filtros
              </button>
            )}
          </div>
        )}

        {status === "ready" && products.length > 0 && (
          <>
            <p className="mb-6 text-sm text-ink/60">
              {products.length} {products.length === 1 ? "peça" : "peças"}
            </p>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
