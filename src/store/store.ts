import { create } from "zustand";
import type { CartItem, Product, Store } from "../types/types";
import { authenticatedFetch, type GetToken } from "../utils/api";
import { getMainCategoryId } from "../utils/categoryNames";

interface ExtendedStore extends Store {
  addToCartWithUser: (product: Product, quantity: number, getToken?: GetToken) => void;
  removeFromCartWithUser: (id: string, getToken?: GetToken) => void;
  clearCartWithUser: (getToken?: GetToken) => void;
}

interface RemoteProduct {
  id: number;
  title?: string;
  name?: string;
  category?: string;
  price: number;
  thumbnail?: string;
  images?: string[];
  description?: string;
}

const loadCartFromLocalStorage = (): CartItem[] => {
  try {
    const savedCart = localStorage.getItem("cart");
    const parsedCart: unknown = savedCart ? JSON.parse(savedCart) : [];
    return Array.isArray(parsedCart) ? (parsedCart as CartItem[]) : [];
  } catch (error) {
    console.error("Could not load cart from local storage:", error);
    return [];
  }
};

const saveCartToLocalStorage = (cart: CartItem[]) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Could not save cart to local storage:", error);
  }
};

const addItem = (cart: CartItem[], product: Product, quantity: number) => {
  const existingItem = cart.find((item) => item.id === product.id);
  return existingItem
    ? cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      )
    : [...cart, { ...product, quantity }];
};

const persistCart = (cart: CartItem[], getToken?: GetToken) => {
  saveCartToLocalStorage(cart);
  if (getToken) void syncCartToMongoDB(getToken, cart);
};

const syncCartToMongoDB = async (getToken: GetToken, cart: CartItem[]) => {
  try {
    const response = await authenticatedFetch(getToken, "/api/cart", {
      method: "PUT",
      body: JSON.stringify({ items: cart }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    console.error("Could not sync cart with MongoDB:", error);
  }
};

const mapRemoteProduct = (product: RemoteProduct): Product => {
  const category = product.category || "other";
  return {
    id: String(product.id),
    name: product.title || product.name || "Unnamed product",
    category,
    mainCategory: getMainCategoryId(category),
    price: Number(product.price) || 0,
    imageUrl: product.thumbnail || product.images?.[0] || "/images/1.jpg",
    description: product.description || "",
  };
};

export const useStore = create<ExtendedStore>((set) => {
  const initialState: ExtendedStore = {
    cart: loadCartFromLocalStorage(),
    products: [],
    originalProducts: [],
    productsLoaded: false,
    productsError: null,
    selectedCategory: null,

    addToCart: (product, quantity) =>
      set((state) => {
        const cart = addItem(state.cart, product, quantity);
        persistCart(cart);
        return { cart };
      }),

    addToCartWithUser: (product, quantity, getToken) =>
      set((state) => {
        const cart = addItem(state.cart, product, quantity);
        persistCart(cart, getToken);
        return { cart };
      }),

    removeFromCart: (id) =>
      set((state) => {
        const cart = state.cart.filter((item) => item.id !== id);
        persistCart(cart);
        return { cart };
      }),

    removeFromCartWithUser: (id, getToken) =>
      set((state) => {
        const cart = state.cart.filter((item) => item.id !== id);
        persistCart(cart, getToken);
        return { cart };
      }),

    clearCart: () => {
      persistCart([]);
      set({ cart: [] });
    },

    clearCartWithUser: (getToken) => {
      persistCart([], getToken);
      set({ cart: [] });
    },

    setCart: (cart) => {
      saveCartToLocalStorage(cart);
      set({ cart });
    },

    setSelectedCategory: (category) =>
      set((state) => ({
        selectedCategory: category,
        products: category
          ? state.originalProducts.filter(
              (product) =>
                (product.mainCategory || getMainCategoryId(product.category)) === category,
            )
          : state.originalProducts,
      })),

    setProducts: (products) => set({ products }),

    resetFilters: () =>
      set((state) => ({
        selectedCategory: null,
        products: state.originalProducts,
      })),
  };

  const loadProducts = async () => {
    try {
      const response = await fetch("https://dummyjson.com/products?limit=100");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = (await response.json()) as { products: RemoteProduct[] };
      const products = (data.products || []).map(mapRemoteProduct);
      set({ originalProducts: products, products, productsLoaded: true });
    } catch (error) {
      console.error("Could not load products:", error);
      set({
        productsLoaded: true,
        productsError: "Kunne ikke laste produktene. Prøv å laste siden på nytt.",
      });
    }
  };

  void loadProducts();
  return initialState;
});
