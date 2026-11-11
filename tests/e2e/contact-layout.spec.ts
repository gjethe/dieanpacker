import { expect, test } from "@playwright/test";

for (const [width, height] of [[375, 812], [390, 844], [430, 932], [768, 1024], [1440, 900]]) {
  test(`contact page order and controls at ${width} × ${height}`, async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto("/kontakt");
    const direct = page.getByRole("complementary", { name: "Direkt erreichen" });
    const form = page.getByRole("form", { name: "Anfrage senden" });
    const checklist = page.getByRole("heading", { name: "Was wir für ein Angebot brauchen" }).locator("..");
    await expect(form).toHaveCount(1);
    const box = (locator: typeof form) => locator.boundingBox().then((b) => { expect(b).toBeTruthy(); return b!; });
    const d = await box(direct), f = await box(form), c = await box(checklist);
    expect(f.y).toBeGreaterThanOrEqual(d.y + d.height);
    expect(f.y - (d.y + d.height)).toBeLessThanOrEqual(32);
    expect(c.y).toBeGreaterThanOrEqual(f.y + f.height);
    expect(await form.locator("input:not([type=hidden]):not([name=website]), select, textarea").first().getAttribute("name")).toBe("vorname");
    await expect(form.locator("legend")).toHaveText([
      "1. Wie erreichen wir Sie?", "2. Was steht an?", "3. Von wo nach wo?", "4. Beschreibung und Fotos",
    ]);
    const contact = form.getByRole("group", { name: "1. Wie erreichen wir Sie?", exact: true });
    expect(await contact.locator("input").evaluateAll((inputs) => inputs.map((input) => input.getAttribute("name")))).toEqual([
      "vorname", "nachname", "email", "telefon", "kontaktweg", "kontaktweg", "kontaktweg",
    ]);
    for (const id of ["vorname", "nachname", "email", "telefon", "beschreibung"]) {
      await expect(form.locator(`#${id}`)).toHaveCount(1);
    }
    const description = form.getByRole("group", { name: "4. Beschreibung und Fotos", exact: true });
    await expect(description.locator("#beschreibung")).toHaveCount(1);
    await expect(form.locator('input[type="file"]')).toHaveCount(0);
    expect((await box(contact)).y + (await box(contact)).height).toBeLessThanOrEqual((await box(description)).y);
    await expect(form.getByRole("link", { name: /Datenschutz/ })).toHaveAttribute("href", "/datenschutz#kontaktformular");
    await expect(description.getByRole("link", { name: /WhatsApp/ , exact: false })).toHaveAttribute("href", /^https:\/\/wa.me\/436603926662\?text=/);
    expect(await page.locator('a[href], link[href], meta[content]').evaluateAll((elements) => elements.flatMap((element) => {
      const value = element.getAttribute("href") ?? element.getAttribute("content") ?? "";
      return /localhost|127\.0\.0\.1/.test(value) ? [value] : [];
    }))).toEqual([]);
    expect((await box(page.locator("#vorname"))).y).toBeLessThan((await box(page.locator("#beschreibung"))).y);
    await expect(direct.locator('a[href="tel:+436603926662"]')).toBeVisible();
    await expect(direct.locator('a[href="mailto:office@dieanpacker.at"]')).toBeVisible();
    await expect(direct.getByRole("link", { name: "WhatsApp schreiben" })).toHaveAttribute("href", /^https:\/\/wa.me\/436603926662\?text=/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width >= 1024) {
      expect(f.width).toBeGreaterThan(950);
      const pickup = await box(form.getByText("Abholadresse", { exact: true }).locator(".."));
      const destination = await box(form.getByText("Zieladresse", { exact: true }).locator(".."));
      expect(Math.abs(pickup.y - destination.y)).toBeLessThan(1);
      expect(destination.x).toBeGreaterThanOrEqual(pickup.x + pickup.width);
      const links = await direct.getByRole("link").all();
      const boxes = await Promise.all(links.map(box));
      expect(Math.max(...boxes.map((b) => b.y)) - Math.min(...boxes.map((b) => b.y))).toBeLessThan(1);
    }
    const submit = form.getByRole("button", { name: "Anfrage unverbindlich senden" });
    await submit.scrollIntoViewIfNeeded();
    if (width < 768) {
      const bar = page.locator(".contact-bar");
      await expect(bar).toBeVisible();
      expect((await box(submit)).y + (await box(submit)).height).toBeLessThanOrEqual((await box(bar)).y);
      await expect(bar.locator('a[href="tel:+436603926662"]')).toBeVisible();
      await expect(bar.locator('a[href^="https://wa.me/436603926662"]')).toBeVisible();
      await bar.getByRole("link", { name: "Anfrage", exact: true }).click();
      await expect(page).toHaveURL(/\/kontakt$/);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({ path: testInfo.outputPath(`contact-${width}.png`), fullPage: true });
    expect(errors).toEqual([]);
  });
}
