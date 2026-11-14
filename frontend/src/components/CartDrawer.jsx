import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";
import CartLines from "./CartLines";

export default function CartDrawer() {
  const { open, setOpen, items, count, subtotal, savings } = useCart();
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, setOpen]);

  return (
    <>
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-ink/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Sacola"
        inert={!open}
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <h2 className="font-serif text-3xl">Sacola <span className="text-lg text-ink/50">({count})</span></h2>
          <button type="button" onClick={close} aria-label="Fechar sacola" className="h-9 w-9 text-2xl leading-none hover:bg-stone">×</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          <CartLines onNavigate={close} />
        </div>

        {items.length > 0 && (
          <div className="border-t border-ink/10 px-6 py-5">
            {savings > 0 && (
              <p className="mb-2 flex justify-between text-sm text-accent">
                <span>Economia nos combos</span>
                <span>−{formatPrice(savings)}</span>
              </p>
            )}
            <p className="flex justify-between text-lg">
              <span>Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </p>
            <Link
              to="/checkout"
              onClick={close}
              className="mt-4 block bg-ink py-4 text-center text-sm font-medium text-paper transition-colors hover:bg-accent"
            >
              Finalizar compra
            </Link>
            <button type="button" onClick={close} className="mt-3 w-full text-center text-sm text-ink/60 underline">
              Continuar comprando
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
