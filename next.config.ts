import type { NextConfig } from "next";
import { posts } from "./content/posts";
import { services } from "./content/services";

const ga = !!process.env.NEXT_PUBLIC_GA_ID;
const csp = [
  "default-src 'self'",
  // Next.js injects inline bootstrap scripts; a nonce-based CSP would force dynamic rendering.
  `script-src 'self' 'unsafe-inline'${ga ? " https://www.googletagmanager.com" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${ga ? " https://www.google-analytics.com https://www.googletagmanager.com" : ""}`,
  "font-src 'self'",
  `connect-src 'self'${ga ? " https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com" : ""}`,
  "frame-src https://www.google.com", // Google Maps, loaded only after a click
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

// URLs of the old WordPress site that were theme demo content, not business pages.
const gone = [
  "/smart-ways-to-save-energy-at-your-home",
  "/led-lighting-bright-safe-and-efficient",
  "/benefits-of-upgrading-electrical-panels",
  "/ev-charger-installation-made-easy",
  "/top-safety-tips-for-your-daily-usage",
  "/category/:path*",
  "/form",
  "/elementor-2506",
  "/agb",
];

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75],
    deviceSizes: [390, 640, 828, 1080, 1280, 1600, 2000],
  },
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      { source: "/leistung", destination: "/leistungen", permanent: true },
      { source: "/datenschutzerklaerung", destination: "/datenschutz", permanent: true },
      { source: "/danke", destination: "/kontakt", permanent: true },
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/wp-sitemap.xml", destination: "/sitemap.xml", permanent: true },
    ];
  },
  async rewrites() {
    // Unknown slugs would otherwise get the prerendered shell with status 200 (soft 404): Cache Components
    // has no dynamicParams=false. Sending them to a path with no route yields a real 404 at routing level.
    const unknown = (base: string, slugs: string[]) => ({ source: `${base}/:slug((?!(?:${slugs.join("|")})$)[^/]+)`, destination: "/__not-found" });
    return {
      beforeFiles: [
        ...gone.map((source) => ({ source, destination: "/api/gone" })),
        unknown("/blog", [...posts.map((p) => p.slug), "feed\\.xml"]),
        unknown("/leistungen", services.map((s) => s.slug)),
      ],
    };
  },
  async headers() {
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
    ];
    if (process.env.NODE_ENV === "production") security.push({ key: "Content-Security-Policy", value: csp });
    return [
      { source: "/:path*", headers: security },
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
};

export default nextConfig;
