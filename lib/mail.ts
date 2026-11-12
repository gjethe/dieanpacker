import "server-only";
import nodemailer from "nodemailer";
import { type Anfrage, KONTAKTWEGE, LEISTUNGEN, LIFT } from "./anfrage";
import { site } from "./site";

export class MailConfigError extends Error {}

function transport() {
  // Test-only: builds the complete MIME message without sending it. Never set in production.
  if (process.env.MAIL_TRANSPORT === "json") return nodemailer.createTransport({ jsonTransport: true });
  const { SMTP_HOST, SMTP_PORT, SMTP_USER } = process.env;
  const SMTP_PASS = process.env.SMTP_PASSWORD || process.env.SMTP_PASS; // SMTP_PASS: legacy name, still accepted
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) throw new MailConfigError("SMTP not configured");
  const port = Number(SMTP_PORT || 465);
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const lift = (v?: string) => (v ? LIFT[v as keyof typeof LIFT] ?? v : undefined);

export function buildMessage(d: Anfrage) {
  const name = `${d.vorname} ${d.nachname}`;
  const route = d.von_plz && d.nach_plz ? ` (${d.von_plz} → ${d.nach_plz})` : d.objekt_plz ? ` (${d.objekt_plz})` : "";
  const subject = `Anfrage ${LEISTUNGEN[d.leistung]}: ${name}${route}`;

  const sections: [string, [string, string | undefined][]][] = [
    ["Kontakt", [
      ["Name", name],
      ["E-Mail", d.email],
      ["Telefon", d.telefon],
      ["Bevorzugter Kontaktweg", KONTAKTWEGE[d.kontaktweg as keyof typeof KONTAKTWEGE]],
    ]],
    ["Auftrag", [
      ["Leistung", LEISTUNGEN[d.leistung]],
      ["Wunschtermin / Zeitraum", d.termin],
    ]],
    ["Abholadresse", [["Adresse", d.von_adresse], ["PLZ", d.von_plz], ["Stockwerk", d.von_stock], ["Lift", lift(d.von_lift)]]],
    ["Zieladresse", [["Adresse", d.nach_adresse], ["PLZ", d.nach_plz], ["Stockwerk", d.nach_stock], ["Lift", lift(d.nach_lift)]]],
    ["Objekt", [
      ["Adresse", d.objekt_adresse], ["PLZ", d.objekt_plz], ["Objektart", d.objektart], ["Bereiche", d.bereiche],
      ["Umfang", d.umfang], ["Stockwerk", d.objekt_stock], ["Lift", lift(d.objekt_lift)],
    ]],
    ["Details", [["Räume / Umfang", d.zimmer], ["Möbelmontage", d.montage]]],
  ];
  const filled = sections
    .map(([t, rows]) => [t, rows.filter((r): r is [string, string] => !!r[1])] as const)
    .filter(([, rows]) => rows.length);

  const text = [
    `Neue Anfrage über ${site.url.replace(/^https?:\/\//, "")}`,
    "",
    ...filled.flatMap(([t, rows]) => [`== ${t} ==`, ...rows.map(([k, v]) => `${k}: ${v}`), ""]),
    "== Beschreibung ==",
    d.beschreibung,
    "",
    "Antworten Sie direkt auf diese E-Mail, um der anfragenden Person zu schreiben.",
  ].join("\n");

  const html = `<!doctype html><html lang="de"><body style="margin:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#321004">
<div style="max-width:640px;margin:0 auto;padding:24px">
<h1 style="font-size:20px;margin:0 0 4px">${esc(subject)}</h1>
<p style="margin:0 0 20px;color:#6b5a52;font-size:14px">Über das Anfrageformular auf ${esc(site.url)}</p>
${filled
  .map(
    ([t, rows]) => `<h2 style="font-size:15px;margin:20px 0 6px;border-bottom:1px solid #ebebeb;padding-bottom:4px">${esc(t)}</h2>
<table role="presentation" style="border-collapse:collapse;width:100%;font-size:14px">${rows
      .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#6b5a52;width:40%;vertical-align:top">${esc(k)}</td><td style="padding:4px 0">${esc(v)}</td></tr>`)
      .join("")}</table>`,
  )
  .join("\n")}
<h2 style="font-size:15px;margin:20px 0 6px;border-bottom:1px solid #ebebeb;padding-bottom:4px">Beschreibung</h2>
<p style="white-space:pre-wrap;font-size:14px;line-height:1.5;background:#f9f9f9;border-radius:12px;padding:12px">${esc(d.beschreibung)}</p>
<p style="font-size:13px;color:#6b5a52">Auf diese E-Mail antworten, um ${esc(name)} direkt zu schreiben.</p>
</div></body></html>`;

  return { subject, text, html };
}

export async function sendAnfrage(d: Anfrage, attachments: { filename: string; content: Buffer; contentType: string }[]) {
  const t = transport();
  const { subject, text, html } = buildMessage(d);
  const fromAddress = process.env.MAIL_FROM || process.env.SMTP_USER || site.email;
  const info = await t.sendMail({
    // Sender is always our own authenticated mailbox (SPF/DKIM aligned); the visitor goes in Reply-To.
    from: { name: "Website Die Anpacker", address: fromAddress },
    to: process.env.CONTACT_EMAIL || process.env.CONTACT_TO || site.email,
    replyTo: { name: `${d.vorname} ${d.nachname}`, address: d.email },
    subject,
    text,
    html,
    attachments,
    headers: { "X-Entity-Ref-ID": crypto.randomUUID() }, // prevents Gmail-style thread collapsing
  });
  return info;
}
