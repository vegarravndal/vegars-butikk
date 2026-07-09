import { useState } from "react";
import { useStore } from "../store/store";
import { getCategoryDisplayName } from "../utils/categoryNames";
import { FaMinus, FaFilter, FaTimes } from "react-icons/fa"; // Lagt til ikoner

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
  const [isOpen, setIsOpen] = useState(false); // Stat for mobil-meny (åpen/lukket)

  const { originalProducts } = useStore();
  const set = new Set(originalProducts.map((p) => p.mainCategory || p.category));
  const primaryOrder = ["accessories", "clothing", "home"];
  const categories = [
    ...primaryOrder.filter((c) => set.has(c)),
    ...Array.from(set).filter((c) => !primaryOrder.includes(c)),
  ];

  // Helper for å lukke menyen på mobil etter man har valgt noe
  const handleCategoryClick = (category: string | null) => {
    onCategoryChange(category);
    setIsOpen(false); 
  };

  const handleApplyFilterClick = () => {
    onPriceFilterChange(minPrice, maxPrice);
    setIsOpen(false);
  };

  const handleSortClick = (order: "price-asc" | "price-desc") => {
    onSortChange(order);
    setIsOpen(false);
  };

  return (
    <>
      {/* MOBIL-KNAPP: Vises kun på små skjermer (< md) */}
      <div className="w-full md:hidden pt-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-800 font-medium py-2.5 px-4 rounded-lg border border-gray-200 active:bg-gray-200 transition"
        >
          <FaFilter size={14} />
          Filters & Sort
        </button>
      </div>

      {/* OVERLAY & SIDEBAR-CONTAINER */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          md:relative md:transform-none md:z-0 md:w-64 lg:w-56 xl:w-64 md:bg-transparent md:shadow-none md:flex-shrink-0
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Lukkeknapp på mobil */}
        <div className="flex items-center justify-between p-4 border-b md:hidden">
          <span className="font-bold text-lg">Filters</span>
          <button onClick={() => setIsOpen(false)} className="p-1 text-gray-500">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Innholdet i sidebaren */}
        <div className="p-4 sm:p-6 h-full overflow-y-auto md:overflow-visible">
          {/* Categories */}
          <h2 className="text-lg font-semibold mb-1 text-gray-900">Categories</h2>
          <FaMinus className="text-gray-300 mb-3" size={12} />
          <ul className="space-y-2">
            <li>
              <button
                className={`text-left w-full cursor-pointer text-sm py-1 ${
                  selectedCategory === null
                    ? "text-blue-600 font-semibold"
                    : "text-gray-600 hover:text-blue-500"
                }`}
                onClick={() => handleCategoryClick(null)}
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
                  <div className="flex items-center justify-between py-1">
                    <button
                      className={`text-left w-full cursor-pointer text-sm ${
                        selectedCategory === category
                          ? "text-blue-600 font-semibold"
                          : "text-gray-600 hover:text-blue-500"
                      }`}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {getCategoryDisplayName(category)}
                    </button>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {items.length}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Sort */}
          <h2 className="text-lg font-semibold mt-6 mb-1 text-gray-900">Sort Products</h2>
          <FaMinus className="text-gray-300 mb-3" size={12} />
          <ul className="space-y-2 text-sm text-gray-600">
            <li
              className="cursor-pointer hover:text-blue-500 py-1"
              onClick={() => handleSortClick("price-asc")}
            >
              Price (Low to High)
            </li>
            <li
              className="cursor-pointer hover:text-blue-500 py-1"
              onClick={() => handleSortClick("price-desc")}
            >
              Price (High to Low)
            </li>
          </ul>

          {/* Price */}
          <h2 className="text-lg font-semibold mt-6 mb-1 text-gray-900">Price</h2>
          <FaMinus className="text-gray-300 mb-3" size={12} />
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <label className="text-gray-500 w-8">Min</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="p-1.5 border border-gray-300 rounded w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-gray-500 w-8">Max</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="p-1.5 border border-gray-300 rounded w-full focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleApplyFilterClick}
              className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 active:bg-blue-800 transition"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </aside>

      {/* Bakgrunns-skygge (Backdrop) når filteret er åpent på mobil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;