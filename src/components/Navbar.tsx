import { Link, useLocation } from "react-router-dom";
import { CartItem } from "../types/types";
import { useState, useRef, useEffect } from "react";
import { FiShoppingCart, FiUser } from "react-icons/fi";
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
    <nav className="bg-[#193d34]/95 backdrop-blur-xl border-b border-white/10 shadow-lg relative z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4 text-[#f4f1e8]">
        {/* Logo + Desktop nav */}
        <div className="flex items-center min-w-0 flex-1 md:flex-none space-x-6">
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="/images/logo.svg"
              alt="Vegars Butikk Logo"
              className="h-12 w-auto brightness-0 invert md:h-16"
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
        <div className="flex items-center space-x-3 md:space-x-4 relative shrink-0">
          <button
            data-cart-btn="true"
            onClick={handleCartClick}
            className="hover:text-[#e5b879] flex items-center relative focus:outline-none p-1"
          >
            <FiShoppingCart className="text-[#f4f1e8] text-2xl md:text-3xl hover:text-[#e5b879]" />
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center pointer-events-none">
                {totalQuantity}
              </span>
            )}
          </button>

          <SignedOut>
            <SignInButton mode="redirect">
              <button
                aria-label="Logg inn"
                title="Logg inn"
                className="whitespace-nowrap p-2 md:px-4 md:py-2 text-sm border border-[#d6ac78] text-[#f4dfc1] rounded-md hover:bg-[#d6ac78] hover:text-[#193d34] transition font-medium"
              >
                <FiUser className="md:hidden text-lg" aria-hidden="true" />
                <span className="hidden md:inline">Logg inn</span>
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link to="/orders" className="hidden sm:inline hover:underline">Mine kjøp</Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center ml-3 shrink-0">
          <button
            onClick={toggleMobileMenu}
            className="text-[#f4f1e8] focus:outline-none"
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
        <div className="fixed inset-0 h-dvh bg-black/30 z-40 flex justify-end">
          <div
            ref={menuRef}
            className="bg-[#f4f1e8] w-64 h-dvh p-6 relative flex flex-col"
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
