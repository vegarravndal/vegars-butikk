import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useStore } from "../store/store";
import { Product } from "../types/types";
import {
  FaArrowLeft,
  FaStar,
  FaCheckCircle,
  FaCreditCard,
} from "react-icons/fa";

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useAuth();

  const { originalProducts, addToCartWithUser, cart } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // Ny state for å styre om "Vare lagt til"-meldingen skal vises
  const [showToast, setShowToast] = useState<boolean>(false);

  // Review & rating state
  const [reviewText, setReviewText] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [submittedReviews, setSubmittedReviews] = useState<
    { text: string; rating: number }[]
  >([]);

  useEffect(() => {
    if (id) {
      const foundProduct = originalProducts.find((p) => p.id === id);
      if (foundProduct) setProduct(foundProduct);
    }
  }, [id, originalProducts]);

  // Håndterer klikk på "Add to Cart" og trigger popup-meldingen
  const handleAddToCart = () => {
    if (!product) return;

    addToCartWithUser(product, quantity, userId);

    // Vis meldingen
    setShowToast(true);

    // Skjul meldingen automatisk etter 4 sekunder (litt lenger siden det er en knapp der nå)
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewText && rating > 0) {
      setSubmittedReviews([...submittedReviews, { text: reviewText, rating }]);
      setReviewText("");
      setRating(0);
    }
  };

  if (!product)
    return <p className="text-gray-700 text-center p-6">Product not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 relative">
      {/* Toast-varsel for mobil og desktop med "Gå til kassen"-knapp */}
      <div
        className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-3.5 rounded-xl shadow-xl flex flex-col sm:flex-row items-center gap-4 w-[90%] sm:w-auto transition-all duration-300 font-medium ${
          showToast
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 translate-y-4 invisible"
        }`}
      >
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <FaCheckCircle className="text-green-400 text-xl shrink-0" />
          <span className="text-sm truncate">
            {quantity}x {product.name} lagt til i handlekurven!
          </span>
        </div>
        <button
          onClick={() => navigate("/checkout")}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-md shrink-0"
        >
          Gå til kassen
        </button>
      </div>

      {/* Tilbake-knapp */}
      {location.state?.fromCheckout && (
        <button
          onClick={() => navigate("/checkout")}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 transition font-medium text-sm"
        >
          <FaArrowLeft size={14} /> Back to Checkout
        </button>
      )}

      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        {product.name}
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-1/2 bg-gray-50 p-4 rounded-xl border flex justify-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="max-h-96 object-contain rounded"
          />
        </div>

        <div className="flex-1 w-full">
          <p className="text-lg text-gray-600 mb-4 leading-relaxed">
            {product.description}
          </p>
          <p className="text-3xl font-bold text-gray-900 mb-6">
            ${product.price}
          </p>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
                min={1}
                className="w-20 p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm flex-1 sm:flex-initial"
              >
                Add to Cart
              </button>
            </div>

            {/* Ekstra snarvei-knapp hvis det finnes varer i kurven fra før */}
            {cart.length > 0 && (
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg transition shadow-sm flex items-center justify-center gap-2"
              >
                <FaCreditCard size={14} /> Gå til kassen (
                {cart.reduce((total, item) => total + item.quantity, 0)})
              </button>
            )}
          </div>

          {/* Review & Rating Section */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Submit a Review
            </h2>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block mb-1 text-gray-700 font-medium">
                  Rating:
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="p-2 border rounded-lg bg-white w-full sm:w-auto focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value={0}>Select rating ▾</option>
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Very Good</option>
                  <option value={3}>3 - Good</option>
                  <option value={2}>2 - Fair</option>
                  <option value={1}>1 - Poor</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-gray-700 font-medium">
                  Review:
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your review here..."
                  rows={4}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={!reviewText || rating === 0}
                className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Review
              </button>
            </form>

            {/* Vising av anmeldelser */}
            {submittedReviews.length > 0 && (
              <div className="mt-8 space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Customer Reviews
                </h3>
                <div className="space-y-3">
                  {submittedReviews.map((rev, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 border rounded-lg shadow-sm"
                    >
                      <div className="flex items-center gap-1 text-yellow-500 mb-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>
                      <p className="text-gray-700">{rev.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
