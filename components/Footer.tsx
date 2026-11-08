import Link from "next/link";
import { services } from "@/content/services";
import { mailHref, nav, site, telHref, waHref } from "@/lib/site";
import { Logo } from "./Header";
import { FormIcon, PhoneIcon, WhatsAppIcon } from "./icons";
import { CookieSettingsButton } from "./Consent";
import { MapEmbed } from "./MapEmbed";

export function Footer() {
  return (
    <footer className="on-dark bg-navy text-paper">
      <div className="wrap grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3">
            <Logo size={64} />
            <p className="display text-2xl">Die Anpacker</p>
          </div>
          <p className="mt-5 max-w-sm text-paper/80">
            Umzüge, Entrümpelungen und Möbeltransporte aus Graz, für Graz, Graz-Umgebung und die Steiermark, nach Absprache auch österreichweit.
          </p>
        </div>

        <nav aria-label="Leistungen" className="lg:col-span-3">
          <h2 className="font-display text-lg font-semibold">Leistungen</h2>
          <ul className="mt-4 space-y-2 text-paper/85">
            {services.map((s) => (
              <li key={s.slug}><Link className="hover:underline underline-offset-4" href={`/leistungen/${s.slug}`}>{s.name}</Link></li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Unternehmen" className="lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">Unternehmen</h2>
          <ul className="mt-4 space-y-2 text-paper/85">
            {nav.map((n) => (
              <li key={n.href}><Link className="hover:underline underline-offset-4" href={n.href}>{n.label}</Link></li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="font-display text-lg font-semibold">Kontakt</h2>
          <address className="mt-4 space-y-2 break-words not-italic text-paper/85">
            <p>{site.name}<br />{site.address.street}<br />{site.address.postalCode} {site.address.city}, {site.address.countryName}</p>
            <p><a className="hover:underline underline-offset-4" href={telHref}>{site.phone.display}</a></p>
            <p><a className="hover:underline underline-offset-4" href={mailHref}>{site.email}</a></p>
            <p><a className="hover:underline underline-offset-4" href={waHref()} target="_blank" rel="noopener noreferrer">WhatsApp schreiben</a></p>
          </address>
          <p className="mt-3 text-sm text-paper/60">Geschäftsadresse, kein Kundenbüro. Termine nach Vereinbarung.</p>
        </div>
      </div>
      <div className="wrap pb-12">
        <MapEmbed className="h-64 bg-fog sm:h-72" />
      </div>
      <div className="border-t border-paper/20">
        <div className="wrap flex flex-col gap-3 py-6 text-sm text-paper/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {site.name}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li><Link className="hover:underline underline-offset-4" href="/impressum">Impressum</Link></li>
            <li><Link className="hover:underline underline-offset-4" href="/datenschutz">Datenschutz</Link></li>
            <li><CookieSettingsButton /></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export function MobileContactBar() {
  return (
    <nav
      aria-label="Schnellkontakt"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid h-16 grid-cols-3">
        <li>
          <a href={telHref} className="flex h-full flex-col items-center justify-center gap-0.5 text-sm font-semibold">
            <PhoneIcon />
            Anrufen
          </a>
        </li>
        <li className="border-x border-line">
          <a href={waHref()} target="_blank" rel="noopener noreferrer" className="flex h-full flex-col items-center justify-center gap-0.5 text-sm font-semibold">
            <WhatsAppIcon />
            WhatsApp
          </a>
        </li>
        <li>
          <Link href="/kontakt" className="flex h-full flex-col items-center justify-center gap-0.5 bg-navy text-paper text-sm font-semibold">
            <FormIcon />
            Anfrage
          </Link>
        </li>
      </ul>
    </nav>
  );
}
