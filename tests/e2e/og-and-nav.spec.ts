import { expect, test, type Page } from "@playwright/test";

const SITE = "https://dieanpacker.at";
const IMAGE = `${SITE}/images/og-die-anpacker.jpg`;
const sizes = [[375, 812], [390, 844], [430, 932], [768, 1024], [1440, 900]] as const;

const content = (page: Page, attr: string, name: string) => page.locator(`meta[${attr}="${name}"]`).getAttribute("content");

test("social tags are complete, single and absolute; the image is a real 1200x630 JPEG", async ({ page, request }) => {
  for (const path of ["/", "/ueber-uns", "/leistungen/privatumzug-graz", "/blog/umzugsangebot-vergleichen"]) {
    await page.goto(path);
    for (const name of ["og:title", "og:description", "og:type", "og:url", "og:site_name", "og:locale", "og:image", "og:image:width", "og:image:height", "og:image:alt"])
      await expect(page.locator(`meta[property="${name}"]`), `${path} ${name}`).toHaveCount(1);
    for (const name of ["twitter:card", "twitter:title", "twitter:description", "twitter:image"])
      await expect(page.locator(`meta[name="${name}"]`), `${path} ${name}`).toHaveCount(1);
    expect(await content(page, "property", "og:image")).toBe(IMAGE);
    expect(await content(page, "name", "twitter:image")).toBe(IMAGE);
    expect(await content(page, "name", "twitter:card")).toBe("summary_large_image");
    expect(await content(page, "property", "og:url")).toBe(path === "/" ? SITE : `${SITE}${path}`);
  }
  const res = await request.get(new URL(IMAGE).pathname);
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toBe("image/jpeg");
  await page.goto(new URL(IMAGE).pathname);
  expect(await page.locator("img").evaluate((i: HTMLImageElement) => [i.naturalWidth, i.naturalHeight])).toEqual([1200, 630]);
});

test("contact bar: three separate targets, correct links, no overflow, only on phones", async ({ page }) => {
  for (const [width, height] of sizes) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    const links = page.locator('nav[aria-label="Schnellkontakt"] a');
    if (width >= 768) {
      await expect(links.first()).toBeHidden();
      continue;
    }
    expect(await links.evaluateAll((a) => a.map((x) => x.getAttribute("href")!.split("?")[0]))).toEqual(["tel:+436603926662", "https://wa.me/436603926662", "/kontakt"]);
    const hits = await links.evaluateAll((all) => all.map((a) => {
      const r = a.getBoundingClientRect();
      return { own: a.contains(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)), w: r.width, h: r.height, nested: a.querySelectorAll("a,button").length };
    }));
    for (const h of hits) expect(h).toMatchObject({ own: true, nested: 0 });
    for (const h of hits) expect(Math.min(h.w, h.h)).toBeGreaterThanOrEqual(44);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

// Records every view-transition animation of the next navigation (one snapshot per page, opacity only).
const recordTransition = (page: Page) => page.evaluate(() => {
  const w = window as unknown as { vt?: { p: string; ms: number; delay: number }[] };
  w.vt = undefined;
  const tick = () => {
    const a = document.getAnimations().filter((x) => (x.effect as KeyframeEffect | null)?.pseudoElement?.startsWith("::view-transition"));
    if (a.length) w.vt = a.map((x) => ({ p: (x.effect as KeyframeEffect).pseudoElement!, ms: Number(x.effect!.getTiming().duration), delay: Number(x.effect!.getTiming().delay) }));
    else requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});
const recorded = (page: Page) => page.evaluate(() => (window as unknown as { vt?: { p: string; ms: number; delay: number }[] }).vt);

test("page changes fade in under 180ms and survive back, forward, reload and direct entry", async ({ page }) => {
  const problems: string[] = [];
  page.on("console", (m) => { if (m.type() === "error" || /hydrat/i.test(m.text())) problems.push(m.text()); });
  page.on("pageerror", (e) => problems.push(e.message));

  await page.goto("/");
  for (const [href, h1] of [["/ueber-uns", /./], ["/leistungen", /./], ["/kontakt", "Erzählen Sie uns, was ansteht."]] as const) {
    await recordTransition(page);
    await page.locator(`header a[href="${href}"]:visible, footer a[href="${href}"]`).first().click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(page.locator("h1:visible")).toHaveText(h1);
    await expect.poll(() => recorded(page), href).toBeTruthy();
    const vt = (await recorded(page))!;
    expect(vt.filter((a) => a.p.startsWith("::view-transition-new(_")).length, `${href}: incoming snapshots`).toBeLessThanOrEqual(1);
    for (const a of vt.filter((x) => /-(old|new)\(/.test(x.p))) expect(a.ms, a.p).toBeLessThanOrEqual(180);
    // The old page is never painted during the change, or its text overlaps the new page.
    expect(vt.filter((a) => a.p.includes("-old(")).map((a) => a.p)).toEqual([]);
  }

  await page.goBack();
  await expect(page).toHaveURL(/\/leistungen$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/kontakt$/);
  await page.reload();
  await expect(page.locator("h1:visible")).toHaveText("Erzählen Sie uns, was ansteht.");
  await page.goto("/leistungen/privatumzug-graz");
  await expect(page.locator("h1:visible")).toHaveCount(1);
  expect(problems).toEqual([]);
});

test("reduced motion: navigation runs no transition animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await recordTransition(page);
  await page.locator('header a[href="/kontakt"]:visible').first().click();
  await expect(page).toHaveURL(/\/kontakt$/);
  await page.waitForTimeout(300);
  // React's own zero-length bookkeeping animations may exist; nothing may actually play.
  expect((await recorded(page))?.filter((a) => a.ms > 0) ?? []).toEqual([]);
});
