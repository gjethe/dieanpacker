import { posts } from "@/content/posts";
import { abs, site } from "@/lib/site";

// RSS 2.0 feed of the Ratgeber, prerendered at build time. Lets feed readers and crawlers pick up new articles.
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const rfc822 = (d: string) => new Date(`${d}T08:00:00Z`).toUTCString();

export function GET() {
  const items = posts
    .map((p) => {
      const url = abs(`/blog/${p.slug}`);
      return `<item><title>${esc(p.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${rfc822(p.date)}</pubDate><category>${esc(p.category)}</category><description>${esc(p.metaDescription)}</description></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${esc(`Ratgeber | ${site.name}`)}</title><link>${abs("/blog")}</link><atom:link href="${abs("/blog/feed.xml")}" rel="self" type="application/rss+xml"/><description>${esc("Ratgeber zu Umzug, Entrümpelung und Möbeltransport in Graz und der Steiermark.")}</description><language>de-AT</language><lastBuildDate>${rfc822(posts.map((p) => p.updated ?? p.date).sort().at(-1)!)}</lastBuildDate>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
