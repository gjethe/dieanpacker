import { expect, test, type Page } from "@playwright/test";
import { LEISTUNGEN, LIFT, OBJEKTARTEN, UMFANG } from "../../lib/anfrage";

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
  await expect(page.locator("#vorname")).toBeFocused();
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

test("valid enquiry without uploads is accepted and the button blocks double submits", async ({ page }) => {
  await page.goto("/kontakt");
  await page.waitForTimeout(2600); // the API rejects forms filled faster than a human could
  await fillValid(page);
  for (const [id, value] of Object.entries({ termin: "Ende April", von_adresse: "Testweg 1", von_stock: "2", nach_adresse: "Testweg 2", nach_stock: "3", zimmer: "Drei Zimmer", montage: "Doppelbett" })) {
    await page.locator(`#${id}`).fill(value);
  }
  await page.locator("#von_lift").selectOption("ja");
  await page.locator("#nach_lift").selectOption("nein");
  const expectedFields = await page.getByRole("form", { name: "Anfrage senden" }).evaluate((form: HTMLFormElement) =>
    Object.fromEntries([...new FormData(form)].filter(([name]) => name !== "t")),
  );
  let posts = 0;
  page.on("request", (r) => { if (r.url().endsWith("/api/anfrage") && r.method() === "POST") posts++; });
  let release!: () => void;
  const ready = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/api/anfrage", async (route) => {
    await ready;
    const request = route.request();
    const data = await new Request(request.url(), { method: "POST", headers: { "Content-Type": request.headers()["content-type"] }, body: new Uint8Array(request.postDataBuffer()!).buffer }).formData();
    for (const [name, value] of Object.entries(expectedFields)) expect(data.get(name), name).toBe(value);
    expect(data.getAll("fotos")).toHaveLength(0);
    await route.continue();
  });
  const btn = page.getByRole("button", { name: "Anfrage unverbindlich senden" });
  await btn.dblclick();
  const sending = page.getByRole("form", { name: "Anfrage senden" }).locator("button[type=submit]");
  await expect(sending).toBeDisabled();
  await expect(sending).toHaveText(/Wird gesendet/);
  release();
  await expect(page.getByRole("status")).toContainText("Danke, Ihre Anfrage ist bei uns angekommen.");
  expect(posts).toBe(1);
});

test("all service dropdowns retain their options and contact sections", async ({ page }) => {
  await page.goto("/kontakt");
  await expect(page.locator("#leistung option")).toHaveText(Object.values(LEISTUNGEN));
  for (const service of Object.keys(LEISTUNGEN)) {
    await page.locator("#leistung").selectOption(service);
    await expect(page.locator("form legend").nth(0)).toHaveText("1. Wie erreichen wir Sie?");
    await expect(page.locator("form legend").nth(3)).toHaveText("4. Beschreibung und Fotos");
    for (const select of await page.locator('select[id$="_lift"]').all()) {
      await expect(select.locator("option")).toHaveText(["Bitte wählen", ...Object.values(LIFT)]);
      await select.selectOption("ja");
      await expect(select).toHaveValue("ja");
    }
    if (await page.locator("#objektart").count()) {
      await expect(page.locator("#objektart option")).toHaveText(["Bitte wählen", ...OBJEKTARTEN]);
      await expect(page.locator("#umfang option")).toHaveText(["Bitte wählen", ...UMFANG]);
      await page.locator("#objektart").selectOption(OBJEKTARTEN[0]);
      await page.locator("#umfang").selectOption(UMFANG[0]);
    }
  }
});

test("photos are sent through WhatsApp instead of uploaded", async ({ page }) => {
  await page.goto("/kontakt");
  const form = page.getByRole("form", { name: "Anfrage senden" });
  await expect(form.locator('input[type="file"]')).toHaveCount(0);
  await expect(form.getByText("Fotos per WhatsApp senden", { exact: true })).toBeVisible();
  const whatsapp = form.locator('a[href^="https://wa.me/"]').last();
  await expect(whatsapp).toHaveAttribute("href", /^https:\/\/wa.me\/436603926662\?text=/);
  await expect(whatsapp).toHaveAttribute("target", "_blank");
  await expect(whatsapp).toHaveAttribute("rel", /noopener/);
});

test("provider failure is reported honestly in the UI", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-forwarded-for": `smtp-ui-${Date.now()}` });
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
    const res = await request.post("http://localhost:3101/api/anfrage", { headers: { ...json, "x-forwarded-for": `smtp-api-${Date.now()}` }, multipart: multipart(), timeout: 60_000 });
    expect(res.status()).toBe(502);
    expect((await res.json()).ok).toBe(false);
  });

  test("no-JS form post redirects to the thank-you page", async ({ request }) => {
    const res = await request.post("/api/anfrage", { multipart: { ...valid }, maxRedirects: 0 });
    expect(res.status()).toBe(303);
    expect(res.headers()["location"]).toContain("/kontakt/danke");
  });
});
