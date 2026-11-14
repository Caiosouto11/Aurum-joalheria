import { Link } from "react-router-dom";
import { useCart, unitPrice } from "../context/CartContext";
import { formatPrice } from "../lib/format";

export default function CartLines({ onNavigate }) {
  const { items, remove, setQuantity, changeVariant } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-ink/70">Sua sacola está vazia.</p>
        <Link to="/catalogo" onClick={onNavigate} className="mt-3 inline-block text-accent underline">
          Ver o catálogo
        </Link>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-ink/10">
      {items.map((item) => (
        <li key={item.key} className="flex gap-4 py-5">
          <img src={item.product.image} alt={item.product.name} className="h-24 w-20 shrink-0 bg-stone object-cover" />

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex justify-between gap-3">
              <div>
                <h3 className="font-medium leading-snug">{item.product.name}</h3>
                <p className="text-sm text-ink/60">{item.product.material}</p>
                {item.comboTitle && (
                  <p className="mt-1 text-xs font-medium text-accent">
                    {item.comboTitle}, {item.discount}% de desconto
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(item.key)}
                aria-label={`Remover ${item.product.name}`}
                className="h-6 w-6 shrink-0 text-xl leading-none text-ink/40 hover:text-ink"
              >
                ×
              </button>
            </div>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
              <div className="flex items-center gap-3">
                {item.product.variants.length > 1 && (
                  <select
                    aria-label={`Tamanho de ${item.product.name}`}
                    value={item.variantId}
                    onChange={(e) => changeVariant(item.key, Number(e.target.value))}
                    className="border border-ink/20 bg-paper px-2 py-1 text-sm"
                  >
                    {item.product.variants.map((v) => (
                      <option key={v.id} value={v.id} disabled={v.stock === 0}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                )}
                <div className="flex items-center border border-ink/20">
                  <button type="button" aria-label="Diminuir quantidade" onClick={() => setQuantity(item.key, item.quantity - 1)} className="h-8 w-8 hover:bg-stone">−</button>
                  <span className="w-7 text-center text-sm" aria-live="polite">{item.quantity}</span>
                  <button type="button" aria-label="Aumentar quantidade" onClick={() => setQuantity(item.key, item.quantity + 1)} className="h-8 w-8 hover:bg-stone">+</button>
                </div>
              </div>

              <div className="text-right">
                {item.discount > 0 && (
                  <p className="text-xs text-ink/40 line-through">{formatPrice(item.product.price * item.quantity)}</p>
                )}
                <p className="font-medium">{formatPrice(unitPrice(item) * item.quantity)}</p>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
