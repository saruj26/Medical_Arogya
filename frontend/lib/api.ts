// Small helper to centralize API base URL handling.
// Uses NEXT_PUBLIC_API_URL when available at build time, otherwise falls back to localhost.
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function api(path: string) {
  if (!path.startsWith("/")) path = "/" + path;
  return `${API_URL}${path}`;
}

export default api;
