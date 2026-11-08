import type { Metadata } from "next";
import { site } from "./site";

// Branded social banner (source: scripts/brand/og-banner.html), shared by every page.
export const defaultOgImage = { url: "/images/og-die-anpacker.jpg", width: 1200, height: 630, alt: "Die Anpacker: Umzüge & Räumungen in Graz und der Steiermark" };

type Args = { title: string; description: string; path: string; article?: { published: string; modified?: string } };

// Child openGraph objects replace the parent's, so every page sets the full set here.
// Every page shares the JPEG banner: page photos are WebP, which LinkedIn link previews do not reliably render.
export function pageMeta({ title, description, path, article }: Args): Metadata {
  return {
    // The layout template appends " | Die Anpacker"; drop it where it would push the title past what Google shows (~60 chars).
    title: path === "/" || `${title} | ${site.name}`.length > 62 ? { absolute: title } : title,
    description,
    alternates: { canonical: path, types: { "application/rss+xml": [{ url: "/blog/feed.xml", title: `Ratgeber | ${site.name}` }] } },
    openGraph: {
      type: article ? "article" : "website",
      locale: "de_AT",
      siteName: site.name,
      url: path,
      title,
      description,
      images: [defaultOgImage],
      ...(article ? { publishedTime: article.published, modifiedTime: article.modified ?? article.published } : {}),
    },
  };
}
