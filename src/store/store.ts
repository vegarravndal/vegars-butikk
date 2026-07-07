import { create } from "zustand";
import { Product, CartItem, Store } from "../types/types";

// Load cart data from localStorage on initial load with error handling
const loadCartFromLocalStorage = (): CartItem[] => {
  const storedCart = localStorage.getItem("cart");
  try {
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Error loading cart from localStorage", error);
    return [];
  }
};

// Save cart data to localStorage whenever it changes
const saveCartToLocalStorage = (cart: CartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const useStore = create<Store>((set) => {
  const initialState: Store = {
    cart: loadCartFromLocalStorage(), // Initialize cart with data from localStorage
    selectedCategory: null,
    // Local fallback products while remote fetch completes
    originalProducts: [
      {
        id: "1",
        name: "Laptop",
        category: "electronics",
        price: 999,
        imageUrl: "/images/1.jpg",
        description:
          "A high-performance laptop with a powerful processor, perfect for gaming and productivity.",
      },
      {
        id: "2",
        name: "High heels",
        category: "clothing",
        price: 79,
        imageUrl: "/images/2.jpg",
        description:
          "Elegant and stylish, these high heels add the perfect touch of sophistication to any outfit—designed for both comfort and confidence, from day to night.",
      },
      {
        id: "3",
        name: "Organic cleaner",
        category: "home",
        price: 14,
        imageUrl: "/images/3.jpg",
        description:
          "Our Eco-friendly Organic Cleaner effectively tackles dirt and stains without harmful chemicals. Safe for your home and the planet, it cleans all surfaces while leaving a fresh, natural scent. Clean smarter with a healthier, sustainable solution!",
      },
    ],
    products: [], // will be set to originalProducts or remote data

    addToCart: (product: Product, quantity: number) =>
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
        return { cart: newCart };
      }),

    removeFromCart: (id: string) =>
      set((state) => {
        const newCart = state.cart.filter((item) => item.id !== id);
        saveCartToLocalStorage(newCart);
        return { cart: newCart };
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

  // Ensure initial store includes the fallback products (avoid overwriting with return)

  // Async fetch from DummyJSON (overrides fallback if successful)
  (async function fetchRemoteProducts() {
    try {
      const res = await fetch('https://dummyjson.com/products?limit=100');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // helper to map many remote categories into the app's primary categories
      const mapMainCategory = (cat: string | undefined) => {
        const c = (cat || '').toLowerCase();
        if (/(phone|mobile|laptop|computer|electronics|mobile|accessories|headphone|audio|fragrances|mobile-accessories|mens-watches|mens-shoes|electronics)/.test(c)) return 'electronics';
        if (/(shirt|clothing|mens|womens|beauty|makeup|shoes|apparel|eyeshadow|lipstick|nail|mens-shirts|mens-tshirts)/.test(c)) return 'clothing';
        if (/(home|furniture|kitchen|groceries|grocery|food|home-decoration|kitchen-accessories|garden)/.test(c)) return 'home';
        return 'other';
      };

      const mapped: Product[] = (data.products || []).map((p: any) => {
        const category = p.category || p.mainCategory || 'other';
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
