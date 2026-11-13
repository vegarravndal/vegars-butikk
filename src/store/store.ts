import { create } from "zustand";
import { Product, CartItem, Store } from "../types/types";
import { authenticatedFetch, GetToken } from "../utils/api";

// Hjelpefunksjon for å lagre til MongoDB i bakgrunnen
const syncCartToMongoDB = async (getToken: GetToken, cart: CartItem[]) => {
  try {
    const response = await authenticatedFetch(getToken, "/api/cart", {
      method: "PUT",
      body: JSON.stringify({
        items: cart,
      }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    console.log("✅ Handlevogn synkronisert med MongoDB");
  } catch (error) {
    console.error("❌ Kunne ikke synkronisere handlevogn med MongoDB:", error);
  }
};

const loadCartFromLocalStorage = (): CartItem[] => {
  const storedCart = localStorage.getItem("cart");
  try {
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Error loading cart from localStorage", error);
    return [];
  }
};

const saveCartToLocalStorage = (cart: CartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Definerer et utvidet grensesnitt for å fjerne alle "any"-feil
interface ExtendedStore extends Store {
  addToCartWithUser: (product: Product, quantity: number, getToken?: GetToken) => void;
  removeFromCartWithUser: (id: string, getToken?: GetToken) => void;
  clearCartWithUser: (getToken?: GetToken) => void;
}

export const useStore = create<ExtendedStore>((set) => {
  const initialState: ExtendedStore = {
    cart: loadCartFromLocalStorage(),
    selectedCategory: null,
    originalProducts: [
      {
        id: "1",
        name: "Laptop",
        category: "electronics",
        price: 999,
        imageUrl: "/images/1.jpg",
        description: "A high-performance laptop with a powerful processor, perfect for gaming and productivity.",
      },
      {
        id: "2",
        name: "High heels",
        category: "clothing",
        price: 79,
        imageUrl: "/images/2.jpg",
        description: "Elegant and stylish, these high heels add the perfect touch of sophistication to any outfit.",
      },
      {
        id: "3",
        name: "Organic cleaner",
        category: "home",
        price: 14,
        imageUrl: "/images/3.jpg",
        description: "Our Eco-friendly Organic Cleaner effectively tackles dirt and stains without harmful chemicals.",
      },
    ],
    products: [],

    // Gamle funksjoner peker direkte til de nye for å unngå "defined but never used"-feil
    addToCart: (product: Product, quantity: number) => {
      // Fallback uten bruker lagrer kun lokalt
      set((state) => {
        const existingItem = state.cart.find((item) => item.id === product.id);
        let newCart;
        if (existingItem) {
          newCart = state.cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          );
        } else {
          newCart = [...state.cart, { ...product, quantity }];
        }
        saveCartToLocalStorage(newCart);
        return { cart: newCart };
      });
    },
    removeFromCart: (id: string) => {
      set((state) => {
        const newCart = state.cart.filter((item) => item.id !== id);
        saveCartToLocalStorage(newCart);
        return { cart: newCart };
      });
    },
    clearCart: () => {
      saveCartToLocalStorage([]);
      set({ cart: [] });
    },

    // These functions persist the cart when a signed-in Clerk token getter is provided.
    addToCartWithUser: (product: Product, quantity: number, getToken?: GetToken) =>
      set((state) => {
        const existingItem = state.cart.find((item) => item.id === product.id);
        let newCart;
        if (existingItem) {
          newCart = state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newCart = [...state.cart, { ...product, quantity }];
        }
        saveCartToLocalStorage(newCart);
        if (getToken) void syncCartToMongoDB(getToken, newCart);
        return { cart: newCart };
      }),

    removeFromCartWithUser: (id: string, getToken?: GetToken) =>
      set((state) => {
        const newCart = state.cart.filter((item) => item.id !== id);
        saveCartToLocalStorage(newCart);
        if (getToken) void syncCartToMongoDB(getToken, newCart);
        return { cart: newCart };
      }),

    clearCartWithUser: (getToken?: GetToken) =>
      set(() => {
        saveCartToLocalStorage([]);
        if (getToken) void syncCartToMongoDB(getToken, []);
        return { cart: [] };
      }),

    setCart: (cart: CartItem[]) => {
      saveCartToLocalStorage(cart);
      set({ cart });
    },

    setSelectedCategory: (category: string | null) =>
      set((state) => {
        const filteredProducts = category
          ? state.originalProducts.filter(
              (product) => (product.mainCategory || product.category) === category
            )
          : state.originalProducts;
        return { selectedCategory: category, products: filteredProducts };
      }),

    setProducts: (products: Product[]) => set({ products }),

    resetFilters: () =>
      set((state) => ({
        selectedCategory: null,
        products: state.originalProducts,
      })),
  };

  (async function fetchRemoteProducts() {
    try {
      const res = await fetch('https://dummyjson.com/products?limit=100');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as { products: Array<{ id: number; title?: string; name?: string; category?: string; price: number; thumbnail: string; images?: string[]; description?: string }> };
      const mapMainCategory = (cat: string | undefined) => {
        const c = (cat || '').toLowerCase();
        if (/(phone|mobile|laptop|computer|electronics|audio|watches|shoes)/.test(c)) return 'accessories';
        if (/(shirt|clothing|mens|womens|beauty|makeup|eyeshadow|lipstick|apparel)/.test(c)) return 'clothing';
        if (/(home|furniture|kitchen|groceries|decor)/.test(c)) return 'home';
        return 'other';
      };

      const mapped: Product[] = (data.products || []).map((p) => {
        const category = p.category || 'other';
        return {
          id: String(p.id),
          name: p.title || p.name || '',
          category,
          mainCategory: mapMainCategory(category),
          price: Number(p.price) || 0,
          imageUrl: p.thumbnail || (p.images && p.images[0]) || '/images/1.jpg',
          description: p.description || '',
        } as Product;
      });
      if (mapped.length > 0) {
        set({ originalProducts: mapped, products: mapped });
      }
    } catch (error) {
      console.error('Failed to fetch products from remote API', error);
    }
  })();

  return { ...initialState, products: initialState.originalProducts };
});
