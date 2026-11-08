// Old WordPress theme demo posts and system pages that never belonged to the business.
// Served via rewrites in next.config.ts with 410 so search engines drop them quickly.
export function GET() {
  return new Response("Diese Seite existiert nicht mehr.", { status: 410, headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex" } });
}
