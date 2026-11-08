import { expect, test } from "@playwright/test";
import { routes } from "./routes";

const SITE = "https://dieanpacker.at";

test("every indexable page: 200, one H1, unique title/description, canonical, valid JSON-LD", async ({ page }) => {
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();
  for (const path of routes) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(200);
    expect(await page.locator("html").getAttribute("lang")).toBe("de-AT");
    await expect(page.locator("h1"), path).toHaveCount(1);

    const title = await page.title();
    expect(title.length, `${path} title`).toBeGreaterThan(10);
    expect(titles.has(title), `duplicate title on ${path} and ${titles.get(title)}`).toBe(false);
    titles.set(title, path);

    const desc = (await page.locator('meta[name="description"]').getAttribute("content")) ?? "";
    expect(desc.length, `${path} description`).toBeGreaterThan(70);
    expect(descriptions.has(desc), `duplicate description on ${path}`).toBe(false);
    descriptions.set(desc, path);

    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical, path).toBe(path === "/" ? SITE : `${SITE}${path}`);
    expect(await page.locator('meta[name="robots"]').getAttribute("content")).not.toContain("noindex");

    for (const raw of await page.locator('script[type="application/ld+json"]').allTextContents()) {
      const data = JSON.parse(raw);
      expect(data["@context"]).toBe("https://schema.org");
      const json = JSON.stringify(data);
      // never ship unconfirmed claims in structured data
      for (const banned of ["aggregateRating", "review", "priceRange", "openingHours"]) expect(json).not.toContain(banned);
    }

    // heading order: no level skipped from one heading to the next
    const levels = await page.locator("main h1, main h2, main h3, main h4").evaluateAll((els) => els.map((e) => Number(e.tagName[1])));
    for (let i = 1; i < levels.length; i++) expect(levels[i] - levels[i - 1], `${path} heading skip at #${i}`).toBeLessThanOrEqual(1);
  }
});

test("all images have alt attributes and dimensions", async ({ page }) => {
  for (const path of routes) {
    await page.goto(path);
    const bad = await page.locator("img").evaluateAll((imgs) =>
      imgs.filter((i) => !i.hasAttribute("alt") || (!i.getAttribute("width") && !i.style.position)).map((i) => i.getAttribute("src")),
    );
    expect(bad, path).toEqual([]);
  }
});

test("no broken internal links across the site", async ({ page, request }) => {
  const links = new Set<string>();
  for (const path of routes) {
    await page.goto(path);
    for (const href of await page.locator("a[href^='/']").evaluateAll((as) => as.map((a) => a.getAttribute("href")!))) links.add(href.split("#")[0]);
  }
  for (const href of links) {
    const res = await request.get(href, { maxRedirects: 0 });
    expect(res.status(), href).toBe(200);
  }
  // every route is linked from somewhere (no orphans)
  for (const r of routes) expect(links.has(r), `orphan: ${r}`).toBe(true);
});

test("sitemap.xml lists exactly the indexable routes", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  expect(new Set(locs)).toEqual(new Set(routes.map((r) => (r === "/" ? SITE : SITE + r))));
});

test("robots.txt allows crawling and points to the sitemap", async ({ request }) => {
  const txt = await (await request.get("/robots.txt")).text();
  expect(txt).toContain("Allow: /");
  expect(txt).toContain(`Sitemap: ${SITE}/sitemap.xml`);
  expect(txt).not.toMatch(/Disallow: \/\s*$/m);
});

test("old URLs redirect permanently or return 410", async ({ request }) => {
  for (const [from, to] of [["/leistung", "/leistungen"], ["/leistung/", "/leistungen"], ["/datenschutzerklaerung/", "/datenschutz"], ["/danke/", "/kontakt"], ["/ueber-uns/", "/ueber-uns"]]) {
    const res = await request.get(from, { maxRedirects: 5 });
    expect(res.status(), from).toBe(200);
    expect(new URL(res.url()).pathname, from).toBe(to);
  }
  const first = await request.get("/leistung", { maxRedirects: 0 });
  expect([301, 308]).toContain(first.status());
  for (const gone of ["/ev-charger-installation-made-easy", "/category/uncategorized", "/agb"]) {
    expect((await request.get(gone)).status(), gone).toBe(410);
  }
  expect((await request.get("/gibt-es-nicht")).status()).toBe(404);
});

test("security headers are set", async ({ request }) => {
  const h = (await request.get("/")).headers();
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["x-frame-options"]).toBe("DENY");
  expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(h["x-powered-by"]).toBeUndefined();
});
