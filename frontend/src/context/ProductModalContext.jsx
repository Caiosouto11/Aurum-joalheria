import { createContext, useCallback, useContext, useState } from "react";
import ProductModal from "../components/ProductModal";

const ProductModalContext = createContext(null);

export function ProductModalProvider({ children }) {
  const [product, setProduct] = useState(null);
  const close = useCallback(() => setProduct(null), []);

  return (
    <ProductModalContext.Provider value={{ openProduct: setProduct }}>
      {children}
      <ProductModal product={product} onClose={close} />
    </ProductModalContext.Provider>
  );
}

export function useProductModal() {
  const ctx = useContext(ProductModalContext);
  if (!ctx) throw new Error("useProductModal precisa estar dentro de <ProductModalProvider>");
  return ctx;
}
