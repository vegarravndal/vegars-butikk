import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react"; // Importerer Clerk-autentisering
import { CartItem } from "../types/types";
import { useStore } from "../store/store";
import { BsTrash } from "react-icons/bs";

// Updated to include the removeFromCart prop definition
type CheckoutProps = {
  cart: CartItem[];
  removeFromCart: (id: string) => void;
};

// Added removeFromCart to the destructured arguments
const Checkout = ({ cart, removeFromCart }: CheckoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useAuth(); // Henter den unike Clerk-bruker-ID-en
  const { removeFromCartWithUser, clearCartWithUser } = useStore(); // Henter databasefunksjoner

  const { product, quantity } = location.state || {};
  const isSingleProductCheckout = Boolean(product);

  const checkoutItems = isSingleProductCheckout
    ? [{ ...product, quantity }]
    : cart;

  const totalAmount = checkoutItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Sender bestillingen til MongoDB og tømmer kurven
  const handlePlaceOrder = async () => {
    if (!userId) {
      alert("Du må være logget inn for å fullføre bestillingen.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          items: checkoutItems.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          totalAmount: Number(totalAmount.toFixed(2)),
        }),
      });

      if (!response.ok) throw new Error("Kunne ikke lagre ordren");

      console.log("✅ Ordre lagret i MongoDB");
      
      // Tømmer handlekurven i både lokalt minne og i MongoDB-databasen
      if (!isSingleProductCheckout) {
        clearCartWithUser(userId);
      }
      
      navigate("/order-confirmation");
    } catch (error) {
      console.error("❌ Feil ved oppretting av ordre:", error);
      alert("Noe gikk galt under lagring av bestillingen din. Prøv igjen.");
    }
  };

  const handleRemoveItem = (id: string) => {
    // Calls both the database update and the app-state prop function
    removeFromCartWithUser(id, userId);
    removeFromCart(id);
  };

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
                <Link to={`/product/${item.id}`} state={{ fromCheckout: true }}>
                  <img
                    src={item.imageUrl || "/images/default.png"}
                    alt={item.name}
                    className="w-32 h-32 object-cover rounded"
                  />
                </Link>

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

          <div className="flex justify-between text-xl font-bold mt-6 text-gray-800">
            <span>Total:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>

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
