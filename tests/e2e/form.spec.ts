import { expect, test, type Page } from "@playwright/test";

const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, ...Array(200).fill(0)]);

async function fillValid(page: Page) {
  await page.locator("#leistung").selectOption("privatumzug");
  await page.locator("#von_plz").fill("8010");
  await page.locator("#nach_plz").fill("8041");
  await page.locator("#beschreibung").fill("TEST – bitte ignorieren. Drei Zimmer, vierter Stock ohne Lift.");
  await page.locator("#vorname").fill("Test");
  await page.locator("#nachname").fill("Anfrage");
  await page.locator("#email").fill("test@beispiel.at");
  await page.locator("#telefon").fill("+43 660 1234567");
}

test("empty submit shows field errors and focuses the first one", async ({ page }) => {
  await page.goto("/kontakt");
  await page.getByRole("button", { name: "Anfrage unverbindlich senden" }).click();
  await expect(page.getByText("Bitte prüfen Sie die markierten Felder.")).toBeVisible();
  for (const id of ["von_plz", "nach_plz", "beschreibung", "vorname", "nachname", "email", "telefon"]) {
    await expect(page.locator(`#${id}`)).toHaveAttribute("aria-invalid", "true");
  }
  await expect(page.locator("#von_plz")).toBeFocused();
});

test("invalid e-mail and phone are reported", async ({ page }) => {
  await page.goto("/kontakt");
  await fillValid(page);
  await page.locator("#email").fill("kein-at-zeichen");
  await page.locator("#telefon").fill("abc");
  await page.getByRole("button", { name: "Anfrage unverbindlich senden" }).click();
  await expect(page.locator("#email-err")).toContainText("E-Mail-Adresse");
  await expect(page.locator("#telefon-err")).toContainText("Telefonnummer");
});

test("conditional sections follow the selected service", async ({ page }) => {
  await page.goto("/kontakt");
  await expect(page.locator("#von_plz")).toBeVisible();
  await page.locator("#leistung").selectOption("haushaltsaufloesung");
  await expect(page.locator("#von_plz")).toHaveCount(0);
  await expect(page.locator("#objektart")).toBeVisible();
  await expect(page.locator("#umfang")).toBeVisible();
});

test("valid enquiry with photo is accepted and the button blocks double submits", async ({ page }) => {
  await page.goto("/kontakt");
  await page.waitForTimeout(2600); // the API rejects forms filled faster than a human could
  await fillValid(page);
  await page.locator("#fotos-input").setInputFiles({ name: "zimmer.jpg", mimeType: "image/jpeg", buffer: jpeg });
  await expect(page.getByText("zimmer.jpg")).toBeVisible();
  let posts = 0;
  page.on("request", (r) => { if (r.url().endsWith("/api/anfrage") && r.method() === "POST") posts++; });
  const btn = page.getByRole("button", { name: "Anfrage unverbindlich senden" });
  await btn.dblclick();
  await expect(page.getByRole("status")).toContainText("Danke, Ihre Anfrage ist bei uns angekommen.");
  expect(posts).toBe(1);
});

test("provider failure is reported honestly in the UI", async ({ page }) => {
  await page.goto("http://localhost:3101/kontakt");
  await page.waitForTimeout(2600);
  await fillValid(page);
  await page.getByRole("button", { name: "Anfrage unverbindlich senden" }).click();
  await expect(page.getByRole("form", { name: "Anfrage senden" }).getByRole("alert")).toContainText("konnte gerade nicht versendet werden", { timeout: 30_000 });
  await expect(page.getByText("Danke, Ihre Anfrage")).toHaveCount(0);
});

test.describe("API", () => {
  const valid = { vorname: "Test", nachname: "Anfrage", email: "test@beispiel.at", telefon: "+43 660 1234567", leistung: "privatumzug", von_plz: "8010", nach_plz: "8041", beschreibung: "TEST – bitte ignorieren." };
  const multipart = (extra: Record<string, unknown> = {}) => ({ ...valid, t: String(Date.now() - 10_000), ...extra });
  const json = { Accept: "application/json" };

  test("server-side validation rejects bad input", async ({ request }) => {
    const res = await request.post("/api/anfrage", { headers: json, multipart: multipart({ email: "x" }) });
    expect(res.status()).toBe(422);
    expect((await res.json()).errors.email).toBeTruthy();
  });

  test("honeypot submissions are swallowed", async ({ request }) => {
    const res = await request.post("/api/anfrage", { headers: json, multipart: multipart({ website: "http://spam.example" }) });
    expect(res.status()).toBe(200);
  });

  test("unsupported attachment type is rejected", async ({ request }) => {
    const res = await request.post("/api/anfrage", { headers: json, multipart: multipart({ fotos: { name: "x.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.7") } }) });
    expect(res.status()).toBe(422);
    expect((await res.json()).errors.fotos).toContain("Format");
  });

  test("spoofed image type is rejected by magic bytes", async ({ request }) => {
    const res = await request.post("/api/anfrage", { headers: json, multipart: multipart({ fotos: { name: "x.jpg", mimeType: "image/jpeg", buffer: Buffer.from("not an image") } }) });
    expect(res.status()).toBe(422);
  });

  test("oversized attachment is rejected", async ({ request }) => {
    const big = Buffer.concat([jpeg, Buffer.alloc(3.2 * 1024 * 1024)]);
    const res = await request.post("/api/anfrage", { headers: json, multipart: multipart({ fotos: { name: "gross.jpg", mimeType: "image/jpeg", buffer: big } }) });
    expect(res.status()).toBe(422);
    expect((await res.json()).errors.fotos).toContain("zu groß");
  });

  test("request body over 4.5 MB is refused before parsing", async ({ request }) => {
    const huge = Buffer.concat([jpeg, Buffer.alloc(5 * 1024 * 1024)]);
    const res = await request.post("/api/anfrage", { headers: json, multipart: multipart({ fotos: { name: "riesig.jpg", mimeType: "image/jpeg", buffer: huge } }) });
    expect(res.status()).toBe(413);
  });

  test("cross-origin posts are refused", async ({ request }) => {
    const res = await request.post("/api/anfrage", { headers: { ...json, Origin: "https://evil.example" }, multipart: multipart() });
    expect(res.status()).toBe(403);
  });

  test("provider error returns 502, never success", async ({ request }) => {
    const res = await request.post("http://localhost:3101/api/anfrage", { headers: json, multipart: multipart(), timeout: 60_000 });
    expect(res.status()).toBe(502);
    expect((await res.json()).ok).toBe(false);
  });

  test("no-JS form post redirects to the thank-you page", async ({ request }) => {
    const res = await request.post("/api/anfrage", { multipart: { ...valid }, maxRedirects: 0 });
    expect(res.status()).toBe(303);
    expect(res.headers()["location"]).toContain("/kontakt/danke");
  });
});
