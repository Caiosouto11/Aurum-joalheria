import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api";
import ProductDetail from "../components/ProductDetail";

export default function Product() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    api
      .get(`/products/${slug}`)
      .then((res) => {
        if (cancelled) return;
        setProduct(res.data);
        setStatus("ready");
      })
      .catch((err) => !cancelled && setStatus(err.response?.status === 404 ? "notfound" : "error"));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <section className="page">
      <Link to="/catalogo" className="mb-8 inline-block text-sm text-ink/60 hover:text-accent">
        Voltar ao catálogo
      </Link>
      {status === "loading" && <p className="text-ink/60">Carregando...</p>}
      {status === "notfound" && <p>Peça não encontrada.</p>}
      {status === "error" && <p>Não foi possível carregar a peça. Confira se a API está rodando.</p>}
      {status === "ready" && <ProductDetail key={product.id} product={product} />}
    </section>
  );
}
