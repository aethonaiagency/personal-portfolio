/**
 * Dynamic API route helper.
 * Uses relative routes by default so that when deployed as a full-stack application (e.g. on Vercel),
 * it queries the backend hosted on the same domain.
 * Supports overriding via `VITE_API_BASE_URL` if you host the backend on a separate server.
 */
export function getApiUrl(endpoint: string): string {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // If a custom production backend URL is specified via env variable, use it.
  if (import.meta.env.VITE_API_BASE_URL) {
    return `${import.meta.env.VITE_API_BASE_URL}${path}`;
  }

  // Fall back to same-origin relative path (standard for full-stack deployments like Vercel)
  return path;
}
