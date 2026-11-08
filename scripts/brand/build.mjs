// Regenerates every brand asset from public/logo.webp (the master logo) and the HTML sources here.
// Run: node scripts/brand/build.mjs   (needs network once for Poppins from Google Fonts)
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import assert from "node:assert/strict";

const root = path.resolve(fileURLToPath(import.meta.url), "../../..");
const p = (f) => path.join(root, f);
const MASTER = p("public/logo.webp"); // 512x512, transparent
await mkdir(p("public/brand"), { recursive: true });

// Badge geometry in the master (measured from the alpha channel): centre (254,242), outer ring r=219.
const CX = 254, CY = 242;
const NAVY = "#0a3158", GOLD = "#e2a94a"; // sampled from the badge ring

// 1) Primary logo: master trimmed to a square with even 8px margin, transparent.
const logo = await sharp(MASTER).extract({ left: 27, top: 14, width: 457, height: 457 }).png({ compressionLevel: 9 }).toBuffer();
await writeFile(p("public/brand/die-anpacker-logo.png"), logo);

// 2) Symbol: inner illustration of the badge (r=150) inside a plain navy ring with gold edge. No ring text, so it reads at 16-48px.
const r = 150, R = 172, S = 2 * R;
const crop = await sharp(MASTER).extract({ left: CX - R, top: CY - R, width: S, height: S }).png().toBuffer();
const disc = Buffer.from(`<svg width="${S}" height="${S}"><circle cx="${R}" cy="${R}" r="${r}" fill="#fff"/></svg>`);
const inner = await sharp(crop).composite([{ input: disc, blend: "dest-in" }]).png().toBuffer();
const ring = Buffer.from(`<svg width="${S}" height="${S}"><circle cx="${R}" cy="${R}" r="${R - 4}" fill="${NAVY}" stroke="${GOLD}" stroke-width="8"/></svg>`);
const symbol = await sharp(ring).composite([{ input: inner }]).png({ compressionLevel: 9 }).toBuffer();
await writeFile(p("public/brand/die-anpacker-symbol.png"), symbol);

const fit = (buf, size) => sharp(buf).resize(size, size, { kernel: "lanczos3" }).png({ compressionLevel: 9 }).toBuffer();
// opaque square: logo centred on white with `pad` px margin (iOS/Android fill transparency with black/grey)
const onWhite = async (buf, size, pad) =>
  sharp({ create: { width: size, height: size, channels: 4, background: "#ffffff" } })
    .composite([{ input: await fit(buf, size - 2 * pad), left: pad, top: pad }]).png({ compressionLevel: 9 }).toBuffer();

// 3) Favicons (app/ file conventions): .ico with 16/32/48 symbol PNGs, icon.png 192 symbol, apple-icon 180 full badge.
const icoSizes = [16, 32, 48];
const pngs = await Promise.all(icoSizes.map((s) => fit(symbol, s)));
const head = Buffer.alloc(6 + 16 * pngs.length);
head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(pngs.length, 4);
let offset = head.length;
pngs.forEach((png, i) => {
  const e = 6 + 16 * i;
  head.writeUInt8(icoSizes[i], e); head.writeUInt8(icoSizes[i], e + 1);
  head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
  head.writeUInt32LE(png.length, e + 8); head.writeUInt32LE(offset, e + 12);
  offset += png.length;
});
await writeFile(p("app/favicon.ico"), Buffer.concat([head, ...pngs]));
await writeFile(p("app/icon.png"), await fit(symbol, 192));
await writeFile(p("app/apple-icon.png"), await onWhite(logo, 180, 10));

// 4) Web app manifest icons (referenced by app/manifest.ts). Maskable keeps the badge inside the 80% safe circle.
await writeFile(p("public/brand/icon-192.png"), await fit(logo, 192));
await sharp(logo).extend({ top: 27, bottom: 28, left: 27, right: 28, background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ compressionLevel: 9 }).toFile(p("public/brand/icon-512.png"));
await writeFile(p("public/brand/icon-maskable-512.png"), await onWhite(logo, 512, 56));

// 5) HTML-composed assets: OG banner and the two lockups.
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
const src = (f, q = "") => pathToFileURL(p(`scripts/brand/${f}`)).href + q;

await page.setViewportSize({ width: 1200, height: 630 });
await page.goto(src("og-banner.html"), { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
assert.ok(await page.evaluate(() => document.fonts.check("700 96px Poppins")), "Poppins did not load");
const og = await page.screenshot({ type: "png" });
await mkdir(p("public/images"), { recursive: true });
await sharp(og).jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" }).toFile(p("public/images/og-die-anpacker.jpg"));

for (const [name, q] of [["die-anpacker-lockup.png", ""], ["die-anpacker-lockup-dark.png", "?dark"]]) {
  await page.setViewportSize({ width: 1400, height: 400 });
  await page.goto(src("lockup.html", q), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const shot = await page.locator("body").screenshot({ omitBackground: true });
  await sharp(shot).png({ compressionLevel: 9 }).toFile(p(`public/brand/${name}`));
}
await browser.close();

// Self-check: every output exists with the expected size.
const expect = {
  "public/images/og-die-anpacker.jpg": [1200, 630], "app/icon.png": [192, 192], "app/apple-icon.png": [180, 180],
  "public/brand/icon-192.png": [192, 192], "public/brand/icon-512.png": [512, 512], "public/brand/icon-maskable-512.png": [512, 512],
  "public/brand/die-anpacker-logo.png": [457, 457], "public/brand/die-anpacker-symbol.png": [344, 344],
};
for (const [f, [w, h]] of Object.entries(expect)) {
  const m = await sharp(p(f)).metadata();
  assert.deepEqual([m.width, m.height], [w, h], f);
}
console.log("brand assets written");
