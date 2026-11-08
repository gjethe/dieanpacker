import Image from "next/image";
import Link from "next/link";
import { services } from "@/content/services";
import { ArrowIcon } from "@/components/icons";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/ui";
import { pageMeta } from "@/lib/meta";
import { breadcrumbs, graph } from "@/lib/schema";
import { abs } from "@/lib/site";

export const metadata = pageMeta({
  title: "Leistungen: Umzug, Entrümpelung & Möbeltransport in Graz",
  description:
    "Alle Leistungen: Privat- und Firmenumzug, Entrümpelung, Haushaltsauflösung, Messiewohnung, Möbeltransport und Möbelmontage in Graz und der Steiermark.",
  path: "/leistungen",
});

const groups = [
  { kind: "umzug", title: "Umziehen", text: "Für Privathaushalte und Unternehmen: innerhalb von Graz, in der Steiermark und nach Absprache darüber hinaus." },
  { kind: "raeumung", title: "Räumen", text: "Vom einzelnen Kellerabteil bis zum ganzen Haus. Was bleibt und was geht, legen wir vorher gemeinsam fest." },
  { kind: "moebel", title: "Möbel bewegen", text: "Einzelne Stücke transportieren, Kästen zerlegen und wieder aufbauen." },
] as const;

export default function LeistungenPage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="wrap pb-14 pt-8 md:pb-20">
          <Breadcrumbs items={[{ name: "Leistungen", path: "/leistungen" }]} />
          <h1 className="display h-xl mt-8 max-w-4xl">Unsere Leistungen in Graz und der Steiermark</h1>
          <p className="lead mt-6">
            Die Anpacker übernehmen Umzüge, Räumungen und Möbeltransporte für Privatpersonen und Unternehmen. Jede Leistung können Sie einzeln buchen oder kombinieren.
            Das Angebot erstellen wir individuell nach Ihren Angaben.
          </p>
          <nav aria-label="Leistungen auf dieser Seite" className="mt-8 flex flex-wrap gap-2">
            {services.map((s) => (
              <a key={s.slug} href={`#${s.slug}`} className="rounded-full border border-line bg-paper px-4 py-2 text-[.95rem] font-medium hover:bg-sky">{s.name}</a>
            ))}
          </nav>
        </div>
      </section>

      {groups.map((g) => (
        <section key={g.kind} className="section border-b border-line last:border-b-0" aria-labelledby={`g-${g.kind}`}>
          <div className="wrap">
            <div className="grid gap-4 lg:grid-cols-12">
              <h2 id={`g-${g.kind}`} className="display h-lg lg:col-span-5">{g.title}</h2>
              <p className="lead lg:col-span-6 lg:col-start-7">{g.text}</p>
            </div>
            <div className="mt-12 grid gap-8">
              {services.filter((s) => s.kind === g.kind).map((s, i) => (
                <article key={s.slug} id={s.slug} className="card grid scroll-mt-28 overflow-hidden md:grid-cols-2">
                  <div className={`relative min-h-[240px] border-b border-line md:border-b-0 ${i % 2 ? "md:order-2 md:border-l" : "md:border-r"}`}>
                    <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                  </div>
                  <div className="flex flex-col p-7 sm:p-10">
                    <h3 className="display text-[1.9rem] leading-tight">{s.name}</h3>
                    <p className="mt-4">{s.answer}</p>
                    <ul className="ticks mt-6">
                      {s.includes.slice(0, 4).map((x) => <li key={x}>{x}</li>)}
                    </ul>
                    <div className="mt-8 flex flex-wrap gap-3 pt-2">
                      <Link href={`/leistungen/${s.slug}`} className="btn btn-ghost">Mehr zu {s.name} <ArrowIcon className="size-4" /></Link>
                      <Link href={`/kontakt?leistung=${s.formValue}`} className="btn btn-primary">{s.cta}</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      <CtaBand title="Nicht sicher, welche Leistung passt?" text="Beschreiben Sie einfach Ihr Vorhaben. Wir sagen Ihnen, wie wir es angehen würden, und erstellen ein passendes Angebot." />
      <JsonLd
        data={graph(breadcrumbs([{ name: "Leistungen", path: "/leistungen" }]), {
          "@type": "ItemList",
          itemListElement: services.map((s, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/leistungen/${s.slug}`), name: s.name })),
        })}
      />
    </>
  );
}
