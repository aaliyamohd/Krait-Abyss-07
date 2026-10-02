import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import twoFactorApp from "./server/twoFactorServer";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      {
        name: "2fa-express-middleware",
        configureServer(server) {
          server.middlewares.use(twoFactorApp);
        },
      },
    ],
    server: {
      headers: {
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "X-Frame-Options": "DENY",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
        "Cross-Origin-Resource-Policy": "same-origin",
        "Content-Security-Policy":
          "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://fonts.googleapis.com; frame-src 'self' https://challenges.cloudflare.com https://*.spline.design; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https: wss: https://challenges.cloudflare.com https://*.supabase.co https://*.spline.design https://*.splinecode.com;",
      },
    },
  },
});
