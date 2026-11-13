export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export type GetToken = () => Promise<string | null>;

export async function authenticatedFetch(
  getToken: GetToken,
  path: string,
  init: RequestInit = {},
) {
  const token = await getToken();
  if (!token) throw new Error("Du må være logget inn");
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(`${API_URL}${path}`, { ...init, headers });
}
