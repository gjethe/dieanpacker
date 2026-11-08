import type { MetadataRoute } from "next";
import { posts } from "@/content/posts";
import { services } from "@/content/services";
import { abs } from "@/lib/site";

// Only canonical, indexable URLs. lastModified uses content dates, not build time.
export default function sitemap(): MetadataRoute.Sitemap {
  const site = "2026-11-08"; // last content change of home, hubs and service pages
  const legal = "2026-11-06";
  return [
    { url: abs("/"), lastModified: site, changeFrequency: "monthly", priority: 1 },
    { url: abs("/leistungen"), lastModified: site, changeFrequency: "monthly", priority: 0.9 },
    ...services.map((s) => ({ url: abs(`/leistungen/${s.slug}`), lastModified: site, changeFrequency: "monthly" as const, priority: 0.9 })),
    { url: abs("/ueber-uns"), lastModified: legal, changeFrequency: "yearly", priority: 0.6 },
    { url: abs("/kontakt"), lastModified: site, changeFrequency: "yearly", priority: 0.8 },
    { url: abs("/blog"), lastModified: site, changeFrequency: "weekly", priority: 0.7 },
    ...posts.map((p) => ({ url: abs(`/blog/${p.slug}`), lastModified: p.updated ?? p.date, changeFrequency: "yearly" as const, priority: 0.7 })),
    { url: abs("/impressum"), lastModified: legal, changeFrequency: "yearly", priority: 0.2 },
    { url: abs("/datenschutz"), lastModified: legal, changeFrequency: "yearly", priority: 0.2 },
  ];
}
