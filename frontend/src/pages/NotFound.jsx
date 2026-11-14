import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="page py-20 text-center">
      <h1 className="font-serif text-5xl text-ink">404</h1>
      <p className="mt-3 text-ink/60">Essa página não existe.</p>
      <Link to="/" className="mt-6 inline-block text-accent underline">
        Voltar ao início
      </Link>
    </section>
  );
}
