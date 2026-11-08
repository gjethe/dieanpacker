import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, services } from "@/content/services";
import { getPost } from "@/content/posts";
import { Breadcrumbs, ContactButtons, CtaBand, FaqList, JsonLd } from "@/components/ui";
import { pageMeta } from "@/lib/meta";
import { abs } from "@/lib/site";
import { breadcrumbs, graph, serviceLd, webPage } from "@/lib/schema";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/leistungen/[slug]">) {
  const s = getService((await params).slug);
  if (!s) return {};
  return pageMeta({ title: s.metaTitle, description: s.metaDescription, path: `/leistungen/${s.slug}` });
}

// Blocking on purpose (instant = false): every slug is prerendered, and awaiting params outside <Suspense>
// keeps the content inline in the static HTML. With a Suspense fallback the HTML painted a placeholder
// first and React's reveal script swapped the content in later, gated by requestAnimationFrame and a
// view transition (layout <ViewTransition>): footer shift (CLS 0.21), and articles stayed hidden in
// background tabs / on busy devices. Cost: client navigation here waits for the static RSC payload.
export const instant = false;

export default function ServicePage({ params }: PageProps<"/leistungen/[slug]">) {
  return <Service params={params} />;
}

async function Service({ params }: Pick<PageProps<"/leistungen/[slug]">, "params">) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const path = `/leistungen/${s.slug}`;
  const crumbs = [{ name: "Leistungen", path: "/leistungen" }, { name: s.name, path }];
  const relatedPosts = s.posts.map(getPost).filter((p) => !!p);
  const relatedServices = s.related.map(getService).filter((x) => !!x);
  const contactHref = `/kontakt?leistung=${s.formValue}`;

  return (
    <>
      <section className="border-b border-line">
        <div className="wrap grid gap-10 pb-14 pt-8 lg:grid-cols-12 lg:pb-20">
          <div className="lg:col-span-7">
            <Breadcrumbs items={crumbs} />
            <h1 className="display h-lg mt-8">{s.h1}</h1>
            <p className="lead mt-6">{s.intro}</p>
            <div className="mt-8"><ContactButtons primary={s.cta} href={contactHref} /></div>
          </div>
          <div className="lg:col-span-5">
            <div className="photo relative aspect-[4/3] lg:aspect-[5/6]">
              <Image src={s.image.src} alt={s.image.alt} fill preload sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
            <p className="mt-2 text-xs text-char">Symbolbild</p>
          </div>
        </div>
      </section>

      {/* Direct answer block for readers and answer engines */}
      <section className="section pb-0" aria-labelledby="kurz-title">
        <div className="wrap">
          <div className="callout max-w-4xl !p-7 sm:!p-9">
            <h2 id="kurz-title" className="display text-2xl">Auf einen Blick</h2>
            <p className="mt-3 text-[1.1rem]">{s.answer}</p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="umfang-title">
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div>
            <h2 id="umfang-title" className="display h-md">Was die Leistung umfasst</h2>
            <ul className="ticks mt-7">{s.includes.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div>
            <h2 className="display h-md">Für wen das passt</h2>
            <ul className="ticks mt-7">{s.audience.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="section border-y border-line bg-sky" aria-labelledby="auftraege-title">
        <div className="wrap">
          <h2 id="auftraege-title" className="display h-md max-w-3xl">Typische Aufträge</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {s.jobs.map((j) => (
              <article key={j.title} className="card p-7">
                <h3 className="h-sm">{j.title}</h3>
                <p className="mt-3 text-char">{j.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="ablauf-title">
        <div className="wrap">
          <h2 id="ablauf-title" className="display h-md">So läuft es ab</h2>
          <ol className="mt-10 grid gap-px overflow-hidden rounded-[20px] bg-line sm:grid-cols-2 lg:grid-cols-4">
            {s.process.map((st, i) => (
              <li key={st.title} className="bg-fog p-7">
                <span className="display text-4xl" aria-hidden>{i + 1}</span>
                <h3 className="h-sm mt-5">{st.title}</h3>
                <p className="mt-3 text-char">{st.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section pt-0" aria-labelledby="vorbereitung-title">
        <div className="wrap grid gap-8 lg:grid-cols-2">
          <div className="card p-7 sm:p-10">
            <h2 id="vorbereitung-title" className="display h-md">Was Sie vorbereiten können</h2>
            <ul className="ticks mt-7">{s.prepare.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className="card p-7 sm:p-10">
            <h2 className="display h-md">Was wir für das Angebot brauchen</h2>
            <ul className="ticks mt-7">{s.quoteInfo.map((x) => <li key={x}>{x}</li>)}</ul>
            <Link href={contactHref} className="btn btn-primary mt-8">{s.cta}</Link>
          </div>
        </div>
      </section>

      <section className="on-dark section bg-navy text-paper" aria-labelledby="preis-title">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <h2 id="preis-title" className="display h-lg lg:col-span-5">Wie der Preis entsteht</h2>
          <div className="space-y-4 text-[1.1rem] text-paper/85 lg:col-span-6 lg:col-start-7">
            {s.pricing.map((p) => <p key={p}>{p}</p>)}
            <h3 className="h-sm pt-4 text-paper">Kombinierbar mit</h3>
            <ul className="space-y-2">
              {s.extras.map((x) => <li key={x} className="border-b border-paper/25 pb-2">{x}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="gebiet-title">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="gebiet-title" className="display h-md">Wo wir das anbieten</h2>
            <p className="mt-5 text-[1.1rem]">{s.area}</p>
          </div>
          <div className="lg:col-span-7">
            <h2 className="display h-md">Häufige Fragen</h2>
            <div className="mt-6"><FaqList faqs={s.faqs} /></div>
          </div>
        </div>
      </section>

      {(relatedPosts.length > 0 || relatedServices.length > 0) && (
        <section className="section border-t border-line" aria-labelledby="mehr-title">
          <div className="wrap grid gap-12 lg:grid-cols-2">
            {relatedPosts.length > 0 && (
              <div>
                <h2 id="mehr-title" className="display h-md">Ratgeber zum Thema</h2>
                <ul className="mt-6 space-y-4">
                  {relatedPosts.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/blog/${p.slug}`} className="card block p-6 hover:bg-sky">
                        <span className="h-sm block">{p.title}</span>
                        <span className="mt-2 block text-char">{p.excerpt}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h2 className="display h-md">Passende Leistungen</h2>
              <ul className="mt-6 space-y-4">
                {relatedServices.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/leistungen/${r.slug}`} className="card block p-6 hover:bg-sky">
                      <span className="h-sm block">{r.name}</span>
                      <span className="mt-2 block text-char">{r.tagline}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title={`${s.name}: jetzt anfragen`}
        text="Schicken Sie uns die Eckdaten und gerne Fotos. Sie erhalten ein individuelles Angebot mit klar beschriebenem Leistungsumfang."
        primary={s.cta}
        href={contactHref}
      />
      <JsonLd data={graph(webPage(path, s.metaTitle, s.metaDescription, { "@id": `${abs(path)}#service` }), breadcrumbs(crumbs), serviceLd(s))} />
    </>
  );
}
