import React, { useEffect, useState } from "react";
import { Product } from "../types/types";
import { Link, useParams, useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { getCategoryDisplayName } from "../utils/categoryNames";
import Sidebar from "../components/Sidebar";
import { useStore } from "../store/store";

interface ShopState {
  selectedCategory?: string | null;
}

const Shop: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    setProducts,
    originalProducts,
    products,
    addToCart,
  } = useStore();

  const { category } = useParams();
  const location = useLocation();
  const state = location.state as ShopState | null;

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products || []);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortOrder, setSortOrder] = useState<"price-asc" | "price-desc">("price-asc");
  const [animations, setAnimations] = useState<Array<{ id: string; productId: string }>>([]);

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
        (product) => (product.mainCategory || product.category) === selectedCategory
      );
    }

    result = result.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );

    result.sort((a, b) =>
      sortOrder === "price-asc" ? a.price - b.price : b.price - a.price
    );

    setFilteredProducts(result);
    setProducts(result);
  }, [selectedCategory, minPrice, maxPrice, sortOrder, originalProducts, setProducts]);

  const handleCategoryChange = (category: string | null) => setSelectedCategory(category);
  const handlePriceFilterChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };
  const handleSortChange = (order: "price-asc" | "price-desc") => setSortOrder(order);

  const handleAddToCart = (product: Product, quantity: number) => {
    addToCart(product, quantity);
    const animationId = `${product.id}-${Date.now()}`;
    setAnimations((prev) => [...prev, { id: animationId, productId: product.id }]);

    setTimeout(() => {
      setAnimations((prev) => prev.filter((anim) => anim.id !== animationId));
    }, 1500);
  };

  return (
    // Endret til flex-col på mobil, flex-row på md og oppover
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start max-w-7xl mx-auto w-full px-4">
      {/* Sidebar / Filtermeny */}
      <Sidebar
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        onPriceFilterChange={handlePriceFilterChange}
        onSortChange={handleSortChange}
      />

      {/* Produkter */}
      <main className="flex-1 w-full py-4 md:py-8 overflow-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 md:mb-8 text-center md:text-left">
          Shop
        </h1>

        {filteredProducts.length === 0 ? (
          <div className="text-gray-700 text-center py-12">No products available</div>
        ) : (
          (() => {
            const primary = ["accessories", "clothing", "home"];
            const others = Array.from(
              new Set(
                filteredProducts
                  .map((p) => p.mainCategory || p.category)
                  .filter((c) => !primary.includes(c))
              )
            );
            const categoriesToShow = [...primary, ...others];

            return (
              <div className="space-y-10">
                {categoriesToShow.map((cat) => {
                  const items = filteredProducts.filter(
                    (p) => (p.mainCategory || p.category) === cat
                  );
                  if (items.length === 0) return null;
                  return (
                    <section key={cat}>
                      <h2 className="text-xl md:text-2xl font-semibold mb-4 capitalize border-b pb-2 text-gray-800">
                        {getCategoryDisplayName(cat)}
                      </h2>
                      {/* Grid tilpasset mobil (2 kolonner) og opp til desktop (4-5 kolonner) */}
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
                                className="relative bg-black text-white p-2 rounded-md hover:bg-gray-800 transition flex items-center justify-center"
                                title="Add to Cart"
                              >
                                <FaShoppingCart size={13} />
                                {animations
                                  .filter((anim) => anim.productId === product.id)
                                  .map((anim) => (
                                    <div
                                      key={anim.id}
                                      className="absolute inset-0 flex items-center justify-center animate-cart-pulse text-white bg-red-500 rounded font-bold text-sm"
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