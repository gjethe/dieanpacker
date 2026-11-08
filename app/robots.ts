import type { MetadataRoute } from "next";
import { abs } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments must never be indexed.
  if (process.env.VERCEL_ENV === "preview") return { rules: { userAgent: "*", disallow: "/" } };
  // /kontakt/danke is not disallowed on purpose: crawlers must fetch it to see its noindex.
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: abs("/sitemap.xml"),
  };
}
