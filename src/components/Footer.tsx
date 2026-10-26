import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-gray-200 text-blue-500 p-4 overflow-auto border-t border-gray-300 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start space-y-8 sm:space-y-0 sm:space-x-20 py-6">
        {/* Venstre side med Logo og beskrivelse */}
        <div className="flex flex-col items-start">
          <img
            src="/images/logo.svg"
            alt="Vegars Butikk Logo"
            className="h-16 w-auto mb-4"
          />
          <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae
            eros nec leo consectetur convallis. Integer et erat in dui
            sollicitudin mollis.
          </p>
        </div>

        {/* Høyre side med lenker */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-20">
          {/* Quick Links */}
          <div>
            <h2 className="text-black text-xl font-semibold mb-4">
              Quicklinks
            </h2>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-700 hover:text-blue-500 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-700 hover:text-blue-500 transition">
                  About
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-700 hover:text-blue-500 transition">
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h2 className="text-black text-xl font-semibold mb-4">
              Information
            </h2>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/contact"
                  className="text-gray-700 hover:text-blue-500 transition"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-700 hover:text-blue-500 transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="text-gray-700 hover:text-blue-500 transition"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bunnseksjon med automatisk årstall */}
      <div className="text-center mt-8 text-gray-500 text-sm border-t border-gray-300/50 pt-4">
        <p>&copy; {new Date().getFullYear()} VEGARS BUTIKK</p>
      </div>
    </footer>
  );
}

export default Footer;
