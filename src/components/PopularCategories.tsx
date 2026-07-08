import { Link } from "react-router-dom";
import { categoryDisplayNames } from "../utils/categoryNames";

const PopularCategories = () => {
  const categories = [
    { id: "accessories", name: categoryDisplayNames.accessories, imageUrl: "/images/1.jpg" },
    { id: "clothing", name: categoryDisplayNames.clothing, imageUrl: "/images/2.jpg" },
    { id: "home", name: categoryDisplayNames.home, imageUrl: "/images/3.jpg" },
  ];

  return (
    <div className="w-full mb-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Explore Popular Categories
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop/${category.id}`}
              className="flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105"
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

        {/* Ekstra margin under grid */}
        <div className="mt-8"></div>
      </div>
    </div>
  );
};

export default PopularCategories;
