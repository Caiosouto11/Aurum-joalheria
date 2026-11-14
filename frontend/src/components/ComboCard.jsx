import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";

// Tamanho inicial do combo: o do meio entre os disponíveis. A pessoa ajusta na sacola.
const defaultVariant = (product) => {
  const available = product.variants.filter((v) => v.stock > 0);
  return available[Math.floor(available.length / 2)];
};

export default function ComboCard({ combo }) {
  const { add, setOpen } = useCart();

  function addCombo() {
    const info = { id: combo.id, title: combo.title, discount: combo.discount };
    combo.products.forEach((p) => {
      const v = defaultVariant(p);
      if (v) add(p, v.id, { combo: info, openDrawer: false });
    });
    setOpen(true);
  }

  return (
    <article className="group flex flex-col bg-paper">
      <div className="relative">
        <div
          className="grid gap-px bg-paper"
          style={{ gridTemplateColumns: `repeat(${combo.products.length}, minmax(0, 1fr))` }}
        >
          {combo.products.map((p) => (
            <div key={p.id} className="aspect-[3/4] overflow-hidden bg-stone">
              <img
                src={p.images[0]}
                alt={p.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          ))}
        </div>
        <span className="absolute left-3 top-3 bg-accent px-3 py-1 text-sm font-medium text-paper">
          −{combo.discount}%
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-4xl leading-none">{combo.title}</h3>
        <p className="mt-3 text-ink/70">{combo.description}</p>
        <ul className="mt-4 space-y-1 text-sm text-ink/60">
          {combo.products.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>

        <div className="mt-6 flex items-baseline gap-3">
          <span className="text-2xl font-medium">{formatPrice(combo.price)}</span>
          <span className="text-ink/40 line-through">{formatPrice(combo.original)}</span>
        </div>
        <p className="mt-1 text-sm text-accent">Você economiza {formatPrice(combo.original - combo.price)}</p>

        <button
          type="button"
          onClick={addCombo}
          className="mt-6 bg-ink py-4 text-sm font-medium text-paper transition-colors hover:bg-accent"
        >
          Adicionar combo à sacola
        </button>
        <p className="mt-2 text-xs text-ink/50">Você escolhe os tamanhos na sacola.</p>
      </div>
    </article>
  );
}
