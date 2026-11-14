import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";
import CartLines from "../components/CartLines";

export default function Cart() {
  const { items, subtotal, savings } = useCart();

  return (
    <section className="page max-w-3xl">
      <h1 className="font-serif text-5xl">Sacola</h1>
      <div className="mt-8">
        <CartLines />
      </div>
      {items.length > 0 && (
        <div className="mt-6 border-t border-ink/10 pt-6">
          {savings > 0 && (
            <p className="mb-2 flex justify-between text-accent">
              <span>Economia nos combos</span>
              <span>−{formatPrice(savings)}</span>
            </p>
          )}
          <p className="flex justify-between text-xl">
            <span>Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </p>
          <Link
            to="/checkout"
            className="mt-6 block bg-ink py-4 text-center text-sm font-medium text-paper transition-colors hover:bg-accent"
          >
            Finalizar compra
          </Link>
        </div>
      )}
    </section>
  );
}
