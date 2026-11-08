import { AnfrageForm } from "@/components/AnfrageForm";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { MapEmbed } from "@/components/MapEmbed";
import { Breadcrumbs, JsonLd } from "@/components/ui";
import { pageMeta } from "@/lib/meta";
import { breadcrumbs, graph } from "@/lib/schema";
import { mailHref, site, telHref, waHref } from "@/lib/site";

export const metadata = pageMeta({
  title: "Kontakt & Angebot anfragen: Umzug und Räumung in Graz",
  description:
    "Unverbindlich anfragen bei Die Anpacker in Graz: per Formular mit Fotos, Telefon, WhatsApp oder E-Mail. Für Umzüge, Entrümpelungen und Möbeltransporte.",
  path: "/kontakt",
});

export default function KontaktPage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="wrap pb-12 pt-8">
          <Breadcrumbs items={[{ name: "Kontakt", path: "/kontakt" }]} />
          <h1 className="display h-xl mt-8 max-w-4xl">Erzählen Sie uns, was ansteht.</h1>
          <p className="lead mt-6">
            Beschreiben Sie Ihr Vorhaben über das Formular oder melden Sie sich direkt. Wir stellen bei Bedarf Rückfragen und erstellen Ihnen ein individuelles, unverbindliches Angebot.
          </p>
        </div>
      </section>

      <section className="section" id="formular">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <aside className="space-y-6 lg:col-span-4" aria-labelledby="direkt-title">
            <div className="ticket p-7">
              <h2 id="direkt-title" className="display text-2xl">Direkt erreichen</h2>
              <ul className="mt-6 space-y-3">
                <li><a href={telHref} className="btn btn-primary w-full justify-start"><PhoneIcon className="size-5" /> {site.phone.display}</a></li>
                <li><a href={waHref()} target="_blank" rel="noopener noreferrer" className="btn btn-invert w-full justify-start"><WhatsAppIcon className="size-5" /> WhatsApp schreiben</a></li>
                <li><a href={mailHref} className="btn btn-invert w-full justify-start"><MailIcon className="size-5" /> {site.email}</a></li>
              </ul>
              <p className="mt-6 text-sm text-paper/75">
                Fotos per WhatsApp sind oft der schnellste Weg zu einer ersten Einschätzung.
              </p>
            </div>

            <div className="card p-7">
              <h2 className="h-sm">Was wir für ein Angebot brauchen</h2>
              <ul className="ticks mt-5 text-[.98rem]">
                <li>Adressen bzw. Postleitzahlen</li>
                <li>Stockwerke und ob es einen Lift gibt</li>
                <li>Wunschtermin oder Zeitraum</li>
                <li>Umfang: Räume, Möbel, Keller, Dachboden</li>
                <li>Gewünschte Zusatzleistungen</li>
                <li>Fotos, wenn möglich</li>
              </ul>
            </div>

            <div className="card p-7">
              <h2 className="h-sm">Geschäftsadresse</h2>
              <address className="mt-3 not-italic">
                {site.name}<br />{site.address.street}<br />{site.address.postalCode} {site.address.city}
              </address>
              <p className="mt-3 text-[.95rem] text-char">Kein Kundenbüro, persönliche Termine nach Vereinbarung.</p>
              <MapEmbed className="mt-5 h-80 bg-paper" />
            </div>
          </aside>

          <div className="lg:col-span-8">
            <AnfrageForm />
          </div>
        </div>
      </section>
      <JsonLd
        data={graph(breadcrumbs([{ name: "Kontakt", path: "/kontakt" }]), {
          "@type": "ContactPage",
          url: `${site.url}/kontakt`,
          about: { "@id": `${site.url}/#organization` },
          inLanguage: site.locale,
        })}
      />
    </>
  );
}
