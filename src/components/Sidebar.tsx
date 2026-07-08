import { useState } from "react";
import { useStore } from "../store/store";
import { getCategoryDisplayName } from "../utils/categoryNames";
import { FaMinus } from "react-icons/fa";

type SidebarProps = {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  onPriceFilterChange: (minPrice: number, maxPrice: number) => void;
  onSortChange: (sortOrder: "price-asc" | "price-desc") => void;
};

const Sidebar = ({
  selectedCategory,
  onCategoryChange,
  onPriceFilterChange,
  onSortChange,
}: SidebarProps) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  // derive categories dynamically from products (use mainCategory when available)
  const { originalProducts } = useStore();
  const set = new Set(originalProducts.map((p) => p.mainCategory || p.category));
  const primaryOrder = ["accessories", "clothing", "home"];
  const categories = [
    ...primaryOrder.filter((c) => set.has(c)),
    ...Array.from(set).filter((c) => !primaryOrder.includes(c)),
  ];



  return (
    <aside className="w-64">
      <div className="p-4 sm:p-6">
        {/* Categories */}
        <h2 className="text-xl font-semibold mb-2">Categories</h2>
        <FaMinus className="text-gray-300 mb-4" />
        <ul className="space-y-2">
          <li>
            <button
              className={`text-left w-full cursor-pointer ${
                selectedCategory === null
                  ? "text-blue-500 font-semibold"
                  : "text-gray-700 hover:text-blue-500"
              }`}
              onClick={() => onCategoryChange(null)}
            >
              All Categories
            </button>
          </li>

          {categories.map((category) => {
            const items = originalProducts.filter(
              (p) => (p.mainCategory || p.category) === category
            );
            return (
              <li key={category}>
                <div className="flex items-center justify-between">
                  <button
                    className={`text-left w-full cursor-pointer ${
                      selectedCategory === category
                        ? "text-blue-500 font-semibold"
                        : "text-gray-700 hover:text-blue-500"
                    }`}
                    onClick={() => onCategoryChange(category)}
                  >
                    {getCategoryDisplayName(category)}
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{items.length}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Sort */}
        <h2 className="text-xl font-semibold mt-6 mb-2">Sort Products</h2>
        <FaMinus className="text-gray-300 mb-4" />
        <ul className="space-y-2">
          <li
            className="cursor-pointer text-gray-700 hover:text-blue-500"
            onClick={() => onSortChange("price-asc")}
          >
            Price (Low to High)
          </li>
          <li
            className="cursor-pointer text-gray-700 hover:text-blue-500"
            onClick={() => onSortChange("price-desc")}
          >
            Price (High to Low)
          </li>
        </ul>

        {/* Price */}
        <h2 className="text-xl font-semibold mt-6 mb-2">Price</h2>
        <FaMinus className="text-gray-300 mb-4" />
        <div className="space-y-2">
          <div className="flex items-center">
            <label className="mr-2">Min</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="p-1 border rounded w-full"
            />
          </div>
          <div className="flex items-center">
            <label className="mr-2">Max</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="p-1 border rounded w-full"
            />
          </div>

          <button
            onClick={() => onPriceFilterChange(minPrice, maxPrice)}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
