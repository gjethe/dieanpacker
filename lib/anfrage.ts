// Enquiry form schema + validation. Shared by the client form and the API route.
// Kept dependency-free so it can be unit-tested with `node --test`.

export const LEISTUNGEN = {
  privatumzug: "Privatumzug",
  firmenumzug: "Firmen- und Büroumzug",
  entruempelung: "Entrümpelung / Räumung",
  haushaltsaufloesung: "Haushaltsauflösung / Verlassenschaftsräumung",
  messiewohnung: "Messiewohnung / stark überfüllte Wohnung",
  moebeltransport: "Möbeltransport",
  moebelmontage: "Möbelmontage / Demontage",
  sonstiges: "Sonstiges",
} as const;
export type Leistung = keyof typeof LEISTUNGEN;

export type Gruppe = "transport" | "raeumung" | "vorort";
export const gruppe = (l: string): Gruppe =>
  l === "privatumzug" || l === "firmenumzug" || l === "moebeltransport"
    ? "transport"
    : l === "entruempelung" || l === "haushaltsaufloesung" || l === "messiewohnung"
      ? "raeumung"
      : "vorort";

export const KONTAKTWEGE = { telefon: "Telefon", email: "E-Mail", whatsapp: "WhatsApp" } as const;
export const LIFT = { ja: "Ja", nein: "Nein", unbekannt: "Weiß ich nicht" } as const;
export const OBJEKTARTEN = ["Wohnung", "Haus", "Keller", "Dachboden", "Garage", "Büro / Gewerbe", "Sonstiges"] as const;
export const UMFANG = ["Einzelne Gegenstände", "Ein Raum", "Mehrere Räume", "Ganze Wohnung", "Ganzes Haus"] as const;

export const FILES = {
  max: 5,
  maxEach: 3 * 1024 * 1024,
  maxTotal: 4 * 1024 * 1024, // stays below the 4.5 MB request limit of serverless hosts
  types: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
};

// Field name -> max length. Anything not listed here is ignored by the server.
export const FIELDS = {
  vorname: 80, nachname: 80, email: 160, telefon: 40, kontaktweg: 20, leistung: 40,
  von_adresse: 160, von_plz: 10, von_stock: 30, von_lift: 20,
  nach_adresse: 160, nach_plz: 10, nach_stock: 30, nach_lift: 20,
  objekt_adresse: 160, objekt_plz: 10, objektart: 40, bereiche: 300, umfang: 40, objekt_stock: 30, objekt_lift: 20,
  zimmer: 200, montage: 300, termin: 120, beschreibung: 4000,
} as const;
export type Field = keyof typeof FIELDS;
export type Anfrage = Partial<Record<Field, string>> & { vorname: string; nachname: string; email: string; leistung: Leistung; beschreibung: string };

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;
const PHONE = /^\+?[0-9 ()/-]{6,25}$/;
const PLZ = /^[0-9]{4,5}$/;

export function clean(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  // strip control chars (keeps \n and \t), trim, cap length
  return v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
}

export type Errors = Partial<Record<Field | "fotos" | "form", string>>;

export function validate(input: Record<string, unknown>): { ok: true; data: Anfrage } | { ok: false; errors: Errors } {
  const d: Record<string, string> = {};
  for (const [k, max] of Object.entries(FIELDS)) d[k] = clean(input[k], max);
  const e: Errors = {};

  if (!d.vorname) e.vorname = "Bitte geben Sie Ihren Vornamen an.";
  if (!d.nachname) e.nachname = "Bitte geben Sie Ihren Nachnamen an.";
  if (!d.email) e.email = "Bitte geben Sie Ihre E-Mail-Adresse an.";
  else if (!EMAIL.test(d.email)) e.email = "Bitte prüfen Sie die E-Mail-Adresse, z. B. name@beispiel.at.";
  if (!(d.kontaktweg in KONTAKTWEGE)) d.kontaktweg = "telefon";
  if (d.telefon && !PHONE.test(d.telefon)) e.telefon = "Bitte geben Sie eine gültige Telefonnummer an, z. B. +43 660 1234567.";
  else if (!d.telefon && d.kontaktweg !== "email") e.telefon = "Für Rückruf oder WhatsApp brauchen wir Ihre Telefonnummer.";
  if (!(d.leistung in LEISTUNGEN)) e.leistung = "Bitte wählen Sie eine Leistung aus.";

  const g = gruppe(d.leistung);
  if (g === "transport") {
    if (!PLZ.test(d.von_plz)) e.von_plz = "Bitte geben Sie die Postleitzahl der Abholadresse an.";
    if (!PLZ.test(d.nach_plz)) e.nach_plz = "Bitte geben Sie die Postleitzahl der Zieladresse an.";
  } else if (g === "raeumung") {
    if (!PLZ.test(d.objekt_plz)) e.objekt_plz = "Bitte geben Sie die Postleitzahl des Objekts an.";
  } else if (d.objekt_plz && !PLZ.test(d.objekt_plz)) {
    e.objekt_plz = "Bitte prüfen Sie die Postleitzahl.";
  }

  if (d.beschreibung.length < 10) e.beschreibung = "Bitte beschreiben Sie Ihr Vorhaben in ein paar Sätzen.";

  // Drop fields that do not belong to the selected service so the e-mail stays relevant.
  const keep = (k: string) =>
    g === "transport" ? !k.startsWith("objekt_") && k !== "objektart" && k !== "bereiche" && k !== "umfang"
    : g === "raeumung" ? !k.startsWith("von_") && !k.startsWith("nach_") && k !== "zimmer"
    : !k.startsWith("von_") && !k.startsWith("nach_");
  for (const k of Object.keys(d)) if (!d[k] || !keep(k)) delete d[k];

  return Object.keys(e).length ? { ok: false, errors: e } : { ok: true, data: d as Anfrage };
}

export function checkFiles(files: { name: string; type: string; size: number }[]): string | null {
  if (files.length > FILES.max) return `Bitte wählen Sie höchstens ${FILES.max} Fotos aus.`;
  let total = 0;
  for (const f of files) {
    if (!FILES.types.includes(f.type)) return `„${f.name}“ hat ein nicht unterstütztes Format. Erlaubt sind JPG, PNG, WebP und HEIC.`;
    if (f.size > FILES.maxEach) return `„${f.name}“ ist zu groß (max. 3 MB pro Foto).`;
    total += f.size;
  }
  if (total > FILES.maxTotal) return "Die Fotos sind zusammen zu groß (max. 4 MB). Bitte weniger Fotos auswählen oder per WhatsApp schicken.";
  return null;
}

// Magic-byte check so a renamed non-image cannot be attached.
export function looksLikeImage(b: Uint8Array): boolean {
  const s = (i: number, str: string) => [...str].every((c, j) => b[i + j] === c.charCodeAt(0));
  return (
    (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) || // JPEG
    (b[0] === 0x89 && s(1, "PNG")) || // PNG
    (s(0, "RIFF") && s(8, "WEBP")) || // WebP
    (s(4, "ftyp") && ["heic", "heix", "hevc", "mif1", "msf1", "heim", "heis"].some((t) => s(8, t))) // HEIC/HEIF
  );
}
