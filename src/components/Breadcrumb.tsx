import { Link, useLocation } from "react-router-dom";
import { useStore } from "../store/store";

export function Breadcrumb() {
  const location = useLocation();
  const { originalProducts } = useStore();

  if (location.pathname === "/") return null;

  const paths = location.pathname.split("/").filter(Boolean);

  // 👉 ProductDetails case
  if (paths[0] === "product" && paths[1]) {
    const productId = paths[1];

    const product = originalProducts.find(
      (p) => String(p.id) === String(productId)
    );

    const category = product?.mainCategory || product?.category || null;

    return (
      <div className="px-4 py-2">
        <nav aria-label="Breadcrumb">
          <ol className="flex text-gray-700 space-x-2">
            <li>
              <Link to="/" className="text-blue-500 hover:text-blue-700">
                Home
              </Link>
            </li>

            <li className="flex items-center">
              <span className="mx-2">/</span>
              <Link
                to="/shop"
                state={{ selectedCategory: category }}
                className="text-blue-500 hover:text-blue-700"
              >
                Product
              </Link>
            </li>

            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-500">{productId}</span>
            </li>
          </ol>
        </nav>
      </div>
    );
  }

  // 👉 Standard breadcrumb
  return (
    <div className="px-4 py-2">
      <nav aria-label="Breadcrumb">
        <ol className="flex text-gray-700 space-x-2">
          <li>
            <Link to="/" className="text-blue-500 hover:text-blue-700">
              Home
            </Link>
          </li>

          {paths.map((path, index) => {
            const to = `/${paths.slice(0, index + 1).join("/")}`;
            const isLast = index === paths.length - 1;

            return (
              <li key={to} className="flex items-center">
                <span className="mx-2">/</span>
                {isLast ? (
                  <span className="text-gray-500">{path}</span>
                ) : (
                  <Link to={to} className="text-blue-500 hover:text-blue-700">
                    {path}
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
