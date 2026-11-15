import { Link } from "react-router-dom";
import { useStore } from "../store/store";
import { getMainCategoryId, mainCategoryIds, categoryDisplayNames } from "../utils/categoryNames";

const PopularCategories = () => {
  const products = useStore((state) => state.originalProducts);
  const categories = mainCategoryIds.flatMap((id) => {
    const product = products.find(
      (item) => (item.mainCategory || getMainCategoryId(item.category)) === id,
    );
    return product
      ? [{ id, name: categoryDisplayNames[id], imageUrl: product.imageUrl }]
      : [];
  });

  if (categories.length === 0) return null;

  return (
    <div className="w-full pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Explore Popular Categories
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop/${category.id}`}
              className="flex w-full max-w-xs flex-col items-center justify-center border border-white/65 bg-white/35 p-5 shadow-md backdrop-blur-lg transition duration-300 hover:-translate-y-1 hover:bg-white/55 hover:shadow-xl"
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full shadow-md"
              />
              <h3 className="mt-4 font-semibold text-xl text-center">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularCategories;
