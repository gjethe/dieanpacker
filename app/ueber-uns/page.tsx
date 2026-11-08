import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/ui";
import { pageMeta } from "@/lib/meta";
import { breadcrumbs, graph } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Über uns: Ihr Umzugsunternehmen aus Graz",
  description:
    "Die Anpacker sind ein Umzugs- und Räumungsunternehmen aus Graz: verlässlich, sorgfältig, mit klaren Absprachen und persönlicher Betreuung.",
  path: "/ueber-uns",
});

const principles = [
  { title: "Erst zuhören, dann planen", text: "Jeder Auftrag beginnt mit Ihren Angaben und Ihren Fragen. Wir wollen verstehen, was Ihnen wichtig ist: ob das der Termin ist, ein bestimmtes Möbelstück oder die Diskretion gegenüber den Nachbarn." },
  { title: "Absprachen, die halten", text: "Im Angebot steht, was wir tun. Am Auftragstag tun wir genau das. Wenn sich vor Ort etwas ändert, sprechen wir es an, bevor wir weitermachen." },
  { title: "Sorgfalt im Detail", text: "Decken über der Kommode, Schrauben im beschrifteten Beutel, ein Blick auf die Türstöcke im Stiegenhaus. Es sind die Kleinigkeiten, die einen Umzug angenehm machen." },
  { title: "Respekt bei sensiblen Aufträgen", text: "Haushaltsauflösungen, Verlassenschaften und überfüllte Wohnungen sind keine gewöhnlichen Aufträge. Wir arbeiten ruhig, vertraulich und ohne zu urteilen." },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="wrap grid gap-10 pb-14 pt-8 lg:grid-cols-12 lg:pb-20">
          <div className="lg:col-span-7">
            <Breadcrumbs items={[{ name: "Über uns", path: "/ueber-uns" }]} />
            <h1 className="display h-xl mt-8">Ein Team aus Graz, das mit anpackt.</h1>
            <p className="lead mt-6">
              {site.entity} Wir helfen Privatpersonen und Unternehmen, wenn Dinge von einem Ort an einen anderen müssen, oder endlich weg dürfen.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="photo relative aspect-[4/3]">
              <Image src="/images/leere-wohnung-ankommen.webp" alt="Leerer, heller Raum mit Holzboden und großem Fenster" fill preload sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
            <p className="mt-2 text-xs text-char">Symbolbild</p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="name-title">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <h2 id="name-title" className="display h-lg lg:col-span-5">Der Name ist unser Versprechen</h2>
          <div className="space-y-5 text-[1.12rem] lg:col-span-6 lg:col-start-7">
            <p>
              Anpacken heißt für uns: nicht lange reden, wenn etwas zu tun ist, aber vorher genau zuhören. Ein Umzug, eine Räumung oder ein einzelner Transport gelingt dann,
              wenn klar ist, was erwartet wird, und wenn die Menschen, die die Arbeit machen, mit Sorgfalt bei der Sache sind.
            </p>
            <p>
              Deshalb arbeiten wir ohne Pauschalversprechen. Jede Anfrage sehen wir uns einzeln an, stellen Rückfragen und erstellen ein Angebot, das zu Ihrem Vorhaben passt.
              Sie sprechen dabei direkt mit uns.
            </p>
          </div>
        </div>
      </section>

      <section className="section border-y border-line bg-sky" aria-labelledby="prinzip-title">
        <div className="wrap">
          <h2 id="prinzip-title" className="display h-lg max-w-3xl">Wie wir arbeiten</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {principles.map((p) => (
              <article key={p.title} className="card p-7 sm:p-9">
                <h3 className="display text-[1.6rem] leading-tight">{p.title}</h3>
                <p className="mt-4">{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="region-title">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <h2 id="region-title" className="display h-lg lg:col-span-5">Aus Graz, für die Steiermark</h2>
          <div className="space-y-5 text-[1.12rem] lg:col-span-6 lg:col-start-7">
            <p>
              Unser Geschäftssitz ist in der Neusiedlergasse in Graz. Von hier aus sind wir in Graz, Graz-Umgebung und der ganzen Steiermark unterwegs, in engen Altstadtgassen
              genauso wie in Einfamilienhaussiedlungen am Stadtrand.
            </p>
            <p>
              Führt Ihr Umzug in ein anderes Bundesland, oder liegt die Wohnung, die geräumt werden muss, außerhalb der Steiermark? Dann sprechen Sie uns an. Je nach Umfang und
              Entfernung finden wir eine Lösung.
            </p>
            <p className="text-char">
              Bitte beachten Sie: Unsere Adresse ist ein Geschäftssitz und kein Kundenbüro. Persönliche Termine vereinbaren wir gerne, am einfachsten telefonisch oder per WhatsApp.
            </p>
            <p><Link href="/leistungen" className="link font-semibold">Unsere Leistungen ansehen</Link></p>
          </div>
        </div>
      </section>

      <CtaBand title="Lernen wir uns kennen." text="Am besten über ein konkretes Vorhaben: Beschreiben Sie, was ansteht, und wir melden uns persönlich bei Ihnen." />
      <JsonLd
        data={graph(breadcrumbs([{ name: "Über uns", path: "/ueber-uns" }]), {
          "@type": "AboutPage",
          url: `${site.url}/ueber-uns`,
          about: { "@id": `${site.url}/#organization` },
          inLanguage: site.locale,
        })}
      />
    </>
  );
}
