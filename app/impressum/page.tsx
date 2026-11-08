import { Breadcrumbs } from "@/components/ui";
import { pageMeta } from "@/lib/meta";
import { mailHref, site, telHref } from "@/lib/site";

export const metadata = pageMeta({
  title: "Impressum",
  description: "Impressum und Offenlegung von Die Anpacker, Neusiedlergasse 7, 8041 Graz: Angaben gemäß § 5 ECG, § 63 GewO und § 25 MedienG.",
  path: "/impressum",
});

const L = site.legal;

export default function ImpressumPage() {
  return (
    <section className="section pt-8">
      <div className="wrap">
        <Breadcrumbs items={[{ name: "Impressum", path: "/impressum" }]} />
        <h1 className="display h-lg mt-8">Impressum</h1>
        <div className="prose mt-8">
          <p>Informationen gemäß § 5 E-Commerce-Gesetz (ECG), § 63 Gewerbeordnung (GewO) und Offenlegung gemäß § 25 Mediengesetz (MedienG).</p>

          <h2>Diensteanbieter und Medieninhaber</h2>
          <p>
            {L.tradeName}<br />
            {site.address.street}<br />
            {site.address.postalCode} {site.address.city}<br />
            {site.address.countryName}
          </p>
          <p>
            Telefon: <a href={telHref}>{site.phone.display}</a><br />
            E-Mail: <a href={mailHref}>{site.email}</a>
          </p>
          <p>Die Adresse ist Geschäftssitz und kein Kundenbüro mit Publikumsverkehr.</p>

          <h2>Unternehmensangaben</h2>
          <ul>
            <li><strong>Inhaber:</strong> {L.owner}</li>
            <li><strong>Unternehmensgegenstand:</strong> Umzüge, Transporte und Räumungen</li>
            <li><strong>UID-Nummer:</strong> {L.vatId}</li>
            <li><strong>Gewerbe:</strong> {L.trade}</li>
            <li><strong>Gewerbebehörde:</strong> {L.authority}</li>
            <li><strong>Kammerzugehörigkeit:</strong> {L.chamber}</li>
            <li><strong>Berufsrechtliche Vorschriften:</strong> Gewerbeordnung 1994 (GewO), abrufbar im <a href="https://www.ris.bka.gv.at/" target="_blank" rel="noopener noreferrer">Rechtsinformationssystem des Bundes (RIS)</a></li>
          </ul>

          <h2>Grundlegende Richtung der Website</h2>
          <p>Information über die Leistungen von {site.name}, Umzüge, Räumungen und Möbeltransporte, sowie Ratgeberbeiträge zu diesen Themen.</p>

          <h2>Haftung für Inhalte und Links</h2>
          <p>
            Die Inhalte dieser Website wurden sorgfältig erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität können wir dennoch keine Gewähr übernehmen. Ratgeberbeiträge
            dienen der allgemeinen Information und ersetzen keine rechtliche oder behördliche Auskunft. Für Inhalte externer Websites, auf die wir verlinken, sind ausschließlich
            deren Betreiber verantwortlich.
          </p>

          <h2>Bildnachweis</h2>
          <p>
            Die Fotos auf dieser Website sind Symbolbilder von <a href="https://unsplash.com/" target="_blank" rel="noopener noreferrer">Unsplash</a> (Unsplash-Lizenz) und zeigen
            keine Mitarbeitenden oder Aufträge von {site.name}. Logo: {site.name}.
          </p>
        </div>
      </div>
    </section>
  );
}
