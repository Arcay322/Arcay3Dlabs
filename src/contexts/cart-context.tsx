'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant } from '@/lib/firebase/types';

export interface CartItem extends Product {
  quantity: number;
  /** Variante seleccionada (si el producto tiene variantes) */
  selectedVariant?: ProductVariant;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'arcay3dlabs_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setItems(parsed);
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addItem = (product: Product, quantity: number = 1, variant?: ProductVariant) => {
    setItems((prevItems) => {
      // Clave única: productId + variantId
      const itemKey = variant ? `${product.id}_${variant.id}` : product.id;
      const existingItem = prevItems.find((item) => {
        const existingKey = item.selectedVariant ? `${item.id}_${item.selectedVariant.id}` : item.id;
        return existingKey === itemKey;
      });

      // Stock máximo: usar stock de la variante si existe, o del producto
      const maxStock = variant ? variant.stock : product.stock;
      // Precio: aplicar ajuste de variante si existe
      const itemPrice = variant ? product.price + (variant.priceAdjustment || 0) : product.price;

      if (existingItem) {
        return prevItems.map((item) => {
          const existingKey = item.selectedVariant ? `${item.id}_${item.selectedVariant.id}` : item.id;
          return existingKey === itemKey
            ? { ...item, quantity: Math.min(item.quantity + quantity, maxStock), price: itemPrice }
            : item;
        });
      } else {
        return [...prevItems, {
          ...product,
          price: itemPrice,
          quantity: Math.min(quantity, maxStock),
          selectedVariant: variant,
        }];
      }
    });
  };

  const removeItem = (productId: string, variantId?: string) => {
    setItems((prevItems) => prevItems.filter((item) => {
      if (variantId) {
        return !(item.id === productId && item.selectedVariant?.id === variantId);
      }
      return item.id !== productId || item.selectedVariant !== undefined;
    }));
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        const matches = variantId
          ? item.id === productId && item.selectedVariant?.id === variantId
          : item.id === productId && !item.selectedVariant;
        if (!matches) return item;

        const maxStock = item.selectedVariant ? item.selectedVariant.stock : item.stock;
        return { ...item, quantity: Math.min(quantity, maxStock) };
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
