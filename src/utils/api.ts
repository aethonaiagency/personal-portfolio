/**
 * Dynamic API route helper.
 * Resolves relative routes if running inside the AI Studio container,
 * and automatically falls back to the live container URL if deployed as a static frontend elsewhere.
 */
export function getApiUrl(endpoint: string): string {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // Respect explicitly defined API target base paths
  if (import.meta.env.VITE_API_BASE_URL) {
    return `${import.meta.env.VITE_API_BASE_URL}${path}`;
  }

  // Detect whether we are running on standard container origins
  const hostname = window.location.hostname;
  const isInternalOrigin = hostname.includes('run.app') || hostname === 'localhost' || hostname === '127.0.0.1';

  if (!isInternalOrigin) {
    // If hosted statically on a custom domain (e.g. your portfolio website, Vercel static, etc.),
    // route API queries to the active containerized backend running on Cloud Run
    const liveBackendBase = 'https://ais-pre-6nxgy6ycnxlrdtxnenanpl-661777019807.asia-southeast1.run.app';
    return `${liveBackendBase}${path}`;
  }

  // Same-origin relative path
  return path;
}
