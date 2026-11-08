import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// includes two articles with tables (they must scroll inside their own box on phones)
const pages = ["/", "/leistungen", "/leistungen/privatumzug-graz", "/kontakt", "/blog", "/blog/umzug-graz-checkliste", "/blog/umzugsangebot-vergleichen", "/blog/entruempelung-entsorgung-graz", "/ueber-uns", "/impressum", "/datenschutz"];
const widths = [1440, 1100, 1024, 768, 390, 320];

test("no horizontal scrolling at 1440 / 1100 / 1024 / 768 / 390 / 320 px", async ({ page }) => {
  for (const w of widths) {
    await page.setViewportSize({ width: w, height: 900 });
    for (const p of pages) {
      await page.goto(p);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${p} @ ${w}px`).toBeLessThanOrEqual(0);
    }
  }
});

test("mobile menu opens, navigates and closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.locator("#mobile-menu");
  await page.getByRole("button", { name: "Menü" }).click();
  await expect(menu).toBeVisible();
  await page.getByRole("navigation", { name: "Mobile Navigation" }).getByRole("link", { name: "Ratgeber" }).click();
  await expect(page).toHaveURL(/\/blog$/);
  await expect(menu).toBeHidden(); // closes after navigating
  await page.getByRole("button", { name: "Menü" }).click();
  await expect(menu.getByRole("link", { name: "Ratgeber" })).toHaveAttribute("aria-current", "page");
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
});

test("desktop nav marks the current page and hides the menu button", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/ueber-uns");
  await expect(page.getByRole("navigation", { name: "Hauptnavigation" }).getByRole("link", { name: "Über uns" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("button", { name: "Menü" })).toBeHidden();
});

test("mobile contact bar does not cover the footer", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const bar = await page.getByRole("navigation", { name: "Schnellkontakt" }).boundingBox();
  const lastLink = await page.getByRole("button", { name: "Cookie-Einstellungen" }).boundingBox();
  expect(bar && lastLink && lastLink.y + lastLink.height <= bar.y).toBeTruthy();
});

test("no serious accessibility violations (axe, WCAG 2.2 AA rules)", async ({ page }) => {
  // measure final colours, not frames of the fade-in animations
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const p of pages) {
    await page.goto(p);
    const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    const serious = r.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(", ")}`), p).toEqual([]);
  }
});

test("cookie settings open, save and persist", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("region", { name: "Cookie-Hinweis" })).toHaveCount(0); // no optional services configured
  await page.getByRole("button", { name: "Cookie-Einstellungen" }).click();
  const dialog = page.getByRole("dialog", { name: "Cookie-Einstellungen" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Nur notwendige" }).click();
  await expect(dialog).toBeHidden();
  const stored = await page.evaluate(() => localStorage.getItem("da-consent-v1"));
  expect(JSON.parse(stored!).statistik).toBe(false);
  await page.reload();
  expect(await page.evaluate(() => localStorage.getItem("da-consent-v1"))).toBe(stored);
  // no third-party requests at all
  const external: string[] = [];
  page.on("request", (r) => { if (!r.url().startsWith("http://localhost")) external.push(r.url()); });
  await page.goto("/kontakt");
  expect(external).toEqual([]);
});
