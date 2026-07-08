import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../store/store";
import { Product } from "../types/types";

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const { originalProducts, addToCart } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        {product.name}
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full lg:w-1/2 h-auto object-cover rounded"
        />
        <div className="flex-1">
          <p className="text-lg text-gray-700 mb-4">{product.description}</p>
          <p className="text-2xl font-semibold text-gray-800 mb-4">
            ${product.price}
          </p>

          <div className="flex items-center gap-4 mb-4">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min={1}
              className="w-20 p-2 border rounded"
            />
            <button
              onClick={() => addToCart(product, quantity)}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
            >
              Add to Cart
            </button>
          </div>

          {/* Review & Rating Section */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Submit a Review
            </h2>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block mb-1 text-gray-700">Rating:</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="p-2 border rounded"
                >
                  <option value={0}>Select rating</option>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <option key={star} value={star}>
                      {star} Star{star > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-gray-700">Review:</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={4}
                  placeholder="Write your review here"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
              >
                Submit Review
              </button>
            </form>

            {/* Display submitted reviews */}
            {submittedReviews.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Reviews
                </h3>
                <ul className="space-y-4">
                  {submittedReviews.map((rev, idx) => (
                    <li key={idx} className="border p-4 rounded bg-gray-50">
                      <p className="font-semibold">Rating: {rev.rating} / 5</p>
                      <p className="text-gray-700">{rev.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
