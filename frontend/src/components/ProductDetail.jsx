import { useState } from "react";
import { useCart } from "../context/CartContext";
import { formatPrice, installments } from "../lib/format";

export default function ProductDetail({ product, onAdded }) {
  const { add } = useCart();
  const variants = product.variants ?? [];
  const [imageIndex, setImageIndex] = useState(0);
  const [variantId, setVariantId] = useState(
    variants.length === 1 && variants[0].stock > 0 ? variants[0].id : null
  );
  const [needsSize, setNeedsSize] = useState(false);
  const selected = variants.find((v) => v.id === variantId);

  function handleAdd() {
    if (!variantId) {
      setNeedsSize(true);
      return;
    }
    add(product, variantId);
    onAdded?.();
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <div className="aspect-[4/5] overflow-hidden rounded-md bg-stone">
          <img src={product.images[imageIndex]} alt={product.name} className="h-full w-full object-cover" />
        </div>
        {product.images.length > 1 && (
          <div className="mt-3 flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setImageIndex(i)}
                aria-label={`Foto ${i + 1} de ${product.images.length}`}
                aria-current={i === imageIndex}
                className={`h-20 w-16 overflow-hidden border-2 ${
                  i === imageIndex ? "border-ink" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col">
        {product.category && <p className="text-sm text-ink/60">{product.category.name}</p>}
        <h2 className="mt-1 font-serif text-5xl leading-none">{product.name}</h2>
        <p className="mt-3 text-sm text-ink/60">{product.material}</p>
        <p className="mt-5 text-2xl font-medium">{formatPrice(product.price)}</p>
        <p className="text-sm text-ink/60">{installments(product.price)}</p>

        <p className="mt-6 max-w-prose leading-relaxed text-ink/80">{product.description}</p>

        {variants.length > 1 && (
          <div className="mt-8">
            <p className="text-sm font-medium">Tamanho</p>
            <div role="radiogroup" aria-label="Tamanho" className="mt-3 flex flex-wrap gap-2">
              {variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={v.id === variantId}
                  disabled={v.stock === 0}
                  onClick={() => {
                    setVariantId(v.id);
                    setNeedsSize(false);
                  }}
                  className={`min-w-14 border px-3 py-2 text-sm transition-colors disabled:opacity-30 ${
                    v.id === variantId ? "border-ink bg-ink text-paper" : "border-ink/20 hover:border-ink"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
            {needsSize && <p className="mt-2 text-sm text-accent" role="alert">Escolha um tamanho para continuar.</p>}
          </div>
        )}

        {selected && (
          <p className="mt-4 text-sm text-ink/60">
            {selected.stock <= 3 ? `Restam só ${selected.stock} unidades.` : "Em estoque."}
          </p>
        )}

        <button
          type="button"
          onClick={handleAdd}
          className="mt-8 bg-ink py-4 text-sm font-medium text-paper transition-colors hover:bg-accent"
        >
          Adicionar à sacola
        </button>
      </div>
    </div>
  );
}
