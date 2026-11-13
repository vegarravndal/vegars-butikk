import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authenticatedFetch } from "../utils/api";

type OrderItem = { productId: string; name: string; price: number; quantity: number };
type Order = { _id: string; items: OrderItem[]; totalAmount: number; placedAt: string };

export default function OrderHistory() {
  const { isSignedIn, getToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    authenticatedFetch(getToken, "/api/orders")
      .then(async (response) => {
        if (!response.ok) throw new Error("Kunne ikke hente ordrehistorikken");
        return response.json() as Promise<Order[]>;
      })
      .then((data) => { if (!cancelled) setOrders(data); })
      .catch(() => { if (!cancelled) setError("Kunne ikke hente ordrehistorikken. Prøv igjen senere."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [getToken, isSignedIn]);

  if (!isSignedIn) return <main className="max-w-3xl mx-auto p-8 text-center">Logg inn for å se kjøpshistorikken.</main>;
  if (loading) return <main className="max-w-3xl mx-auto p-8">Laster kjøpshistorikk …</main>;
  if (error) return <main className="max-w-3xl mx-auto p-8 text-red-600">{error}</main>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Kjøpshistorikk</h1>
      {orders.length === 0 ? (
        <p>Du har ingen tidligere bestillinger. <Link className="text-blue-600 underline" to="/shop">Se butikken</Link></p>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <section key={order._id} className="border rounded-lg p-5">
              <div className="flex justify-between gap-4 mb-3">
                <h2 className="font-semibold">Bestilling {order._id.slice(-8)}</h2>
                <time dateTime={order.placedAt}>{new Date(order.placedAt).toLocaleDateString("nb-NO")}</time>
              </div>
              <ul className="space-y-2">
                {order.items.map((item, index) => <li key={`${item.productId}-${index}`} className="flex justify-between gap-4"><span>{item.name} × {item.quantity}</span><span>{(item.price * item.quantity).toFixed(2)} $</span></li>)}
              </ul>
              <p className="border-t mt-3 pt-3 text-right font-bold">Sum: {order.totalAmount.toFixed(2)} $</p>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
