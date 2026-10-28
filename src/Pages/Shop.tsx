import React, { useEffect, useState } from "react";
import { Product } from "../types/types";
import { Link, useParams, useLocation } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { useAuth } from "@clerk/clerk-react";
import { getCategoryDisplayName } from "../utils/categoryNames";
import Sidebar from "../components/Sidebar";
import { useStore } from "../store/store";
import { FaCheckCircle } from "react-icons/fa"; // Lagt til for suksessikon

interface ShopState {
  selectedCategory?: string | null;
}

const Shop: React.FC = () => {
  const { userId } = useAuth();
  const {
    selectedCategory,
    setSelectedCategory,
    setProducts,
    originalProducts,
    products,
    addToCartWithUser,
  } = useStore();

  const { category } = useParams();
  const location = useLocation();
  const state = location.state as ShopState | null;

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(
    products || [],
  );
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortOrder, setSortOrder] = useState<"price-asc" | "price-desc">(
    "price-asc",
  );
  const [animations, setAnimations] = useState<
    Array<{ id: string; productId: string }>
  >([]);

  // Ny state for å holde styr på aktiv popup-melding
  const [activeToast, setActiveToast] = useState<{
    id: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    } else if (state?.selectedCategory !== undefined) {
      setSelectedCategory(state.selectedCategory);
    } else {
      setSelectedCategory(null);
    }
  }, [category, state?.selectedCategory, setSelectedCategory]);

  useEffect(() => {
    let result = [...originalProducts];

    if (selectedCategory) {
      result = result.filter(
        (product) =>
          (product.mainCategory || product.category) === selectedCategory,
      );
    }

    result = result.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice,
    );

    result.sort((a, b) =>
      sortOrder === "price-asc" ? a.price - b.price : b.price - a.price,
    );

    setFilteredProducts(result);
    setProducts(result);
  }, [
    selectedCategory,
    minPrice,
    maxPrice,
    sortOrder,
    originalProducts,
    setProducts,
  ]);

  const handleCategoryChange = (category: string | null) =>
    setSelectedCategory(category);
  const handlePriceFilterChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };
  const handleSortChange = (order: "price-asc" | "price-desc") =>
    setSortOrder(order);

  const handleAddToCart = (product: Product, quantity: number) => {
    addToCartWithUser(product, quantity, userId);

    const timestamp = Date.now();
    const animationId = `${product.id}-${timestamp}`;
    setAnimations((prev) => [
      ...prev,
      { id: animationId, productId: product.id },
    ]);

    // Trigger toast-varsel med produktnavn
    setActiveToast({ id: timestamp, name: product.name });

    // Skjul animasjon etter 1.5 sekunder
    setTimeout(() => {
      setAnimations((prev) => prev.filter((anim) => anim.id !== animationId));
    }, 1500);

    // Skjul toast automatisk etter 3 sekunder
    setTimeout(() => {
      setActiveToast((current) => (current?.id === timestamp ? null : current));
    }, 3000);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start max-w-7xl mx-auto w-full px-4 relative">
      {/* Toast Notification for mobil og desktop */}
      <div
        className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 w-[90%] sm:w-auto transition-all duration-300 font-medium ${
          activeToast
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 translate-y-4 invisible"
        }`}
      >
        <FaCheckCircle className="text-green-400 text-xl shrink-0" />
        <span className="text-sm truncate">
          {activeToast?.name} lagt til i handlekurven!
        </span>
      </div>

      <Sidebar
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        onPriceFilterChange={handlePriceFilterChange}
        onSortChange={handleSortChange}
      />

      <main className="flex-1 w-full py-4 md:py-8 overflow-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 md:mb-8 text-center md:text-left">
          Shop
        </h1>

        {filteredProducts.length === 0 ? (
          <div className="text-gray-700 text-center py-12">
            No products available
          </div>
        ) : (
          (() => {
            const primary = ["accessories", "clothing", "home"];
            const others = Array.from(
              new Set(
                filteredProducts
                  .map((p) => p.mainCategory || p.category)
                  .filter((c) => !primary.includes(c)),
              ),
            );
            const categoriesToShow = [...primary, ...others];

            return (
              <div className="space-y-10">
                {categoriesToShow.map((cat) => {
                  const items = filteredProducts.filter(
                    (p) => (p.mainCategory || p.category) === cat,
                  );
                  if (items.length === 0) return null;
                  return (
                    <section key={cat}>
                      <h2 className="text-xl md:text-2xl font-semibold mb-4 capitalize border-b pb-2 text-gray-800">
                        {getCategoryDisplayName(cat)}
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                        {items.map((product) => (
                          <div
                            key={product.id}
                            className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col h-full min-h-[280px]"
                          >
                            <Link
                              to={`/product/${product.id}`}
                              state={{ fromCategory: selectedCategory }}
                              className="block flex-1"
                            >
                              <img
                                src={product.imageUrl || "/fallback.jpg"}
                                alt={product.name}
                                className="w-full aspect-square object-cover mb-2 rounded-md"
                              />
                              <h3 className="text-xs md:text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                                {product.name}
                              </h3>
                            </Link>

                            <div className="mt-2 flex items-center justify-between gap-1 pt-2 border-t border-gray-50">
                              <p className="text-xs md:text-sm font-bold text-gray-900">
                                ${product.price}
                              </p>

                              <button
                                onClick={() => handleAddToCart(product, 1)}
                                className="relative bg-blue-600 text-white w-10 h-10 rounded-full hover:bg-blue-700 transition flex items-center justify-center shadow-md focus:outline-none"
                                title="Legg i handlekurv"
                              >
                                <FiShoppingCart size={18} />

                                {animations
                                  .filter(
                                    (anim) => anim.productId === product.id,
                                  )
                                  .map((anim) => (
                                    <div
                                      key={anim.id}
                                      className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full shadow-sm animate-cart-pulse"
                                    >
                                      1
                                    </div>
                                  ))}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            );
          })()
        )}
      </main>
    </div>
  );
};

export default Shop;
