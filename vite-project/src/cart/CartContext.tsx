import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Product } from '../types';

interface CartItem { product: Product; qty: number }
interface CartState {
  items: CartItem[];
  add: (product: Product, qty?: number) => boolean;
  remove: (productId: number) => void;
  clear: () => void;
  inc: (productId: number) => boolean;
  dec: (productId: number) => void;
}

const CartContext = createContext<CartState | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    const raw = localStorage.getItem('cart');
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as CartItem[];
        setItems(parsed);
      } catch {
        setItems([]);
      }
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  function add(product: Product, qty: number = 1) {
    let ok = true;
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        const desired = existing.qty + qty;
        if (desired > product.stock) {
          ok = false;
          return prev;
        }
        return prev.map((i) => (i.product.id === product.id ? { ...i, qty: desired } : i));
      }
      if (qty > product.stock) {
        ok = false;
        return prev;
      }
      return [...prev, { product, qty }];
    });
    return ok;
  }
  function remove(productId: number) {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }
  function clear() {
    setItems([]);
  }
  function inc(productId: number) {
    let ok = true;
    setItems((prev) => prev.map((i) => {
      if (i.product.id !== productId) return i;
      if (i.qty >= i.product.stock) {
        ok = false;
        return i;
      }
      return { ...i, qty: i.qty + 1 };
    }));
    return ok;
  }
  function dec(productId: number) {
    setItems((prev) => prev.flatMap((i) => {
      if (i.product.id !== productId) return [i];
      const nextQty = i.qty - 1;
      if (nextQty <= 0) return [];
      return [{ ...i, qty: nextQty }];
    }));
  }
  const value = useMemo<CartState>(() => ({ items, add, remove, clear, inc, dec }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('CartContext');
  return ctx;
}
