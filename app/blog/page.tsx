import Image from "next/image";
import Link from "next/link";
import { categories, posts, readingMinutes } from "@/content/posts";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/ui";
import { pageMeta } from "@/lib/meta";
import { breadcrumbs, graph, ORG_ID } from "@/lib/schema";
import { abs } from "@/lib/site";

export const metadata = pageMeta({
  title: "Ratgeber: Umzug, Entrümpelung & Möbeltransport in Graz",
  description:
    "Praktische Ratgeber rund um Umzug, Entrümpelung, Haushaltsauflösung und Möbeltransport in Graz: Checklisten, Kostenfaktoren, Abläufe und Tipps aus der Praxis.",
  path: "/blog",
});

const intro: Record<(typeof categories)[number], string> = {
  Umzug: "Planung, Kosten und Organisation, für Privathaushalte und Unternehmen.",
  Räumung: "Entrümpelung, Haushaltsauflösung und sensible Räumungen Schritt für Schritt.",
  Möbel: "Einzelne Möbelstücke transportieren, zerlegen und wieder aufbauen.",
};

const fmt = (d: string) => new Date(d).toLocaleDateString("de-AT", { day: "numeric", month: "long", year: "numeric" });

export default function BlogPage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="wrap pb-14 pt-8 md:pb-20">
          <Breadcrumbs items={[{ name: "Ratgeber", path: "/blog" }]} />
          <h1 className="display h-xl mt-8">Ratgeber</h1>
          <p className="lead mt-6">
            Antworten auf die Fragen, die uns vor einem Umzug oder einer Räumung am häufigsten gestellt werden, mit Blick auf Graz und die Steiermark.
          </p>
          <nav aria-label="Themen im Ratgeber" className="mt-8">
            <ul className="flex flex-wrap gap-3">
              {categories.map((c) => (
                <li key={c}>
                  <a href={`#cat-${c}`} className="btn btn-ghost btn-sm">{c} <span className="text-char">({posts.filter((p) => p.category === c).length})</span></a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {categories.map((c) => {
        const list = posts.filter((p) => p.category === c);
        return (
          <section key={c} className="section border-b border-line last:border-b-0" aria-labelledby={`cat-${c}`}>
            <div className="wrap">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 id={`cat-${c}`} className="display h-md">{c}</h2>
                <p className="text-char">{intro[c]}</p>
              </div>
              <ul className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                {list.map((p) => (
                  <li key={p.slug}>
                    <article className="group relative">
                      <div className="photo relative aspect-[3/2]">
                        <Image src={p.image.src} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover" />
                      </div>
                      <h3 className="h-sm mt-5">
                        <Link href={`/blog/${p.slug}`} className="after:absolute after:inset-0 group-hover:underline underline-offset-4">{p.title}</Link>
                      </h3>
                      <p className="mt-2 text-char">{p.excerpt}</p>
                      <p className="mt-3 text-sm text-char"><time dateTime={p.date}>{fmt(p.date)}</time>, {readingMinutes(p)} Min. Lesezeit</p>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}

      <CtaBand title="Lieber gleich mit jemandem sprechen?" text="Wir beantworten Ihre Fragen auch direkt, telefonisch, per WhatsApp oder über das Anfrageformular." />
      <JsonLd
        data={graph(breadcrumbs([{ name: "Ratgeber", path: "/blog" }]), {
          "@type": "Blog",
          "@id": `${abs("/blog")}#blog`,
          name: "Ratgeber von Die Anpacker",
          url: abs("/blog"),
          inLanguage: "de-AT",
          publisher: { "@id": ORG_ID },
          blogPost: posts.map((p) => ({ "@id": `${abs(`/blog/${p.slug}`)}#article`, headline: p.title, url: abs(`/blog/${p.slug}`), datePublished: p.date })),
        })}
      />
    </>
  );
}
