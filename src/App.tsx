import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useStore } from "./store/store";

// Komponenter
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Breadcrumb from "./components/Breadcrumb";
import Cart from "./components/Cart";
import HeroBanner from "./components/HeroBanner";

// Sider
import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import ProductDetails from "./Pages/ProductDetails";
import Checkout from "./Pages/Checkout";
import OrderConfirmation from "./Pages/OrderConfirmation";
import About from "./Pages/About";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsAndConditions from "./Pages/TermsAndConditions";
import Contact from "./Pages/Contact";

function App() {
  const {
    cart,
    originalProducts,
    removeFromCart,
    setCart,
    setProducts,
  } = useStore();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Last inn produkter
  useEffect(() => {
    if (originalProducts.length > 0) {
      setProducts(originalProducts);
      setLoading(false);
    }
  }, [originalProducts, setProducts]);

  // Hent lagret handlevogn fra MongoDB med en gang brukeren logger inn
  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:5000/api/cart/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.items) {
            setCart(data.items);
          }
        })
        .catch((err) => console.error("Kunne ikke hente handlevogn fra MongoDB:", err));
    }
  }, [user?.id, setCart]);

  // Lukk cart når man klikker utenfor
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const cartElement = document.getElementById("cart-sidebar");
      if (
        isCartOpen &&
        cartElement &&
        !cartElement.contains(e.target as Node)
      ) {
        closeCart();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCartOpen]);

  if (loading)
    return <div className="p-10 text-center">Loading products...</div>;

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar cart={cart} openCart={openCart} />

        {/* Main content */}
        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HeroBanner />
                  <Breadcrumb />
                  <Home />
                </>
              }
            />
            <Route
              path="/shop"
              element={
                <>
                  <Breadcrumb />
                  <Shop />
                </>
              }
            />
            <Route
              path="/shop/:category"
              element={
                <>
                  <Breadcrumb />
                  <Shop />
                </>
              }
            />
            <Route
              path="/product/:id"
              element={
                <>
                  <Breadcrumb />
                  <ProductDetails />
                </>
              }
            />
            <Route path="/product" element={<Navigate to="/shop" replace />} />
            <Route
              path="/checkout"
              element={<Checkout cart={cart} removeFromCart={removeFromCart} />}
            />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditions />}
            />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {/* Footer alltid nederst */}
        <Footer />

        {/* Cart sidebar - her er de overflødige propsene fjernet */}
        <Cart
          cart={cart}
          isCartOpen={isCartOpen}
          closeCart={closeCart}
        />
      </div>
    </Router>
  );
}

export default App;
