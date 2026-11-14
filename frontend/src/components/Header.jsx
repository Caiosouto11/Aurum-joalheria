import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors hover:text-accent ${
    isActive ? "text-accent" : "text-ink/70"
  }`;

export default function Header() {
  const { count, setOpen } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="font-serif text-3xl tracking-wide text-ink">
          Aurum
        </Link>

        <nav className="flex items-center gap-7">
          <NavLink to="/" end className={linkClass}>
            Início
          </NavLink>
          <NavLink to="/catalogo" className={linkClass}>
            Catálogo
          </NavLink>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 text-sm font-medium text-ink/70 transition-colors hover:text-accent"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M5 8h14l-1 12H6L5 8Z" strokeLinejoin="round" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
            </svg>
            Sacola
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-xs text-paper" aria-label={`${count} itens`}>
              {count}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
