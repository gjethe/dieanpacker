import { Breadcrumbs } from "@/components/ui";
import { pageMeta } from "@/lib/meta";
import { mailHref, site, telHref } from "@/lib/site";

export const metadata = pageMeta({
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung von Die Anpacker: welche Daten beim Besuch der Website und bei Anfragen per Formular, E-Mail, Telefon oder WhatsApp verarbeitet werden.",
  path: "/datenschutz",
});

const STAND = "6. November 2026";

export default function DatenschutzPage() {
  return (
    <section className="section pt-8">
      <div className="wrap">
        <Breadcrumbs items={[{ name: "Datenschutz", path: "/datenschutz" }]} />
        <h1 className="display h-lg mt-8">Datenschutzerklärung</h1>
        <div className="prose mt-8">
          <p>
            Wir verarbeiten personenbezogene Daten nur, soweit das für den Betrieb dieser Website, die Beantwortung Ihrer Anfragen und die Durchführung unserer Leistungen nötig
            ist. Hier erfahren Sie, welche Daten das sind, wofür wir sie verwenden und welche Rechte Sie haben.
          </p>

          <h2 id="verantwortlicher">1. Verantwortlicher</h2>
          <p>
            {site.legal.tradeName}<br />
            {site.address.street}, {site.address.postalCode} {site.address.city}, {site.address.countryName}<br />
            Telefon: <a href={telHref}>{site.phone.display}</a><br />
            E-Mail: <a href={mailHref}>{site.email}</a>
          </p>

          <h2 id="hosting">2. Bereitstellung der Website und Server-Logs</h2>
          <p>
            Diese Website wird bei {site.hosting.name}, {site.hosting.address}, betrieben. Beim Aufruf der Website verarbeitet der Hosting-Anbieter technisch notwendige Daten,
            insbesondere IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Adresse, Referrer, Browser- und Betriebssysteminformationen. Diese Daten werden benötigt, um
            die Website auszuliefern, ihre Sicherheit zu gewährleisten und Fehler zu analysieren.
          </p>
          <p>
            Rechtsgrundlage ist unser berechtigtes Interesse an einem sicheren und stabilen Betrieb der Website (Art. 6 Abs. 1 lit. f DSGVO). Mit dem Anbieter besteht ein
            Auftragsverarbeitungsvertrag. Eine Übermittlung in die USA ist möglich; sie erfolgt auf Grundlage des EU-US Data Privacy Framework bzw. von
            EU-Standardvertragsklauseln. Protokolldaten werden vom Anbieter nur für einen begrenzten Zeitraum gespeichert.
          </p>

          <h2 id="kontaktformular">3. Anfrageformular</h2>
          <p>
            Wenn Sie uns über das Anfrageformular schreiben, verarbeiten wir die von Ihnen eingegebenen Daten: Name, E-Mail-Adresse, Telefonnummer, bevorzugter Kontaktweg,
            gewünschte Leistung, Adressen bzw. Postleitzahlen, Angaben zu Stockwerk und Lift, Wunschtermin, Ihre Beschreibung sowie freiwillig hochgeladene Fotos.
          </p>
          <p>
            Zweck ist die Bearbeitung Ihrer Anfrage und die Erstellung eines Angebots. Rechtsgrundlage ist die Durchführung vorvertraglicher Maßnahmen auf Ihre Anfrage
            (Art. 6 Abs. 1 lit. b DSGVO), bei allgemeinen Fragen unser berechtigtes Interesse an deren Beantwortung (Art. 6 Abs. 1 lit. f DSGVO). Eine Einwilligung ist dafür
            nicht erforderlich.
          </p>
          <p>
            Die Daten werden nach dem Absenden nicht in einer Datenbank auf dem Webserver gespeichert, sondern als E-Mail (Fotos als Anhang) an unser Postfach übermittelt.
            Der Versand erfolgt über den E-Mail-Dienst von {site.mailProvider.name}, {site.mailProvider.address}, der unser Postfach als Auftragsverarbeiter betreibt.
          </p>
          <p>
            Bitte laden Sie nur Fotos hoch, die für die Einschätzung nötig sind, und vermeiden Sie nach Möglichkeit Personen, Dokumente oder andere sensible Inhalte auf den Bildern.
          </p>
          <p>
            Wir speichern Anfragen, solange es für die Bearbeitung nötig ist. Kommt kein Auftrag zustande, löschen wir die Anfrage spätestens nach zwölf Monaten. Kommt ein Auftrag
            zustande, bewahren wir die damit verbundenen Unterlagen entsprechend den gesetzlichen Aufbewahrungspflichten (insbesondere § 132 BAO, in der Regel sieben Jahre) auf.
          </p>

          <h2 id="email-telefon">4. Kontakt per E-Mail und Telefon</h2>
          <p>
            Wenn Sie uns per E-Mail oder telefonisch kontaktieren, verarbeiten wir die mitgeteilten Daten zur Bearbeitung Ihres Anliegens. Rechtsgrundlage und Speicherdauer
            entsprechen Punkt 3. E-Mails werden über unser Postfach bei {site.mailProvider.name} verarbeitet.
          </p>

          <h2 id="whatsapp">5. Kontakt über WhatsApp</h2>
          <p>
            Auf der Website gibt es Links, mit denen Sie uns über WhatsApp schreiben können. Erst wenn Sie einen solchen Link anklicken, wird WhatsApp geöffnet; vorher werden keine
            Daten an WhatsApp übertragen. Bei der Nutzung von WhatsApp verarbeitet die WhatsApp Ireland Limited (Meta) Daten nach ihren eigenen Datenschutzbestimmungen, wobei
            eine Übermittlung in Drittländer wie die USA möglich ist.
          </p>
          <p>
            Wir nutzen die über WhatsApp erhaltenen Nachrichten und Fotos ausschließlich zur Bearbeitung Ihrer Anfrage (Art. 6 Abs. 1 lit. b DSGVO). Wenn Sie WhatsApp nicht nutzen
            möchten, erreichen Sie uns jederzeit per Telefon, E-Mail oder über das Formular.
          </p>

          <h2 id="google-maps">6. Google Maps</h2>
          <p>
            Auf der Kontaktseite und im Fußbereich können Sie eine Karte von Google Maps (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland) einblenden. Die
            Karte wird erst geladen, wenn Sie auf „Karte laden“ klicken; vorher wird keine Verbindung zu Google aufgebaut. Nach dem Klick erhält Google unter anderem Ihre
            IP-Adresse und technische Browserdaten und kann Cookies setzen. Eine Übermittlung in die USA ist möglich; Google ist unter dem EU-US Data Privacy Framework
            zertifiziert.
          </p>
          <p>
            Rechtsgrundlage ist Ihre Einwilligung durch den Klick (Art. 6 Abs. 1 lit. a DSGVO, § 165 Abs. 3 TKG 2021), die Sie jederzeit durch Neuladen der Seite beenden
            können. Weitere Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>.
          </p>

          <h2 id="cookies">7. Cookies und lokale Speicherung</h2>
          <p>
            Diese Website verwendet derzeit keine Analyse-, Tracking- oder Marketingdienste und setzt keine Cookies zu solchen Zwecken. Gespeichert wird lediglich Ihre Auswahl in
            den Cookie-Einstellungen im lokalen Speicher Ihres Browsers, damit wir uns Ihre Entscheidung merken können. Diese Speicherung ist unbedingt erforderlich
            (§ 165 Abs. 3 TKG 2021) und erfolgt ohne Einwilligung.
          </p>
          <p>
            Sollten wir künftig Dienste einsetzen, die eine Einwilligung erfordern, werden diese erst nach Ihrer Zustimmung geladen (Art. 6 Abs. 1 lit. a DSGVO) und hier
            beschrieben. Ihre Auswahl können Sie jederzeit über „Cookie-Einstellungen“ im Fußbereich der Website ändern.
          </p>

          <h2 id="schriften">8. Schriftarten</h2>
          <p>Die verwendeten Schriftarten werden von unserem eigenen Server ausgeliefert. Es wird keine Verbindung zu Servern von Google oder anderen Schriftanbietern aufgebaut.</p>

          <h2 id="rechte">9. Ihre Rechte</h2>
          <p>Sie haben nach der DSGVO das Recht auf</p>
          <ul>
            <li>Auskunft über die zu Ihrer Person verarbeiteten Daten (Art. 15)</li>
            <li>Berichtigung unrichtiger Daten (Art. 16)</li>
            <li>Löschung (Art. 17) und Einschränkung der Verarbeitung (Art. 18)</li>
            <li>Datenübertragbarkeit (Art. 20)</li>
            <li>Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21)</li>
            <li>Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3)</li>
          </ul>
          <p>Wenden Sie sich dafür an <a href={mailHref}>{site.email}</a>.</p>
          <p>
            Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt, können Sie sich bei der Österreichischen Datenschutzbehörde
            beschweren: Barichgasse 40-42, 1030 Wien, <a href="https://www.dsb.gv.at/" target="_blank" rel="noopener noreferrer">www.dsb.gv.at</a>.
          </p>

          <h2 id="sicherheit">10. Datensicherheit</h2>
          <p>Die Übertragung zwischen Ihrem Browser und dieser Website erfolgt verschlüsselt (TLS). Der E-Mail-Versand an unser Postfach erfolgt über eine verschlüsselte Verbindung.</p>

          <p className="text-char">Stand: {STAND}</p>
        </div>
      </div>
    </section>
  );
}
