import { useNavigate } from "react-router-dom";

export function OrderConfirmation() {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    // Kurven ble allerede tømt og synkronisert til MongoDB i Checkout-steget
    navigate("/shop");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
        Order Confirmed!
      </h1>

      <div className="text-center space-y-4">
        <p className="text-gray-700 text-lg">
          Thank you for your purchase.
        </p>
        <p className="text-gray-700 text-lg">
          Your order has been successfully placed.
        </p>
        <p className="text-gray-700 text-lg">
          We appreciate your business!
        </p>

        <div className="pt-2">
          <button
            onClick={handleContinueShopping}
            className="bg-green-500 text-white px-6 py-3 rounded-4xl text-lg font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
