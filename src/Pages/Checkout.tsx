// Checkout.tsx
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CartItem } from "../types/types";
import { useStore } from "../store/store";
import { BsTrash } from "react-icons/bs"; // Søppelbøtte ikon

type CheckoutProps = {
  cart: CartItem[];
  removeFromCart: (id: string) => void;
};

const Checkout = ({ cart, removeFromCart }: CheckoutProps) => {
  const navigate = useNavigate();
  const { setCart } = useStore();
  const location = useLocation();
  const { product, quantity } = location.state || {};
  const isSingleProductCheckout = Boolean(product);

  // Velg hvilke varer som skal vises i checkout
  const checkoutItems = isSingleProductCheckout
    ? [{ ...product, quantity }]
    : cart;

  // Tøm cart og gå til bekreftelse
  const handlePlaceOrder = () => {
    setCart([]);
    navigate("/order-confirmation");
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  // Totalbeløp
  const totalAmount = checkoutItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
        Checkout
      </h1>

      {checkoutItems.length === 0 ? (
        <div className="text-center space-y-4">
          <p className="text-gray-700 text-lg">Your cart is empty</p>
          <Link
            to="/shop"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-4xl text-lg transition font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-6">
            {checkoutItems.map((item) => (
              <li
                key={item.id}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-4 border-b pb-4"
              >
                {/* Bilde */}
                <Link to={`/product/${item.id}`} state={{ fromCheckout: true }}>
                  <img
                    src={item.imageUrl || "/images/default.png"}
                    alt={item.name}
                    className="w-32 h-32 object-cover rounded"
                  />
                </Link>

                {/* Produktinfo */}
                <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <Link to={`/product/${item.id}`} state={{ fromCheckout: true }}>
                      <h2 className="text-xl font-semibold hover:text-blue-500">
                        {item.name}
                      </h2>
                    </Link>
                    <p className="text-gray-700 mt-1">
                      Price: ${item.price} x {item.quantity}
                    </p>
                    <p className="text-gray-700 mt-1">
                      Subtotal: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Søppelbøtte ikon */}
                  {!isSingleProductCheckout && (
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 mt-2 sm:mt-0"
                      aria-label="Remove item"
                    >
                      <BsTrash size={20} />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* Total */}
          <div className="flex justify-between text-xl font-bold mt-6 text-gray-800">
            <span>Total:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>

          {/* Place Order */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handlePlaceOrder}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;
