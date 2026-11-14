import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";
import ComboCard from "../components/ComboCard";

const HERO =
  "https://images.unsplash.com/photo-1611955167811-4711904bb9f8?auto=format&fit=crop&w=2000&q=80";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);
  const [status, setStatus] = useState("loading");
  const [active, setActive] = useState("Todas");
  const track = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    api.get("/products").then((res) => {
      setProducts(res.data);
      setStatus("ready");
    }).catch(() => setStatus("error"));
    api.get("/combos").then((res) => setCombos(res.data)).catch(() => {});
  }, []);

  const categories = ["Todas", ...new Set(products.map((p) => p.category.name))];
  const visible = products.filter((p) => active === "Todas" || p.category.name === active);

  function pick(name) {
    setActive(name);
    track.current?.scrollTo({ left: 0 });
  }

  const scroll = (dir) => track.current?.scrollBy({ left: dir * 364, behavior: "smooth" });

  function updateEdges() {
    const el = track.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft < 8,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8,
    });
  }

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [status, active]);

  return (
    <>
      <section className="relative flex min-h-[min(86vh,760px)] items-center overflow-hidden">
        <img src={HERO} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-paper from-30% via-paper/60 to-transparent" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-20">
          <h1 className="max-w-2xl font-serif text-6xl leading-[0.95] tracking-tight md:text-8xl">
            Brilho que acompanha cada dia.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/70">
            Ouro 18k e prata 925, em anéis, colares, brincos e pulseiras.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/catalogo"
              className="rounded-full bg-ink px-8 py-4 text-sm font-medium text-paper transition-all hover:-translate-y-0.5 hover:bg-accent"
            >
              Ver catálogo
            </Link>
            <a
              href="#combos"
              className="rounded-full border border-ink/30 px-8 py-4 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-ink"
            >
              Combos com desconto
            </a>
          </div>
        </div>
      </section>

      <section className="py-20" aria-labelledby="vitrine">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-4">
          <h2 id="vitrine" className="font-serif text-5xl">Vitrine</h2>

          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={c === active}
                onClick={() => pick(c)}
                className={`rounded-full border px-5 py-2 text-sm transition-colors ${
                  c === active ? "border-ink bg-ink text-paper" : "border-ink/20 hover:border-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

        </div>

        {status === "loading" && <p className="mx-auto mt-10 max-w-6xl px-4 text-ink/60">Carregando joias...</p>}
        {status === "error" && (
          <p className="mx-auto mt-10 max-w-6xl px-4 text-ink/80">
            Não foi possível carregar as joias. Confira se a API está rodando em <code>localhost:3333</code>.
          </p>
        )}

        {status === "ready" && (
          <div className="relative mt-10">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Peças anteriores"
              className={`absolute left-3 top-[40%] z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink shadow-lg ring-1 ring-ink/10 transition-all hover:bg-ink hover:text-paper md:grid ${
                edges.start ? "pointer-events-none opacity-0" : ""
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m15 5-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Próximas peças"
              className={`absolute right-3 top-[40%] z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink shadow-lg ring-1 ring-ink/10 transition-all hover:bg-ink hover:text-paper md:grid ${
                edges.end ? "pointer-events-none opacity-0" : ""
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m9 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>

            <div
              ref={track}
              onScroll={updateEdges}
              className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-2 md:px-[max(1rem,calc((100vw-72rem)/2+1rem))]"
            >
              {visible.map((p) => (
                <div key={p.id} className="w-[min(340px,78vw)] shrink-0 snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {combos.length > 0 && (
        <section id="combos" className="bg-stone py-20" aria-labelledby="combos-titulo">
          <div className="mx-auto max-w-6xl px-4">
            <h2 id="combos-titulo" className="font-serif text-5xl">Combos com desconto</h2>
            <p className="mt-3 max-w-lg text-ink/70">
              Peças que combinam entre si, com preço menor quando levadas juntas.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {combos.map((c) => (
                <ComboCard key={c.id} combo={c} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
