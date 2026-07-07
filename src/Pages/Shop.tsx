import React, { useEffect, useState } from "react";
import { Product } from "../types/types";
import { Link, useParams, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useStore } from "../store/store";

// Type for location.state
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
  const [sortOrder, setSortOrder] = useState<"price-asc" | "price-desc">(
    "price-asc"
  );

  /**
   * Sett valgt kategori:
   * 1. Fra URL (/shop/:category)
   * 2. Fra location.state (breadcrumb / navigasjon)
   * 3. Ellers: null = All categories
   */
  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    } else if (state?.selectedCategory !== undefined) {
      setSelectedCategory(state.selectedCategory);
    } else {
      setSelectedCategory(null);
    }
  }, [category, state?.selectedCategory, setSelectedCategory]);

  /**
   * Filtrering + sortering
   */
  useEffect(() => {
    let result = [...originalProducts];

    // Kategori (bruk mainCategory når tilgjengelig)
    if (selectedCategory) {
      result = result.filter(
        (product) => (product.mainCategory || product.category) === selectedCategory
      );
    }

    // Pris
    result = result.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );

    // Sortering
    result.sort((a, b) =>
      sortOrder === "price-asc" ? a.price - b.price : b.price - a.price
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

  // Sidebar handlers
  const handleCategoryChange = (category: string | null) =>
    setSelectedCategory(category);

  const handlePriceFilterChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleSortChange = (order: "price-asc" | "price-desc") =>
    setSortOrder(order);

  return (
    <div className="flex flex-row gap-6 items-start">
      {/* Sidebar */}
      <Sidebar
  selectedCategory={selectedCategory}
  onCategoryChange={handleCategoryChange}
  onPriceFilterChange={handlePriceFilterChange}
  onSortChange={handleSortChange}
/>


      {/* Produkter */}
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-left">
          Shop
        </h1>

        {filteredProducts.length === 0 ? (
          <div className="text-gray-700 text-center">No products available</div>
        ) : (
          // Group products by categories: prefer primary categories, then any others
          (() => {
            const primary = ["electronics", "clothing", "home"];
            const others = Array.from(
              new Set(
                filteredProducts
                  .map((p) => p.mainCategory || p.category)
                  .filter((c) => !primary.includes(c))
              )
            );
            const categoriesToShow = [...primary, ...others];

            return (
              <div className="space-y-8">
                {categoriesToShow.map((cat) => {
                  const items = filteredProducts.filter(
                    (p) => (p.mainCategory || p.category) === cat
                  );
                  if (items.length === 0) return null;
                  return (
                    <section key={cat}>
                      <h2 className="text-2xl font-semibold mb-4 capitalize">{cat}</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {items.map((product) => (
                          <div
                            key={product.id}
                            className="p-4 bg-white rounded shadow hover:shadow-lg transition flex flex-col h-full"
                          >
                            <Link
                              to={`/product/${product.id}`}
                              state={{ fromCategory: selectedCategory }}
                              className="block"
                            >
                              <img
                                src={product.imageUrl || "/fallback.jpg"}
                                alt={product.name}
                                className="w-full h-48 object-cover mb-4 rounded"
                              />
                              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {product.name}
                              </h3>
                            </Link>

                            <div className="mt-auto">
                              <p className="text-lg text-gray-700 mb-2">
                                ${product.price}
                              </p>

                              <button
                                onClick={() => addToCart(product, 1)}
                                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                              >
                                Add to Cart
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
