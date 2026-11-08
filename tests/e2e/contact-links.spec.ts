import { expect, test } from "@playwright/test";

test("phone, WhatsApp and e-mail links are correct and visible", async ({ page }) => {
  await page.goto("/kontakt");
  const tel = page.locator('a[href="tel:+436603926662"]:visible');
  await expect(tel.first()).toBeVisible();
  const wa = page.locator('a[href^="https://wa.me/436603926662?text="]:visible').first();
  await expect(wa).toBeVisible();
  const href = (await wa.getAttribute("href"))!;
  expect(decodeURIComponent(href.split("text=")[1])).toContain("Hallo Die Anpacker");
  expect(await wa.getAttribute("rel")).toContain("noopener");
  await expect(page.locator('a[href="mailto:office@dieanpacker.at"]:visible').first()).toBeVisible();
});

test("primary CTAs lead to the contact page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Unverbindlich anfragen" }).first().click();
  await expect(page).toHaveURL(/\/kontakt$/);
  await expect(page.locator("h1:visible")).toHaveText("Erzählen Sie uns, was ansteht.");
});

test("hero quick-start prefills the contact form", async ({ page, isMobile }) => {
  await page.goto("/");
  await page.locator('select[name="leistung"]').first().selectOption("moebeltransport");
  await page.locator('input[name="von"]').fill("8010");
  await page.locator('input[name="nach"]').fill("8041");
  await page.getByRole("button", { name: "Weiter zur Anfrage" }).click();
  await expect(page).toHaveURL(/leistung=moebeltransport/);
  await expect(page.locator("#leistung")).toHaveValue("moebeltransport");
  await expect(page.locator("#von_plz")).toHaveValue("8010");
  await expect(page.locator("#nach_plz")).toHaveValue("8041");
  test.info().annotations.push({ type: "viewport", description: isMobile ? "mobile" : "desktop" });
});

test("Google Maps loads only after a click", async ({ page }) => {
  await page.route("https://www.google.com/**", (r) => r.fulfill({ body: "" })); // no real Google traffic in tests
  await page.goto("/kontakt");
  await expect(page.locator("iframe")).toHaveCount(0);
  await page.locator("footer").getByRole("button", { name: "Karte laden" }).click();
  await expect(page.locator("footer iframe")).toHaveAttribute("src", /google\.com\/maps\/embed.*Die%20Anpacker/);
  await expect(page.locator('main a[href^="https://www.google.com/maps?cid="]:visible')).toBeVisible();
});
