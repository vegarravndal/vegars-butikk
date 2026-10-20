import { Link, useLocation } from "react-router-dom";
import { CartItem } from "../types/types";
import { useState, useRef, useEffect } from "react";
import { FiShoppingCart } from "react-icons/fi";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

type NavbarProps = {
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const Navbar = ({ cart, isCartOpen, openCart, closeCart }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Toggle-funksjon: Åpner hvis lukket, lukker hvis åpen
  const handleCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeMobileMenu();
    if (isCartOpen) {
      closeCart();
    } else {
      openCart();
    }
  };

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        closeMobileMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <nav className="bg-white shadow-md relative z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4 text-gray-950">
        {/* Logo + Desktop nav */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center">
            <img
              src="/images/logo.svg"
              alt="Vegars Butikk Logo"
              className="h-16 w-auto"
            />
          </Link>

          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/shop" className="hover:underline">
              Shop
            </Link>
            <Link to="/about" className="hover:underline">
              About
            </Link>
            <Link to="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="hover:underline">
              Terms & Conditions
            </Link>
            <Link to="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>

        {/* Cart + Auth */}
        <div className="flex items-center space-x-4 relative">
          <button
            data-cart-btn="true"
            onClick={handleCartClick}
            className="hover:text-blue-500 flex items-center relative focus:outline-none p-1"
          >
            <FiShoppingCart className="text-gray-950 text-3xl hover:text-blue-500" />
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center pointer-events-none">
                {totalQuantity}
              </span>
            )}
          </button>

          <SignedOut>
            <SignInButton mode="redirect">
              <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-4xl hover:bg-blue-500 hover:text-white transition">
                Logg inn
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-950 focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 flex justify-end">
          <div
            ref={menuRef}
            className="bg-white w-64 h-full p-6 relative flex flex-col"
          >
            <button
              onClick={closeMobileMenu}
              className="absolute top-4 right-4 text-gray-900"
            >
              ✕
            </button>
            <div className="flex flex-col space-y-4 mt-12 text-center">
              <Link to="/" onClick={closeMobileMenu}>
                Home
              </Link>
              <Link to="/shop" onClick={closeMobileMenu}>
                Shop
              </Link>
              <Link to="/about" onClick={closeMobileMenu}>
                About
              </Link>
              <Link to="/privacy-policy" onClick={closeMobileMenu}>
                Privacy Policy
              </Link>
              <Link to="/terms-and-conditions" onClick={closeMobileMenu}>
                Terms
              </Link>
              <Link to="/contact" onClick={closeMobileMenu}>
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
