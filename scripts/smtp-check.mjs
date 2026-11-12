// Checks the Hostinger SMTP login and optionally sends one test mail.
// Usage: node scripts/smtp-check.mjs [--send]   (reads .env/.env.local exactly like Next.js, incl. $ escaping)
import nodemailer from "nodemailer";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());

const { SMTP_HOST, SMTP_PORT = "465", SMTP_SECURE, SMTP_USER, MAIL_FROM } = process.env;
const pass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;
const to = process.env.CONTACT_EMAIL || process.env.CONTACT_TO || "office@dieanpacker.at";
if (!SMTP_HOST || !SMTP_USER || !pass) throw new Error("Set SMTP_HOST, SMTP_USER and SMTP_PASSWORD first.");

const port = Number(SMTP_PORT);
const t = nodemailer.createTransport({ host: SMTP_HOST, port, secure: SMTP_SECURE ? SMTP_SECURE === "true" : port === 465, auth: { user: SMTP_USER, pass } });
await t.verify();
console.log(`SMTP login OK (${SMTP_HOST}:${port} as ${SMTP_USER})`);
if (process.argv.includes("--send")) {
  const info = await t.sendMail({ from: MAIL_FROM || SMTP_USER, to, subject: "SMTP-Test Website Die Anpacker", text: "Test der Kontaktformular-Zustellung." });
  console.log(`Test mail accepted for ${to}: ${info.response}`);
}
