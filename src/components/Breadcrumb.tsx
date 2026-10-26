import { Link, useLocation } from "react-router-dom";
import { useStore } from "../store/store";

export function Breadcrumb() {
  const location = useLocation();
  const { originalProducts } = useStore();

  if (location.pathname === "/") return null;

  const paths = location.pathname.split("/").filter(Boolean);

  // 👉 ProductDetails-spesifikk breadcrumb (Viser ekte navn og kategori)
  if (paths[0] === "product" && paths[1]) {
    const productId = paths[1];

    const product = originalProducts.find(
      (p) => String(p.id) === String(productId)
    );

    const category = product?.mainCategory || product?.category || null;
    const productName = product?.name || productId;

    return (
      <div className="max-w-6xl mx-auto px-6 py-3">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center text-sm text-gray-600 space-x-1">
            <li>
              <Link to="/" className="text-blue-600 hover:underline">
                Home
              </Link>
            </li>

            <li className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <Link
                to="/shop"
                className="text-blue-600 hover:underline"
              >
                Shop
              </Link>
            </li>

            {category && (
              <li className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link
                  to="/shop"
                  state={{ selectedCategory: category }}
                  className="text-blue-600 hover:underline capitalize"
                >
                  {category.toLowerCase()}
                </Link>
              </li>
            )}

            <li className="flex items-center min-w-0">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-500 truncate font-medium">
                {productName}
              </span>
            </li>
          </ol>
        </nav>
      </div>
    );
  }

  // 👉 Standard breadcrumb for andre sider
  return (
    <div className="max-w-6xl mx-auto px-6 py-3">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center text-sm text-gray-600 space-x-1">
          <li>
            <Link to="/" className="text-blue-600 hover:underline">
              Home
              </Link>
          </li>

          {paths.map((path, index) => {
            const to = `/${paths.slice(0, index + 1).join("/")}`;
            const isLast = index === paths.length - 1;

            // Gjør rå stier som "privacy-policy" om til "Privacy Policy"
            const formattedPath = path
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());

            return (
              <li key={to} className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                {isLast ? (
                  <span className="text-gray-500 font-medium">{formattedPath}</span>
                ) : (
                  <Link to={to} className="text-blue-600 hover:underline">
                    {formattedPath}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

export default Breadcrumb;
