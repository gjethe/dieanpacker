import { test } from "node:test";
import assert from "node:assert/strict";
import { checkFiles, clean, gruppe, looksLikeImage, validate } from "../../lib/anfrage.ts";

const base = { vorname: "Max", nachname: "Muster", email: "max@beispiel.at", telefon: "+43 660 1234567", leistung: "privatumzug", von_plz: "8010", nach_plz: "8041", beschreibung: "Drei Zimmer, vierter Stock ohne Lift." };

test("valid transport enquiry passes and drops unrelated fields", () => {
  const r = validate({ ...base, objektart: "Haus", bereiche: "Keller" });
  assert.equal(r.ok, true);
  if (r.ok) {
    assert.equal(r.data.objektart, undefined);
    assert.equal(r.data.von_plz, "8010");
  }
});

test("empty form reports all required fields", () => {
  const r = validate({});
  assert.equal(r.ok, false);
  if (!r.ok) for (const k of ["vorname", "nachname", "email", "telefon", "leistung", "beschreibung"]) assert.ok(r.errors[k as keyof typeof r.errors], k);
});

test("invalid email and phone are rejected", () => {
  const r = validate({ ...base, email: "max@", telefon: "abc" });
  assert.equal(r.ok, false);
  if (!r.ok) {
    assert.ok(r.errors.email);
    assert.ok(r.errors.telefon);
  }
});

test("phone optional when contact by e-mail", () => {
  const r = validate({ ...base, telefon: "", kontaktweg: "email" });
  assert.equal(r.ok, true);
});

test("clearance requires object PLZ, not route PLZs", () => {
  const r = validate({ ...base, leistung: "entruempelung", von_plz: "", nach_plz: "" });
  assert.equal(r.ok, false);
  if (!r.ok) {
    assert.ok(r.errors.objekt_plz);
    assert.equal(r.errors.von_plz, undefined);
  }
  assert.equal(validate({ ...base, leistung: "entruempelung", objekt_plz: "8020" }).ok, true);
});

test("service groups", () => {
  assert.equal(gruppe("firmenumzug"), "transport");
  assert.equal(gruppe("messiewohnung"), "raeumung");
  assert.equal(gruppe("moebelmontage"), "vorort");
});

test("clean strips control characters and caps length", () => {
  assert.equal(clean("a\u0000b\u0007c", 10), "abc");
  assert.equal(clean("x".repeat(50), 5), "xxxxx");
  assert.equal(clean(42, 5), "");
});

test("file checks: count, type, size", () => {
  const ok = { name: "a.jpg", type: "image/jpeg", size: 500_000 };
  assert.equal(checkFiles([ok]), null);
  assert.match(checkFiles(Array(6).fill(ok)) ?? "", /höchstens/);
  assert.match(checkFiles([{ ...ok, type: "application/pdf" }]) ?? "", /Format/);
  assert.match(checkFiles([{ ...ok, size: 3.5 * 1024 * 1024 }]) ?? "", /zu groß/);
  assert.match(checkFiles([{ ...ok, size: 2.5e6 }, { ...ok, size: 2.5e6 }]) ?? "", /zusammen/);
});

test("magic bytes", () => {
  assert.equal(looksLikeImage(new Uint8Array([0xff, 0xd8, 0xff, 0xe0])), true);
  assert.equal(looksLikeImage(new Uint8Array([0x89, 0x50, 0x4e, 0x47])), true);
  assert.equal(looksLikeImage(new TextEncoder().encode("%PDF-1.7 fake")), false);
});

test("line breaks in names cannot inject mail headers", () => {
  const r = validate({ ...base, vorname: "Max\r\nBcc: x@evil.test", nachname: "Muster\nX" });
  assert.equal(r.ok, true);
  if (r.ok) {
    assert.doesNotMatch(r.data.vorname, /[\r\n]/);
    assert.doesNotMatch(r.data.nachname, /[\r\n]/);
  }
});
