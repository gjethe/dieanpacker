import { NextResponse } from "next/server";
import { checkFiles, looksLikeImage, validate, type Errors } from "@/lib/anfrage";
import { MailConfigError, sendAnfrage } from "@/lib/mail";

const MAX_BODY = 4.5 * 1024 * 1024;
const MIN_FILL_MS = 2500;
const LIMIT = Number(process.env.ANFRAGE_RATE_LIMIT || 5); // requests per IP per 10 minutes

// shortcut: per-instance memory, so limits reset on cold start and are not shared across
// serverless instances. Upgrade to Vercel Firewall rate-limit rules or a KV store if spam appears.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > LIMIT;
}

function reply(req: Request, status: number, body: { ok: boolean; message?: string; errors?: Errors }) {
  if (req.headers.get("accept")?.includes("application/json")) return NextResponse.json(body, { status });
  // No-JS fallback: plain HTML form post -> redirect to a page that explains the result.
  const url = new URL(body.ok ? "/kontakt/danke" : "/kontakt?status=fehler#formular", req.url);
  return NextResponse.redirect(url, 303);
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(req.url).host) {
    return reply(req, 403, { ok: false, message: "Ungültige Anfrage." });
  }
  if (Number(req.headers.get("content-length") || 0) > MAX_BODY) {
    return reply(req, 413, { ok: false, message: "Die Anfrage ist zu groß. Bitte weniger oder kleinere Fotos anhängen oder diese per WhatsApp schicken." });
  }
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
  if (limited(ip)) {
    return reply(req, 429, { ok: false, message: "Zu viele Anfragen in kurzer Zeit. Bitte versuchen Sie es in einigen Minuten erneut oder rufen Sie uns an." });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return reply(req, 400, { ok: false, message: "Die Anfrage konnte nicht gelesen werden." });
  }

  // Spam traps: honeypot field filled, or submitted faster than a human can type.
  // "t" is set by the JS form only; no-JS submissions are still covered by the honeypot.
  const started = Number(form.get("t"));
  if (form.get("website") || (started && Date.now() - started < MIN_FILL_MS)) {
    return reply(req, 200, { ok: true }); // pretend success so bots do not adapt
  }

  const fields: Record<string, unknown> = {};
  for (const [k, v] of form.entries()) if (typeof v === "string") fields[k] = v;
  const result = validate(fields);

  const files = form.getAll("fotos").filter((f): f is File => f instanceof File && f.size > 0);
  const fileError = checkFiles(files);
  if (!result.ok || fileError) {
    const errors: Errors = result.ok ? {} : { ...result.errors };
    if (fileError) errors.fotos = fileError;
    return reply(req, 422, { ok: false, message: "Bitte prüfen Sie die markierten Felder.", errors });
  }

  const attachments = [];
  for (const [i, f] of files.entries()) {
    const content = Buffer.from(await f.arrayBuffer());
    if (!looksLikeImage(content)) {
      return reply(req, 422, { ok: false, message: "Bitte prüfen Sie die markierten Felder.", errors: { fotos: `„${f.name}“ ist kein gültiges Bild.` } });
    }
    const ext = f.type.split("/")[1].replace("jpeg", "jpg");
    attachments.push({ filename: `foto-${i + 1}.${ext}`, content, contentType: f.type });
  }

  try {
    await sendAnfrage(result.data, attachments);
  } catch (err) {
    // Log only the error type, never the enquiry content.
    console.error("anfrage: send failed:", err instanceof MailConfigError ? "not configured" : (err as Error)?.name || "unknown");
    return reply(req, err instanceof MailConfigError ? 503 : 502, {
      ok: false,
      message: "Ihre Anfrage konnte gerade nicht versendet werden. Bitte rufen Sie uns an, schreiben Sie per WhatsApp oder direkt an office@dieanpacker.at.",
    });
  }

  return reply(req, 200, { ok: true });
}
