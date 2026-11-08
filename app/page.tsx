import Image from "next/image";
import Link from "next/link";
import { services } from "@/content/services";
import { posts } from "@/content/posts";
import { ArrowIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { CtaBand, FaqList } from "@/components/ui";
import { pageMeta } from "@/lib/meta";
import { site, telHref, waHref } from "@/lib/site";

export const metadata = pageMeta({
  title: "Umzugsfirma Graz: Umzug & Entrümpelung | Die Anpacker",
  description:
    "Die Anpacker aus Graz: Privat- und Firmenumzüge, Entrümpelungen, Haushaltsauflösungen und Möbeltransporte in Graz und der Steiermark. Unverbindlich anfragen.",
  path: "/",
});

const steps = [
  { title: "Sie beschreiben Ihr Vorhaben", text: "Per Formular, Telefon oder WhatsApp: Adressen, Stockwerke, Wunschtermin und am besten ein paar Fotos." },
  { title: "Wir klären die Details", text: "Offene Fragen besprechen wir direkt. Bei größeren Aufträgen vereinbaren wir bei Bedarf eine Besichtigung." },
  { title: "Sie erhalten ein Angebot", text: "Individuell kalkuliert, mit klar beschriebenem Leistungsumfang. Sie entscheiden in Ruhe." },
  { title: "Wir packen an", text: "Am vereinbarten Termin erledigen wir genau das, was abgesprochen ist: sorgfältig und verlässlich." },
];

const values = [
  { title: "Erst das Angebot, dann die Arbeit", text: "Sie wissen vorher, welche Leistungen enthalten sind. Ohne Ihre Zusage fangen wir nicht an." },
  { title: "Ein Ansprechpartner", text: "Von der ersten Nachricht bis zum letzten Karton sprechen Sie mit denselben Menschen." },
  { title: "Geschützte Möbel", text: "Empfindliche Stücke werden in Decken gewickelt und im Fahrzeug gesichert." },
  { title: "Bescheid statt Überraschung", text: "Wenn sich vor Ort etwas ändert, sagen wir es Ihnen, bevor wir weitermachen." },
  { title: "Vertraulich, wenn es heikel wird", text: "Haushaltsauflösungen und überfüllte Wohnungen behandeln wir leise, respektvoll und ohne zu urteilen." },
  { title: "Handyfotos genügen", text: "Ein paar Fotos per WhatsApp reichen oft für eine erste Einschätzung. Keine Formularberge." },
];

const needs = [
  "Abhol- und Zieladresse mit Postleitzahl",
  "Stockwerke und ob ein Lift vorhanden ist",
  "Wunschtermin oder möglicher Zeitraum",
  "Ungefährer Umfang: Zimmer, Möbel, Keller, Dachboden",
  "Große oder schwere Einzelstücke",
  "Gewünschte Zusatzleistungen wie Möbelmontage",
  "Fotos, denn sie machen die Einschätzung deutlich genauer",
];

const faqs = [
  { q: "Welche Leistungen bieten Die Anpacker an?", a: "Wir übernehmen Privatumzüge, Firmen- und Büroumzüge, Entrümpelungen und Räumungen, Haushaltsauflösungen und Verlassenschaftsräumungen, die Räumung stark überfüllter Wohnungen, Möbeltransporte sowie Möbeldemontage und -montage." },
  { q: "Wo sind Die Anpacker tätig?", a: "Unser Sitz ist in Graz. Hauptsächlich arbeiten wir in Graz, Graz-Umgebung und der gesamten Steiermark. Aufträge in anderen Bundesländern übernehmen wir nach Absprache, abhängig von Umfang und Entfernung." },
  { q: "Übernehmen Sie auch Büro- und Firmenumzüge?", a: "Ja. Wir übersiedeln Büros, Praxen, Kanzleien und kleinere Betriebe, mit abgestimmter Reihenfolge und einem Termin, der zu Ihrem Betrieb passt." },
  { q: "Kann ich auch nur ein einzelnes Möbelstück transportieren lassen?", a: "Ja. Einzeltransporte, etwa für ein Sofa, einen Kasten oder eine Waschmaschine, gehören zu unseren Leistungen, inklusive Tragen an beiden Adressen." },
  { q: "Führen Sie Verlassenschaftsräumungen durch?", a: "Ja. Wir räumen Wohnungen und Häuser nach einem Todesfall in enger Abstimmung mit den Angehörigen und gehen respektvoll mit persönlichen Dingen um." },
  { q: "Was kostet ein Umzug in Graz?", a: "Das hängt vom Umfang ab: Volumen, Stockwerke und Lift, Tragewege, Entfernung und Zusatzleistungen wie Möbelmontage bestimmen den Aufwand. Deshalb erstellen wir für jeden Auftrag ein individuelles Angebot. Welche Faktoren genau zählen, erklärt unser Ratgeber zu den Umzugskosten in Graz." },
  { q: "Kann ich für eine Anfrage Fotos schicken?", a: "Ja, und das ist sogar der schnellste Weg zu einem genauen Angebot. Sie können bis zu fünf Fotos direkt im Anfrageformular hochladen oder sie per WhatsApp schicken." },
  { q: "Wie bekomme ich ein Angebot?", a: "Über das Anfrageformular, per Telefon, WhatsApp oder E-Mail. Sie beschreiben Ihr Vorhaben, wir melden uns mit Rückfragen und erstellen ein individuelles Angebot." },
  { q: "Warum stehen keine Preise auf der Website?", a: "Weil jeder Auftrag anders ist. Volumen, Stockwerke, Lift, Tragewege, Entfernung und Zusatzleistungen bestimmen den Aufwand. Ein individuelles Angebot ist deshalb genauer als jede Pauschale." },
  { q: "Kann ich bei Ihnen im Büro vorbeikommen?", a: "Unsere Adresse in der Neusiedlergasse in Graz ist unser Geschäftssitz und kein Kundenbüro. Am einfachsten erreichen Sie uns telefonisch, per WhatsApp oder über das Formular. Persönliche Termine vereinbaren wir gerne." },
];

const regions = ["Graz", "Graz-Umgebung", "Leibnitz", "Weiz", "Voitsberg", "Deutschlandsberg", "Hartberg-Fürstenfeld", "Südoststeiermark", "Bruck-Mürzzuschlag", "Leoben", "Murtal", "Liezen"];

export default function Home() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden pb-16 lg:pb-28">
        <div className="wrap pt-10 md:pt-16">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="lg:col-span-7">
              <p className="inline-flex items-center gap-2 rounded-full bg-sky px-4 py-1.5 text-sm font-medium">
                <span aria-hidden className="size-2 rounded-full bg-ember" />
                Umzug &amp; Räumung in Graz und der Steiermark
              </p>
              <h1 className="mt-6">
                <span className="display h-xl block">Sie planen.<br />Wir tragen den Rest.</span>
                <span className="mt-5 block text-[clamp(1.15rem,1.8vw,1.45rem)] font-medium leading-snug">
                  Umzüge, Entrümpelungen und Möbeltransporte in Graz und der Steiermark.
                </span>
              </h1>
            </div>
            <div className="lg:col-span-5 lg:pb-2">
              <p className="lead">
                Ob Wohnung, Büro oder Kellerabteil: Sie sagen uns, was wohin soll oder was weg darf. Wir planen, tragen, transportieren und räumen.
                Nach Absprache auch österreichweit.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/kontakt" className="btn btn-primary">Unverbindlich anfragen <ArrowIcon className="size-4" /></Link>
                <Link href="/leistungen" className="btn btn-ghost">Unsere Leistungen entdecken</Link>
              </div>
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[.98rem]">
                <li><a href={telHref} className="inline-flex items-center gap-2 font-semibold hover:underline underline-offset-4"><PhoneIcon className="size-4" />{site.phone.display}</a></li>
                <li><a href={waHref()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold hover:underline underline-offset-4"><WhatsAppIcon className="size-4" />WhatsApp schreiben</a></li>
              </ul>
            </div>
          </div>

          <div className="relative mt-10 lg:mt-14">
            <div className="photo relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]">
              <Image
                src="/images/hero-umzugswagen-entladen.webp"
                alt="Ein Möbelpacker entlädt Möbel aus einem Umzugswagen vor einem Altbau"
                fill
                preload
                sizes="(min-width: 1280px) 1200px, 100vw"
                className="object-cover object-[30%_55%]"
              />
              <ul className="absolute bottom-6 left-6 hidden rounded-2xl bg-paper/95 p-5 text-[.95rem] backdrop-blur lg:block" aria-label="Einsatzgebiet">
                <li className="flex items-center gap-3"><span aria-hidden className="size-2 rounded-full bg-navy" />Sitz in Graz</li>
                <li className="mt-2 flex items-center gap-3"><span aria-hidden className="size-2 rounded-full bg-navy" />Ganze Steiermark</li>
                <li className="mt-2 flex items-center gap-3"><span aria-hidden className="size-2 rounded-full bg-ember" />Österreichweit nach Absprache</li>
              </ul>
            </div>
            <p className="mt-2 text-xs text-char">Symbolbild</p>

            {/* Quick-start ticket: plain GET form, works without JavaScript */}
            <form action="/kontakt" method="get" className="ticket rise relative mt-6 lg:absolute lg:-bottom-12 lg:right-8 lg:mt-0 lg:w-[360px]" aria-labelledby="ticket-title">
              <div className="p-6 pb-5">
                <h2 id="ticket-title" className="display text-[1.55rem] leading-tight">Schnell zum Angebot</h2>
                <p className="mt-1 text-sm text-paper/75">Drei Angaben, den Rest klären wir im Formular.</p>
              </div>
              <div className="ticket-cut" aria-hidden />
              <div className="grid gap-3 p-6 pt-5">
                <label className="block text-sm font-semibold">
                  Was steht an?
                  <select name="leistung" className="input mt-1.5" defaultValue="privatumzug">
                    {services.map((s) => <option key={s.slug} value={s.formValue}>{s.name}</option>)}
                    <option value="sonstiges">Sonstiges</option>
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-sm font-semibold">
                    PLZ von
                    <input name="von" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} placeholder="8010" className="input mt-1.5" />
                  </label>
                  <label className="block text-sm font-semibold">
                    PLZ nach
                    <input name="nach" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} placeholder="8041" className="input mt-1.5" />
                  </label>
                </div>
                <button type="submit" className="btn btn-primary mt-2 w-full">Weiter zur Anfrage</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ---------- Services ledger ---------- */}
      <section className="section" aria-labelledby="leistungen-title">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="leistungen-title" className="display h-lg">Was wir für Sie anpacken</h2>
            <p className="lead mt-5">
              Sieben Leistungen, ein Ansprechpartner. Vieles lässt sich kombinieren, etwa ein Umzug mit Kellerentrümpelung und Möbelmontage.
            </p>
            <Link href="/leistungen" className="link mt-6 inline-block font-semibold">Alle Leistungen im Überblick</Link>
          </div>
          <div className="ledger lg:col-span-8">
            {services.map((s) => (
              <Link key={s.slug} href={`/leistungen/${s.slug}`} className="group grid grid-cols-[1fr_auto] items-center gap-4 px-1 py-6 sm:px-4">
                <span>
                  <span className="display block text-[1.45rem] leading-tight sm:text-[1.7rem]">{s.name}</span>
                  <span className="mt-1.5 block text-char">{s.tagline}</span>
                </span>
                <span className="arrow grid size-11 place-items-center rounded-full border-[1.5px] border-navy"><ArrowIcon className="size-4" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Region ---------- */}
      <section className="section border-y border-line bg-sky" aria-labelledby="region-title">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 id="region-title" className="display h-lg">Zuhause in Graz. Unterwegs in der ganzen Steiermark.</h2>
            <p className="lead mt-5">
              Unser Sitz ist in Graz. Hier und in Graz-Umgebung sind wir am häufigsten im Einsatz. Genauso übernehmen wir Aufträge in allen
              steirischen Bezirken. Und wenn Ihr Umzug von Graz nach Wien, Klagenfurt oder Linz führt, finden wir nach Absprache eine Lösung.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Beispiele für Einsatzgebiete in der Steiermark">
              {regions.map((r) => (
                <li key={r} className="rounded-full border border-line bg-paper px-3.5 py-1.5 text-[.95rem]">{r}</li>
              ))}
            </ul>
          </div>
          <figure className="mx-auto w-full max-w-[460px]" aria-label="Einsatzgebiet: Graz im Zentrum, Steiermark als Hauptgebiet, Österreich nach Absprache">
            <div className="relative aspect-square rounded-full border-[1.5px] border-dashed border-navy/40">
              <span className="absolute left-1/2 top-[5%] -translate-x-1/2 whitespace-nowrap rounded-full bg-sky px-2 text-sm font-semibold">Österreich, nach Absprache</span>
              <div className="absolute inset-[16%] rounded-full border-[1.5px] border-navy bg-paper">
                <span className="absolute left-1/2 top-[8%] -translate-x-1/2 rounded-full bg-paper px-2 text-sm font-semibold">Steiermark</span>
                <div className="absolute inset-[26%] grid place-items-center rounded-full bg-navy text-center text-paper">
                  <span className="display text-2xl leading-tight sm:text-3xl">Graz<span className="mt-1 block font-sans text-xs font-medium sm:text-sm">& Umgebung</span></span>
                </div>
              </div>
            </div>
          </figure>
        </div>
      </section>

      {/* ---------- Process ---------- */}
      <section className="section" aria-labelledby="ablauf-title">
        <div className="wrap">
          <div className="max-w-2xl">
            <h2 id="ablauf-title" className="display h-lg">So einfach kommen Sie zu Ihrem Angebot</h2>
            <p className="lead mt-5">Kein Formular-Marathon, keine versteckten Schritte. Vier Etappen von der ersten Nachricht bis zum erledigten Auftrag.</p>
          </div>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-[20px] bg-line sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="bg-fog p-7">
                <span className="display text-5xl" aria-hidden>{i + 1}</span>
                <h3 className="h-sm mt-6">{s.title}</h3>
                <p className="mt-3 text-char">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- What we need for a quote ---------- */}
      <section className="section pt-0" aria-labelledby="angebot-title">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2">
          <div className="photo relative aspect-[4/3]">
            <Image src="/images/leere-wohnung-ankommen.webp" alt="Leerer, heller Altbauraum mit Holzboden und großem Fenster" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div>
            <h2 id="angebot-title" className="display h-lg">Ein faires Angebot beginnt mit guten Angaben</h2>
            <p className="lead mt-5">
              Wir arbeiten nicht mit Pauschalen, die am Ende nicht halten. Jedes Angebot entsteht aus Ihren konkreten Angaben. Diese Informationen helfen uns am meisten:
            </p>
            <ul className="ticks mt-7">
              {needs.map((n) => <li key={n}>{n}</li>)}
            </ul>
            <p className="mt-7 text-char">
              Wie sich der Preis zusammensetzt, erklären wir ausführlich im Ratgeber{" "}
              <Link href="/blog/umzug-graz-kosten" className="link text-ink">Was kostet ein Umzug in Graz?</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Values ---------- */}
      <section className="on-dark section bg-navy text-paper" aria-labelledby="werte-title">
        <div className="wrap">
          <div className="grid gap-8 lg:grid-cols-12">
            <h2 id="werte-title" className="display h-lg lg:col-span-5">Was Sie sich von uns erwarten dürfen</h2>
            <p className="lead text-paper/80 lg:col-span-6 lg:col-start-7">
              Sechs Zusagen, die für jeden Auftrag gelten, egal ob es um ein einzelnes Möbelstück oder ein ganzes Haus geht.
            </p>
          </div>
          <ul className="mt-12 grid border-t border-paper/30 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <li key={v.title} className="border-b border-paper/30 py-7 sm:pr-8">
                <h3 className="h-sm">{v.title}</h3>
                <p className="mt-2 text-paper/75">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Service intros (deeper internal links) ---------- */}
      <section className="section" aria-labelledby="schwerpunkte-title">
        <div className="wrap">
          <h2 id="schwerpunkte-title" className="display h-lg max-w-3xl">Umzug, Räumung, Möbel: unsere drei Schwerpunkte</h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <article className="card flex flex-col p-7">
              <h3 className="display text-2xl">Umziehen</h3>
              <p className="mt-3">
                Ob Wohnung im Grazer Altbau oder Haus in der Südsteiermark: Beim <Link className="link" href="/leistungen/privatumzug-graz">Privatumzug</Link> legen Sie fest, was wir übernehmen.
                Unternehmen planen mit uns den <Link className="link" href="/leistungen/firmenumzug-graz">Firmen- und Büroumzug</Link> so, dass der Betrieb weiterläuft.
              </p>
              <Link href="/blog/umzug-graz-checkliste" className="mt-auto pt-6 font-semibold underline-offset-4 hover:underline">Zur Umzugs-Checkliste</Link>
            </article>
            <article className="card flex flex-col p-7">
              <h3 className="display text-2xl">Räumen</h3>
              <p className="mt-3">
                Von der <Link className="link" href="/leistungen/entruempelung-graz">Entrümpelung</Link> des Kellers bis zur{" "}
                <Link className="link" href="/leistungen/haushaltsaufloesung-verlassenschaft-graz">Haushaltsauflösung und Verlassenschaftsräumung</Link>. Auch die{" "}
                <Link className="link" href="/leistungen/messiewohnung-raeumung-graz">Räumung stark überfüllter Wohnungen</Link> übernehmen wir, diskret und ohne zu urteilen.
              </p>
              <Link href="/blog/entruempelung-graz-ablauf" className="mt-auto pt-6 font-semibold underline-offset-4 hover:underline">So läuft eine Entrümpelung ab</Link>
            </article>
            <article className="card flex flex-col p-7">
              <h3 className="display text-2xl">Möbel bewegen</h3>
              <p className="mt-3">
                Für einzelne Stücke gibt es den <Link className="link" href="/leistungen/moebeltransport-graz">Möbeltransport</Link>, vom Sofa aus der Kleinanzeige bis zum Erbstück.
                Kästen, Betten und Büromöbel bauen wir bei der <Link className="link" href="/leistungen/moebeldemontage-montage-graz">Möbelmontage</Link> ab und wieder auf.
              </p>
              <Link href="/blog/moebeltransport-graz-einzelstuecke" className="mt-auto pt-6 font-semibold underline-offset-4 hover:underline">Tipps zum Möbeltransport</Link>
            </article>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="section border-t border-line" aria-labelledby="faq-title">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="faq-title" className="display h-lg">Häufige Fragen</h2>
            <p className="mt-5 text-char">Ihre Frage ist nicht dabei? Rufen Sie an oder schreiben Sie uns, wir antworten gerne.</p>
            <div className="mt-6"><a href={waHref("Hallo Die Anpacker, ich habe eine Frage:")} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm"><WhatsAppIcon className="size-4" /> Frage per WhatsApp</a></div>
          </div>
          <div className="lg:col-span-8"><FaqList faqs={faqs} /></div>
        </div>
      </section>

      {/* ---------- Ratgeber teaser ---------- */}
      <section className="section pt-0" aria-labelledby="ratgeber-title">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="ratgeber-title" className="display h-md">Aus dem Ratgeber</h2>
            <Link href="/blog" className="link font-semibold">Alle Beiträge</Link>
          </div>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {posts.slice(0, 3).map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="group block">
                  <div className="photo relative aspect-[3/2]">
                    <Image src={p.image.src} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                  </div>
                  <p className="kicker mt-4">{p.category}</p>
                  <h3 className="h-sm mt-1 group-hover:underline underline-offset-4">{p.title}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title="Erzählen Sie uns, was ansteht."
        text="Ein paar Eckdaten und Fotos genügen für den Anfang. Wir melden uns mit Rückfragen und einem individuellen Angebot."
      />
    </>
  );
}

// FAQ structured data is intentionally omitted: Google limits FAQ rich results to authoritative government/health sites.
