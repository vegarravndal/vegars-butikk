import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-gray-200 text-blue-500 p-4 overflow-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start space-y-8 sm:space-y-0 sm:space-x-20">
        {/* Left Side with Logo and Paragraph */}
        <div className="flex flex-col items-start">
          <img
            src="/images/logo.svg"
            alt="Vegars Butikk Logo"
            className="h-16 w-auto mb-4"
          />
          <p className="text-gray-400 text-sm max-w-xs">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae
            eros nec leo consectetur convallis. Integer et erat in dui
            sollicitudin mollis.
          </p>
        </div>

        {/* Right Side with Quick Links and Information */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-20">
          {/* Quick Links Section */}
          <div>
            <h2 className="text-black text-xl font-semibold mb-4">
              Quicklinks
            </h2>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-700 hover:text-blue-500">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-700 hover:text-blue-500">
                  About
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-700 hover:text-blue-500">
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          {/* Information Section */}
          <div>
            <h2 className="text-black text-xl font-semibold mb-4">
              Information
            </h2>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/contact"
                  className="text-gray-700 hover:text-blue-500"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-700 hover:text-blue-500"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="text-gray-700 hover:text-blue-500"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="text-center mt-8 text-gray-400 text-sm">
        <p>&copy; 2025 VEGARS BUTIKK</p>
      </div>
    </footer>
  );
}

export default Footer;
