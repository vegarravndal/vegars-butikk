import { Link, useLocation } from "react-router-dom";
import { useStore } from "../store/store";
import { getCategoryDisplayName } from "../utils/categoryNames";

export function Breadcrumb() {
  const location = useLocation();
  const { originalProducts } = useStore();

  if (location.pathname === "/") return null;

  const paths = location.pathname.split("/").filter(Boolean);

  // 👉 Sjekk om vi FAKTISK er inne på en produktdetaljside
  const isProductPage = paths[0] === "product" && paths[1];
  const matchingProduct = isProductPage
    ? originalProducts.find((p) => String(p.id) === String(paths[1]))
    : null;

  // 👉 Hvis vi er på en produkt-URL OG produktet eksisterer i databasen/storen
  if (isProductPage && matchingProduct) {
    const category =
      matchingProduct.mainCategory || matchingProduct.category || null;
    const productName = matchingProduct.name;
    const displayCategoryName = category
      ? getCategoryDisplayName(category)
      : null;

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
              <Link to="/shop" className="text-blue-600 hover:underline">
                Shop
              </Link>
            </li>

            {category && displayCategoryName && (
              <li className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link
                  to="/shop"
                  state={{ selectedCategory: category }}
                  className="text-blue-600 hover:underline"
                >
                  {displayCategoryName}
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

  // 👉 Standard breadcrumb for alle andre sider (F.eks /shop, /about, /privacy-policy)
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

            // Sjekker om stien er en rå kategori-id, og henter i så fall "Kitchen & Home" etc.
            const displayPathName = getCategoryDisplayName(path);

            // Gjør ord pene hvis det ikke er en pre-definert kategori (f.eks "privacy-policy" -> "Privacy Policy")
            const formattedPath =
              displayPathName === path
                ? path
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())
                : displayPathName;

            return (
              <li key={to} className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                {isLast ? (
                  <span className="text-gray-500 font-medium">
                    {formattedPath}
                  </span>
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
