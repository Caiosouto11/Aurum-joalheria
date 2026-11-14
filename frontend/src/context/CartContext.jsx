import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "aurum-cart";

const keyOf = (variantId, comboId) => `${variantId}:${comboId ?? 0}`;

export const unitPrice = (item) =>
  Math.round(item.product.price * (100 - item.discount)) / 100;

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* sem armazenamento: a sacola vale só nesta visita */
    }
  }, [items]);

  const add = useCallback(
    (product, variantId, { quantity = 1, combo = null, openDrawer = true } = {}) => {
      const key = keyOf(variantId, combo?.id);
      const stock = product.variants.find((v) => v.id === variantId)?.stock ?? 99;

      setItems((prev) => {
        const found = prev.find((i) => i.key === key);
        if (found) {
          return prev.map((i) =>
            i.key === key ? { ...i, quantity: Math.min(i.quantity + quantity, stock) } : i
          );
        }
        return [
          ...prev,
          {
            key,
            variantId,
            comboId: combo?.id ?? null,
            comboTitle: combo?.title ?? null,
            discount: combo?.discount ?? 0,
            quantity: Math.min(quantity, stock),
            product: {
              id: product.id,
              name: product.name,
              slug: product.slug,
              image: product.images[0],
              price: product.price,
              material: product.material,
              variants: product.variants.map((v) => ({ id: v.id, label: v.label, stock: v.stock })),
            },
          },
        ];
      });
      if (openDrawer) setOpen(true);
    },
    []
  );

  const remove = useCallback((key) => setItems((prev) => prev.filter((i) => i.key !== key)), []);

  const setQuantity = useCallback((key, quantity) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.key !== key) return i;
        const stock = i.product.variants.find((v) => v.id === i.variantId)?.stock ?? 99;
        return { ...i, quantity: Math.max(1, Math.min(quantity, stock)) };
      })
    );
  }, []);

  const changeVariant = useCallback((key, variantId) => {
    setItems((prev) => {
      const item = prev.find((i) => i.key === key);
      if (!item) return prev;
      const newKey = keyOf(variantId, item.comboId);
      const stock = item.product.variants.find((v) => v.id === variantId)?.stock ?? 99;
      const others = prev.filter((i) => i.key !== key);
      if (others.some((i) => i.key === newKey)) {
        return others.map((i) =>
          i.key === newKey ? { ...i, quantity: Math.min(i.quantity + item.quantity, stock) } : i
        );
      }
      return prev.map((i) =>
        i.key === key ? { ...i, key: newKey, variantId, quantity: Math.min(i.quantity, stock) } : i
      );
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const count = items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + unitPrice(i) * i.quantity, 0);
    const savings = items.reduce((sum, i) => sum + (i.product.price - unitPrice(i)) * i.quantity, 0);
    return { items, open, setOpen, add, remove, setQuantity, changeVariant, clear, count, subtotal, savings };
  }, [items, open, add, remove, setQuantity, changeVariant, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
}
