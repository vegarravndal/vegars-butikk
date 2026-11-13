import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/store";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

const bgColors = [
  "bg-gray-100",
  "bg-blue-100",
  "bg-rose-100",
];

const HeroBanner: React.FC = () => {
  const { originalProducts } = useStore();
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const featuredProducts = useMemo(
    () => originalProducts.slice(0, 3),
    [originalProducts]
  );

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
  }, [featuredProducts.length]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  if (!featuredProducts.length) {
    return <div className="p-10 text-center">No products available!</div>;
  }

  return (
    <section className="relative w-full overflow-hidden mt-4 md:mt-0">
      {/* Slider */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {featuredProducts.map((product: Product, index: number) => (
          <div
            key={product.id}
            className={`flex-none w-full h-[420px] ${
              bgColors[index % bgColors.length]
            }`}
          >
            <div className="max-w-7xl mx-auto h-full px-6 flex flex-col md:flex-row items-center justify-between">
              {/* Text */}
              <div className="max-w-md text-center md:text-left">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  {product.name}
                </h2>
                <p className="text-xl mb-6">${product.price}</p>
                <Link
                  to={`/product/${product.id}`}
                  className="inline-block bg-black text-white px-6 py-3 hover:bg-gray-800 transition"
                >
                  View product
                </Link>
              </div>

              {/* Image */}
              <div className="mt-6 md:mt-0">
                <img
                  src={product.imageUrl || "/fallback.jpg"}
                  alt={product.name}
                  className="max-h-[300px] w-auto object-contain"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots inside hero */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
        {featuredProducts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full transition ${
              currentIndex === idx
                ? "bg-black scale-110"
                : "bg-black/40 hover:bg-black/60"
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;
