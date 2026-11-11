"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  type Errors, gruppe, KONTAKTWEGE, LEISTUNGEN, LIFT, OBJEKTARTEN, UMFANG, validate,
} from "@/lib/anfrage";
import { site, telHref, waHref } from "@/lib/site";

type State = "idle" | "sending" | "done" | "error";

function Field({ name, label, error, hint, children }: { name: string; label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {children}
      {hint && !error && <p id={`${name}-hint`} className="hint">{hint}</p>}
      {error && <p id={`${name}-err`} className="err">{error}</p>}
    </div>
  );
}

const noop = () => () => {};
type Initial = { leistung: string; von?: string; nach?: string; failed: boolean };
function parse(search: string): Initial {
  const q = new URLSearchParams(search);
  const l = q.get("leistung") ?? "";
  const plz = (v: string | null) => (v && /^\d{4,5}$/.test(v) ? v : undefined);
  return { leistung: l in LEISTUNGEN ? l : "privatumzug", von: plz(q.get("von")), nach: plz(q.get("nach")), failed: q.get("status") === "fehler" };
}

// Server render and hydration use "" (no query); afterwards the real query remounts the form prefilled.
export function AnfrageForm() {
  const search = useSyncExternalStore(noop, () => window.location.search, () => "");
  return <Form key={search} initial={parse(search)} />;
}

const FAILED_MSG = "Ihre Anfrage konnte nicht versendet werden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.";

function Form({ initial }: { initial: Initial }) {
  const [leistung, setLeistung] = useState(initial.leistung);
  const [kontaktweg, setKontaktweg] = useState("telefon");
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<State>(initial.failed ? "error" : "idle");
  const [message, setMessage] = useState(initial.failed ? FAILED_MSG : "");
  const pre = initial;
  const started = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    started.current = Date.now();
  }, []);

  const g = gruppe(leistung);
  const err = (n: keyof Errors) => errors[n];
  const aria = (n: keyof Errors) => ({ "aria-invalid": errors[n] ? true : undefined, "aria-describedby": errors[n] ? `${n}-err` : undefined });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;
    const fd = new FormData(e.currentTarget);
    const fields: Record<string, unknown> = Object.fromEntries([...fd.entries()].filter(([, v]) => typeof v === "string"));
    const v = validate(fields);
    if (!v.ok) {
      setErrors(v.errors);
      setState("idle");
      const form = e.currentTarget;
      // focus the first invalid field in visual order once aria-invalid has rendered
      requestAnimationFrame(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setErrors({});
    setState("sending");
    fd.set("t", String(started.current));
    try {
      const res = await fetch("/api/anfrage", { method: "POST", body: fd, headers: { Accept: "application/json" } });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; errors?: Errors };
      if (res.ok && body.ok) {
        setState("done");
        formRef.current?.reset();
      } else {
        setErrors(body.errors ?? {});
        setState("error");
        setMessage(body.message ?? "Ihre Anfrage konnte nicht versendet werden.");
      }
    } catch {
      setState("error");
      setMessage("Keine Verbindung. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.");
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  if (state === "done") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="card p-8 sm:p-10">
        <h2 className="display h-md">Danke, Ihre Anfrage ist bei uns angekommen.</h2>
        <p className="mt-4 text-[1.1rem]">
          Wir sehen uns Ihre Angaben an und melden uns auf dem gewünschten Weg bei Ihnen. Wenn es eilt, erreichen Sie uns auch telefonisch unter{" "}
          <a className="link" href={telHref}>{site.phone.display}</a>.
        </p>
        <button type="button" className="btn btn-ghost mt-6" onClick={() => setState("idle")}>Weitere Anfrage senden</button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action="/api/anfrage"
      method="post"
      encType="multipart/form-data"
      noValidate
      onSubmit={onSubmit}
      className="card space-y-10 p-6 sm:p-10"
      aria-labelledby="formular-title"
    >
      <div>
        <h2 id="formular-title" className="display h-md">Anfrage senden</h2>
        <p className="mt-2 text-char">Pflichtfelder sind mit * gekennzeichnet. Je mehr Sie uns verraten, desto genauer wird das Angebot.</p>
      </div>

      <div ref={statusRef} tabIndex={-1} aria-live="assertive" className="outline-none">
        {state === "error" && (
          <div role="alert" className="rounded-2xl border-[1.5px] border-[#b00020] bg-paper p-5">
            <p className="font-semibold">{message}</p>
            <p className="mt-2 text-[.95rem]">
              Direkt erreichbar: <a className="link" href={telHref}>{site.phone.display}</a>,{" "}
              <a className="link" href={waHref()} target="_blank" rel="noopener noreferrer">WhatsApp</a>,{" "}
              <a className="link" href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </div>
        )}
        {Object.keys(errors).length > 0 && state !== "error" && (
          <p role="alert" className="err text-base">Bitte prüfen Sie die markierten Felder.</p>
        )}
      </div>

      {/* Honeypot: hidden from people and assistive tech */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="t" value="" />

      <fieldset className="space-y-5">
        <legend className="h-sm mb-4">1. Wie erreichen wir Sie?</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="vorname" label="Vorname *" error={err("vorname")}><input id="vorname" name="vorname" className="input" autoComplete="given-name" maxLength={80} {...aria("vorname")} /></Field>
          <Field name="nachname" label="Nachname *" error={err("nachname")}><input id="nachname" name="nachname" className="input" autoComplete="family-name" maxLength={80} {...aria("nachname")} /></Field>
          <Field name="email" label="E-Mail-Adresse *" error={err("email")}><input id="email" name="email" type="email" className="input" autoComplete="email" maxLength={160} {...aria("email")} /></Field>
          <Field name="telefon" label={kontaktweg === "email" ? "Telefonnummer" : "Telefonnummer *"} error={err("telefon")}><input id="telefon" name="telefon" type="tel" className="input" autoComplete="tel" maxLength={40} {...aria("telefon")} /></Field>
        </div>
        <div role="radiogroup" aria-labelledby="kw-label">
          <p id="kw-label" className="mb-2 font-semibold">Bevorzugter Kontaktweg</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(KONTAKTWEGE).map(([k, v]) => (
              <label key={k} className="choice">
                <input type="radio" name="kontaktweg" value={k} checked={kontaktweg === k} onChange={() => setKontaktweg(k)} /> {v}
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="h-sm mb-4">2. Was steht an?</legend>
        <div className="grid gap-5 lg:grid-cols-2">
          <Field name="leistung" label="Leistung *" error={err("leistung")}>
            <select id="leistung" name="leistung" className="input" value={leistung} onChange={(e) => setLeistung(e.target.value)} {...aria("leistung")}>
              {Object.entries(LEISTUNGEN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Field>
          <Field name="termin" label="Wunschtermin oder Zeitraum" hint="z. B. „Ende März“ oder „ab 15. 4., flexibel“">
            <input id="termin" name="termin" className="input" maxLength={120} />
          </Field>
        </div>
      </fieldset>

      {g === "transport" && (
        <fieldset className="space-y-6">
          <legend className="h-sm mb-4">3. Von wo nach wo?</legend>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="grid gap-5 rounded-2xl border border-line p-5 sm:grid-cols-6">
              <p className="font-semibold sm:col-span-6">Abholadresse</p>
              <div className="sm:col-span-4"><Field name="von_adresse" label="Straße und Hausnummer"><input id="von_adresse" name="von_adresse" className="input" autoComplete="off" maxLength={160} /></Field></div>
              <div className="sm:col-span-2"><Field name="von_plz" label="PLZ *" error={err("von_plz")}><input id="von_plz" name="von_plz" defaultValue={pre.von} className="input" inputMode="numeric" maxLength={5} {...aria("von_plz")} /></Field></div>
              <div className="sm:col-span-3"><Field name="von_stock" label="Stockwerk"><input id="von_stock" name="von_stock" className="input" placeholder="z. B. 3. Stock" maxLength={30} /></Field></div>
              <div className="sm:col-span-3"><Field name="von_lift" label="Lift vorhanden?"><select id="von_lift" name="von_lift" className="input" defaultValue=""><option value="">Bitte wählen</option>{Object.entries(LIFT).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Field></div>
            </div>
            <div className="grid gap-5 rounded-2xl border border-line p-5 sm:grid-cols-6">
              <p className="font-semibold sm:col-span-6">Zieladresse</p>
              <div className="sm:col-span-4"><Field name="nach_adresse" label="Straße und Hausnummer"><input id="nach_adresse" name="nach_adresse" className="input" autoComplete="off" maxLength={160} /></Field></div>
              <div className="sm:col-span-2"><Field name="nach_plz" label="PLZ *" error={err("nach_plz")}><input id="nach_plz" name="nach_plz" defaultValue={pre.nach} className="input" inputMode="numeric" maxLength={5} {...aria("nach_plz")} /></Field></div>
              <div className="sm:col-span-3"><Field name="nach_stock" label="Stockwerk"><input id="nach_stock" name="nach_stock" className="input" placeholder="z. B. Erdgeschoß" maxLength={30} /></Field></div>
              <div className="sm:col-span-3"><Field name="nach_lift" label="Lift vorhanden?"><select id="nach_lift" name="nach_lift" className="input" defaultValue=""><option value="">Bitte wählen</option>{Object.entries(LIFT).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Field></div>
            </div>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <Field name="zimmer" label={leistung === "firmenumzug" ? "Arbeitsplätze, Räume, Archiv" : leistung === "moebeltransport" ? "Welche Möbelstücke?" : "Anzahl und Art der Räume"} hint={leistung === "privatumzug" ? "z. B. 3 Zimmer, Küche, Keller" : undefined}>
              <input id="zimmer" name="zimmer" className="input" maxLength={200} />
            </Field>
            <Field name="montage" label="Möbel ab- oder aufbauen?" hint="Welche Möbel, falls ja, z. B. Schlafzimmerkasten, Doppelbett">
              <input id="montage" name="montage" className="input" maxLength={300} />
            </Field>
          </div>
        </fieldset>
      )}

      {g === "raeumung" && (
        <fieldset className="space-y-6">
          <legend className="h-sm mb-4">3. Um welches Objekt geht es?</legend>
          <div className="grid gap-5 sm:grid-cols-6">
            <div className="sm:col-span-4"><Field name="objekt_adresse" label="Straße und Hausnummer"><input id="objekt_adresse" name="objekt_adresse" className="input" maxLength={160} /></Field></div>
            <div className="sm:col-span-2"><Field name="objekt_plz" label="PLZ *" error={err("objekt_plz")}><input id="objekt_plz" name="objekt_plz" defaultValue={pre.von} className="input" inputMode="numeric" maxLength={5} {...aria("objekt_plz")} /></Field></div>
            <div className="sm:col-span-3"><Field name="objektart" label="Objektart"><select id="objektart" name="objektart" className="input" defaultValue=""><option value="">Bitte wählen</option>{OBJEKTARTEN.map((o) => <option key={o}>{o}</option>)}</select></Field></div>
            <div className="sm:col-span-3"><Field name="umfang" label="Umfang der Räumung"><select id="umfang" name="umfang" className="input" defaultValue=""><option value="">Bitte wählen</option>{UMFANG.map((o) => <option key={o}>{o}</option>)}</select></Field></div>
            <div className="sm:col-span-6"><Field name="bereiche" label="Welche Bereiche sollen geräumt werden?" hint="z. B. Wohnung inkl. Keller und Dachboden"><input id="bereiche" name="bereiche" className="input" maxLength={300} /></Field></div>
            <div className="sm:col-span-3"><Field name="objekt_stock" label="Stockwerk"><input id="objekt_stock" name="objekt_stock" className="input" maxLength={30} /></Field></div>
            <div className="sm:col-span-3"><Field name="objekt_lift" label="Lift vorhanden?"><select id="objekt_lift" name="objekt_lift" className="input" defaultValue=""><option value="">Bitte wählen</option>{Object.entries(LIFT).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Field></div>
          </div>
        </fieldset>
      )}

      {g === "vorort" && (
        <fieldset className="space-y-6">
          <legend className="h-sm mb-4">3. Wo findet der Auftrag statt?</legend>
          <div className="grid gap-5 sm:grid-cols-6">
            <div className="sm:col-span-4"><Field name="objekt_adresse" label="Straße und Hausnummer"><input id="objekt_adresse" name="objekt_adresse" className="input" maxLength={160} /></Field></div>
            <div className="sm:col-span-2"><Field name="objekt_plz" label="PLZ" error={err("objekt_plz")}><input id="objekt_plz" name="objekt_plz" className="input" inputMode="numeric" maxLength={5} {...aria("objekt_plz")} /></Field></div>
            <div className="sm:col-span-3"><Field name="objekt_stock" label="Stockwerk"><input id="objekt_stock" name="objekt_stock" className="input" maxLength={30} /></Field></div>
            <div className="sm:col-span-3"><Field name="objekt_lift" label="Lift vorhanden?"><select id="objekt_lift" name="objekt_lift" className="input" defaultValue=""><option value="">Bitte wählen</option>{Object.entries(LIFT).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Field></div>
          </div>
          {leistung === "moebelmontage" && (
            <Field name="montage" label="Welche Möbel sollen ab- oder aufgebaut werden?"><input id="montage" name="montage" className="input" maxLength={300} /></Field>
          )}
        </fieldset>
      )}

      <fieldset className="space-y-5">
        <legend className="h-sm mb-4">4. Beschreibung und Fotos</legend>
        <Field name="beschreibung" label="Beschreiben Sie Ihr Vorhaben *" error={err("beschreibung")} hint="Was soll transportiert oder geräumt werden? Gibt es Besonderheiten wie schwere Einzelstücke, enge Zugänge oder fixe Termine?">
          <textarea id="beschreibung" name="beschreibung" className="input" rows={6} maxLength={4000} {...aria("beschreibung")} />
        </Field>
        <div className="rounded-2xl border border-line p-5 lg:flex lg:items-center lg:justify-between lg:gap-6">
          <div>
            <p className="font-semibold">Fotos per WhatsApp senden</p>
            <p className="hint mt-1">Schicken Sie uns Fotos Ihres Vorhabens direkt per WhatsApp. Das hilft uns, Ihr Angebot vorzubereiten.</p>
          </div>
          <a className="btn btn-ghost btn-sm mt-4 shrink-0 lg:mt-0" href={waHref()} target="_blank" rel="noopener noreferrer">WhatsApp öffnen</a>
        </div>
      </fieldset>

      <div className="space-y-4 border-t border-line pt-8">
        <p className="text-[.95rem] text-char">
          Wir verwenden Ihre Angaben ausschließlich, um Ihre Anfrage zu bearbeiten und Ihnen ein Angebot zu erstellen. Details in der{" "}
          <Link href="/datenschutz#kontaktformular" className="link text-ink">Datenschutzerklärung</Link>.
        </p>
        <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={state === "sending"} aria-disabled={state === "sending"}>
          {state === "sending" ? "Wird gesendet …" : "Anfrage unverbindlich senden"}
        </button>
      </div>
    </form>
  );
}
