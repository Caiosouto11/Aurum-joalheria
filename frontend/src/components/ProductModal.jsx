import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ProductDetail from "./ProductDetail";

export default function ProductModal({ product, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!product) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div className="fade-in absolute inset-0 bg-ink/50" onClick={onClose} aria-hidden="true" />
      <div className="modal-in relative max-h-[92vh] w-full max-w-5xl overflow-y-auto bg-paper p-5 md:p-8">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-paper text-2xl leading-none shadow hover:bg-ink hover:text-paper"
        >
          ×
        </button>
        <ProductDetail key={product.id} product={product} onAdded={onClose} />
        <Link
          to={`/produto/${product.slug}`}
          onClick={onClose}
          className="mt-6 inline-block text-sm text-accent underline"
        >
          Abrir a página da peça
        </Link>
      </div>
    </div>
  );
}
