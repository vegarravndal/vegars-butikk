import { useEffect, useRef } from "react";
import { CartItem } from "../types/types";
import { useNavigate } from "react-router-dom";
import { BsTrash } from "react-icons/bs";
import { useAuth } from "@clerk/clerk-react"; // Importerer Clerk-autentisering
import { useStore } from "../store/store"; // Importerer Zustand-storen

type CartProps = {
  cart: CartItem[];
  isCartOpen: boolean;
  closeCart: () => void;
};

const Cart = ({ cart, isCartOpen, closeCart }: CartProps) => {
  const navigate = useNavigate();
  const cartRef = useRef<HTMLDivElement>(null);
  const { userId } = useAuth(); // Henter den unike Clerk-bruker-ID-en
  
  // Henter de nye databasetilkoblede funksjonene direkte fra storen
  const { removeFromCartWithUser, clearCartWithUser } = useStore();

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckoutClick = () => {
    closeCart();
    navigate("/checkout");
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        closeCart();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeCart]);

  return (
    <div
      ref={cartRef}
      className={`fixed top-0 right-0 h-full z-50 w-96 transform transition-transform duration-300
        ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="bg-white shadow-lg max-h-full overflow-y-auto p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Cart</h2>
          <button
            onClick={closeCart}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            &times;
          </button>
        </div>

        {/* Cart Items */}
        {cart.length === 0 ? (
          <p className="text-center text-gray-600 mt-10">Your cart is empty.</p>
        ) : (
          <ul className="space-y-4 flex-1">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.imageUrl || "/images/default.png"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      Price: ${item.price}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCartWithUser(item.id, userId)} // Sender med userId ved sletting
                  className="text-red-500 hover:text-red-700 text-xl"
                >
                  <BsTrash />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Total & Checkout */}
        <div className="mt-4 flex justify-between items-center font-semibold">
          <p>Total:</p>
          <p>${totalAmount.toFixed(2)}</p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleCheckoutClick}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Checkout
          </button>
          {cart.length > 0 && (
            <button
              onClick={() => clearCartWithUser(userId)} // Sender med userId ved tømming
              className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Fjern alle varer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
