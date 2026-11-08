"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// Optional services are only "present" if configured. Without NEXT_PUBLIC_GA_ID the site
// uses no consent-requiring technology, so no banner is shown (settings stay reachable).
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const KEY = "da-consent-v1";
const OPEN_EVENT = "da:open-consent";
const CHANGE_EVENT = "da:consent-change";

function subscribe(cb: () => void) {
  window.addEventListener(CHANGE_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CHANGE_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
function rawChoice() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return "unavailable"; // storage blocked: do not nag on every page
  }
}

type Choice = { statistik: boolean; ts: string };

function read(): Choice | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Choice) : null;
  } catch {
    return null;
  }
}

function loadAnalytics() {
  if (!GA_ID || document.getElementById("ga-src")) return;
  const s = document.createElement("script");
  s.id = "ga-src";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", GA_ID, { anonymize_ip: true });
}

export function CookieSettingsButton() {
  return (
    <button type="button" className="hover:underline underline-offset-4" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      Cookie-Einstellungen
    </button>
  );
}

export function ConsentManager() {
  // "pending" on the server and during hydration, so the banner never flashes in static HTML.
  const raw = useSyncExternalStore(subscribe, rawChoice, () => "pending");
  const banner = !!GA_ID && raw === null;
  const [statistik, setStatistik] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (read()?.statistik) loadAnalytics();
  }, [raw]);

  useEffect(() => {
    const open = () => {
      setStatistik(read()?.statistik ?? false);
      dialog.current?.showModal();
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  const save = (value: boolean) => {
    const hadConsent = read()?.statistik;
    try {
      localStorage.setItem(KEY, JSON.stringify({ statistik: value, ts: new Date().toISOString() }));
    } catch {}
    setStatistik(value);
    dialog.current?.close();
    window.dispatchEvent(new Event(CHANGE_EVENT));
    if (!value && hadConsent) window.location.reload(); // unload already-running scripts
  };

  return (
    <>
      {banner && (
        <section
          aria-label="Cookie-Hinweis"
          className="card fixed inset-x-3 bottom-[calc(var(--bar-h)+12px)] z-50 mx-auto max-w-2xl p-5 sm:p-6"
        >
          <h2 className="h-sm">Dürfen wir anonyme Statistiken erheben?</h2>
          <p className="mt-2 text-[.98rem]">
            Mit Ihrer Einwilligung nutzen wir Google Analytics, um zu verstehen, wie unsere Website verwendet wird. Ohne Einwilligung
            wird nichts davon geladen. Sie können Ihre Wahl jederzeit unter „Cookie-Einstellungen“ ändern. Mehr in der{" "}
            <Link href="/datenschutz" className="link">Datenschutzerklärung</Link>.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => save(false)}>Nur notwendige</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => save(true)}>Alle akzeptieren</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => dialog.current?.showModal()}>Einstellungen</button>
          </div>
        </section>
      )}

      <dialog
        ref={dialog}
        aria-labelledby="consent-title"
        className="card m-auto w-[min(92vw,560px)] p-0 text-ink backdrop:bg-navy/50"
      >
        <form method="dialog" className="p-6" onSubmit={(e) => { e.preventDefault(); save(statistik); }}>
          <h2 id="consent-title" className="display text-2xl">Cookie-Einstellungen</h2>
          <fieldset className="mt-5 space-y-4">
            <legend className="sr-only">Kategorien</legend>
            <div className="rounded-2xl border border-line p-4">
              <label className="flex items-start justify-between gap-4">
                <span>
                  <strong>Notwendig</strong>
                  <span className="mt-1 block text-[.95rem] text-char">
                    Speichert nur Ihre Auswahl in diesem Dialog (lokaler Browserspeicher). Ohne diese Funktion könnten wir uns Ihre Entscheidung nicht merken.
                  </span>
                </span>
                <input type="checkbox" checked disabled className="mt-1 size-5 accent-ink" aria-describedby="necessary-always" />
              </label>
              <span id="necessary-always" className="sr-only">Immer aktiv</span>
            </div>
            <div className="rounded-2xl border border-line p-4">
              <label className="flex items-start justify-between gap-4">
                <span>
                  <strong>Statistik</strong>
                  <span className="mt-1 block text-[.95rem] text-char">
                    {GA_ID
                      ? "Google Analytics hilft uns zu verstehen, welche Inhalte genutzt werden. Wird nur nach Ihrer Einwilligung geladen."
                      : "Derzeit setzen wir keine Statistik- oder Marketingdienste ein. Diese Kategorie ist deshalb nicht aktiv."}
                  </span>
                </span>
                <input
                  type="checkbox"
                  className="mt-1 size-5 accent-ink"
                  checked={statistik}
                  disabled={!GA_ID}
                  onChange={(e) => setStatistik(e.target.checked)}
                />
              </label>
            </div>
          </fieldset>
          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => save(false)}>Nur notwendige</button>
            <button type="submit" className="btn btn-ghost btn-sm">Auswahl speichern</button>
            {GA_ID && <button type="button" className="btn btn-ghost btn-sm" onClick={() => save(true)}>Alle akzeptieren</button>}
          </div>
        </form>
      </dialog>
    </>
  );
}
