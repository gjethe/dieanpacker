import { expect, test } from "@playwright/test";
import { posts } from "../../content/posts";
import { services } from "../../content/services";
import { routes } from "./routes";

const SITE = "https://dieanpacker.at";

test("the Ratgeber has 18 articles and the blog overview links every one", async ({ page }) => {
  expect(posts.length).toBe(18);
  expect(new Set(posts.map((p) => p.slug)).size).toBe(18);
  await page.goto("/blog");
  for (const p of posts) await expect(page.locator(`main a[href="/blog/${p.slug}"]`).first(), p.slug).toBeAttached();
});

test("titles and descriptions fit search snippets", async ({ page }) => {
  for (const path of routes) {
    await page.goto(path);
    expect((await page.title()).length, `${path} title`).toBeLessThanOrEqual(65);
    const desc = (await page.locator('meta[name="description"]').getAttribute("content")) ?? "";
    expect(desc.length, `${path} description`).toBeLessThanOrEqual(160);
  }
});

test("every article: BlogPosting + WebPage + breadcrumb schema, 3 related articles, a service link, loaded images, no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(`${page.url()}: ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`${page.url()}: ${e.message}`));
  for (const p of posts) {
    const path = `/blog/${p.slug}`;
    await page.goto(path);
    const graphs = (await page.locator('script[type="application/ld+json"]').allTextContents()).flatMap((t) => JSON.parse(t)["@graph"]);
    const types = graphs.map((n) => n["@type"]);
    for (const t of ["BlogPosting", "WebPage", "BreadcrumbList", "MovingCompany"]) expect(types, `${path} ${t}`).toContain(t);
    const article = graphs.find((n) => n["@type"] === "BlogPosting");
    expect(article.datePublished, path).toBe(p.date);
    expect(article.dateModified, path).toBe(p.updated ?? p.date);
    expect(article.image, path).toBe(`${SITE}${p.image.src}`);
    // ids referenced from the page must exist as nodes on the page
    const ids = new Set(graphs.map((n) => n["@id"]).filter(Boolean));
    expect(ids.has(article.publisher["@id"]), `${path} publisher`).toBe(true);
    expect(ids.has(graphs.find((n) => n["@type"] === "WebPage").breadcrumb["@id"]), `${path} breadcrumb id`).toBe(true);

    const body = page.locator("main .prose");
    expect(await body.locator("a[href^='/leistungen/']").count(), `${path} links a service in the text`).toBeGreaterThan(0);
    await expect(page.getByRole("heading", { name: "Weiterlesen" })).toBeVisible();
    expect(await page.locator("section[aria-labelledby='weiter-title'] a[href^='/blog/']").count(), path).toBe(3);

    // lazy images below the fold: scroll through, then every <img> must have decoded pixels
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } });
    const broken = await page.locator("main img").evaluateAll((imgs) => imgs.filter((i) => (i as HTMLImageElement).complete && (i as HTMLImageElement).naturalWidth === 0).map((i) => i.getAttribute("src")));
    expect(broken, path).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test("every service page links to its cluster articles", async ({ page }) => {
  for (const s of services) {
    await page.goto(`/leistungen/${s.slug}`);
    for (const slug of s.posts) await expect(page.locator(`main a[href="/blog/${slug}"]`).first(), `${s.slug} -> ${slug}`).toBeAttached();
  }
});

test("llms.txt and the RSS feed are served and only point at real pages", async ({ request }) => {
  const llms = await request.get("/llms.txt");
  expect(llms.status()).toBe(200);
  expect(llms.headers()["content-type"]).toContain("text/plain");
  const txt = await llms.text();
  expect(txt).toContain("office@dieanpacker.at");
  expect(txt).toContain("Neusiedlergasse 7, 8041 Graz");
  const linked = [...txt.matchAll(/\]\((https:\/\/dieanpacker\.at[^)]*)\)/g)].map((m) => m[1].replace(SITE, "") || "/");
  for (const p of posts) expect(linked, p.slug).toContain(`/blog/${p.slug}`);
  for (const path of linked) expect((await request.get(path)).status(), path).toBe(200);

  const feed = await request.get("/blog/feed.xml");
  expect(feed.status()).toBe(200);
  expect(feed.headers()["content-type"]).toContain("application/rss+xml");
  const xml = await feed.text();
  expect([...xml.matchAll(/<item>/g)].length).toBe(18);
  expect(xml).not.toContain("localhost");
});

test("thank-you page stays crawlable but noindex", async ({ page, request }) => {
  expect(await (await request.get("/robots.txt")).text()).not.toContain("/kontakt/danke");
  await page.goto("/kontakt/danke");
  expect(await page.locator('meta[name="robots"]').getAttribute("content")).toContain("noindex");
});

test("unknown article and service slugs return a real 404, known ones 200", async ({ request }) => {
  for (const path of ["/blog/gibt-es-nicht", "/leistungen/gibt-es-nicht", "/blog/umzug-im-alter-x", "/blog/feedxxml"]) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(404);
    expect(await res.text(), path).toContain("Diese Seite gibt es nicht");
  }
  for (const path of ["/blog/feed.xml", `/blog/${posts[0].slug}`, `/leistungen/${services[0].slug}`]) expect((await request.get(path)).status(), path).toBe(200);
});

test("article and service HTML contains the full content (crawlable without JS)", async ({ request }) => {
  for (const p of posts) {
    const html = await (await request.get(`/blog/${p.slug}`)).text();
    expect(html, p.slug).toContain(p.title.replace(/&/g, "&amp;"));
    expect(html, p.slug).toContain("Häufige Fragen");
  }
  for (const s of services) expect(await (await request.get(`/leistungen/${s.slug}`)).text(), s.slug).toContain("Auf einen Blick");
  // and it is painted directly: no Suspense placeholder that a script swaps out later
  for (const path of [`/blog/${posts[0].slug}`, `/leistungen/${services[0].slug}`]) {
    const html = await (await request.get(path)).text();
    expect(html, path).not.toContain('aria-busy="true"');
    expect(html, path).not.toMatch(/<template id="B:/);
  }
});
