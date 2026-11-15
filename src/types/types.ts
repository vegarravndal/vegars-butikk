import type { MainCategoryId } from "../utils/categoryNames";

// Product type with id as string (consistent with the store)
export interface Product {
  id: string; // id as string
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  description: string; // Add description field
  code?: string;
  mainCategory?: MainCategoryId | "other";
}

// CartItem extends Product with quantity
export interface CartItem extends Product {
  quantity: number;
}

// Store type definition
export interface Store {
  cart: CartItem[];
  products: Product[];
  originalProducts: Product[];
  productsLoaded: boolean;
  productsError: string | null;
  selectedCategory: string | null;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  setCart: (cart: CartItem[]) => void;
  setSelectedCategory: (category: string | null) => void;
  setProducts: (products: Product[]) => void;
  resetFilters: () => void;
}
