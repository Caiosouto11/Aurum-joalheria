import { useRef } from "react";
import { useCart } from "../context/CartContext";
import { useProductModal } from "../context/ProductModalContext";
import { formatPrice, installments } from "../lib/format";

export default function ProductCard({ product }) {
  const { add } = useCart();
  const { openProduct } = useProductModal();
  const imgRef = useRef(null);
  const variants = product.variants ?? [];
  const single = variants.length === 1;

  // O zoom acompanha o mouse: a foto cresce a partir do ponto onde ele está.
  function follow(e) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    if (imgRef.current) imgRef.current.style.transformOrigin = `${x}% ${y}%`;
  }
  function reset() {
    if (imgRef.current) imgRef.current.style.transformOrigin = "50% 50%";
  }

  return (
    <article className="group">
      <div
        onMouseMove={follow}
        onMouseLeave={reset}
        className="group/img relative aspect-[4/5] overflow-hidden rounded-md bg-stone"
      >
        <button
          type="button"
          onClick={() => openProduct(product)}
          aria-label={`Ver detalhes de ${product.name}`}
          className="absolute inset-0 block"
        >
          <img
            ref={imgRef}
            src={product.images[0]}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-[transform,transform-origin] duration-500 ease-out group-hover/img:scale-[1.06]"
          />
        </button>

        <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full bg-paper/95 p-3 backdrop-blur transition-transform duration-300 group-focus-within:translate-y-0 group-hover:translate-y-0 pointer-coarse:translate-y-0">
          {single ? (
            <button
              type="button"
              onClick={() => add(product, variants[0].id)}
              disabled={variants[0].stock === 0}
              className="w-full bg-ink py-3 text-sm font-medium text-paper transition-colors hover:bg-accent disabled:opacity-40"
            >
              {variants[0].stock === 0 ? "Indisponível" : "Adicionar à sacola"}
            </button>
          ) : (
            <>
              <p className="mb-2 text-xs text-ink/60">Adicionar à sacola, escolha o tamanho</p>
              <div className="flex flex-wrap gap-1.5">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    disabled={v.stock === 0}
                    onClick={() => add(product, v.id)}
                    className="min-w-10 border border-ink/20 px-2.5 py-1.5 text-xs transition-colors hover:border-ink hover:bg-ink hover:text-paper disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <button type="button" onClick={() => openProduct(product)} className="mt-4 block w-full text-left">
        <h3 className="font-serif text-2xl leading-tight text-ink transition-colors group-hover:text-accent">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-ink/60">{product.material}</p>
        <p className="mt-2 font-medium text-ink">{formatPrice(product.price)}</p>
        <p className="text-xs text-ink/50">{installments(product.price)}</p>
      </button>
    </article>
  );
}
