import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, posts, readingMinutes, relatedPosts } from "@/content/posts";
import { getService } from "@/content/services";
import { Breadcrumbs, CtaBand, FaqList, JsonLd } from "@/components/ui";
import { headings, Markdown } from "@/lib/md";
import { pageMeta } from "@/lib/meta";
import { articleLd, breadcrumbs, graph, webPage } from "@/lib/schema";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const p = getPost((await params).slug);
  if (!p) return {};
  return pageMeta({ title: p.metaTitle, description: p.metaDescription, path: `/blog/${p.slug}`, article: { published: p.date, modified: p.updated } });
}

const fmt = (d: string) => new Date(d).toLocaleDateString("de-AT", { day: "numeric", month: "long", year: "numeric" });

// Blocking on purpose (instant = false): every slug is prerendered, and awaiting params outside <Suspense>
// keeps the content inline in the static HTML. With a Suspense fallback the HTML painted a placeholder
// first and React's reveal script swapped the content in later, gated by requestAnimationFrame and a
// view transition (layout <ViewTransition>): footer shift (CLS 0.21), and articles stayed hidden in
// background tabs / on busy devices. Cost: client navigation here waits for the static RSC payload.
export const instant = false;

export default function PostPage({ params }: PageProps<"/blog/[slug]">) {
  return <Post params={params} />;
}

async function Post({ params }: Pick<PageProps<"/blog/[slug]">, "params">) {
  const p = getPost((await params).slug);
  if (!p) notFound();
  const path = `/blog/${p.slug}`;
  const crumbs = [{ name: "Ratgeber", path: "/blog" }, { name: p.title, path }];
  const toc = headings(p.body);
  const related = relatedPosts(p);
  const svc = p.services.map(getService).filter((s) => !!s);
  const main = svc[0]!;

  return (
    <>
      <article>
        <header className="border-b border-line">
          <div className="wrap pb-12 pt-8">
            <Breadcrumbs items={crumbs} />
            <p className="kicker mt-8">{p.category}</p>
            <h1 className="display h-lg mt-3 max-w-4xl">{p.title}</h1>
            <p className="mt-5 text-char">
              Von <Link href="/ueber-uns" className="link text-ink">Die Anpacker</Link>, Graz, veröffentlicht am <time dateTime={p.date}>{fmt(p.date)}</time>
              {p.updated && <>, aktualisiert am <time dateTime={p.updated}>{fmt(p.updated)}</time></>}, {readingMinutes(p)} Min. Lesezeit
            </p>
            <div className="photo relative mt-10 aspect-[16/9] max-h-[560px] w-full">
              <Image src={p.image.src} alt={p.image.alt} fill preload sizes="(min-width: 1240px) 1160px, 100vw" className="object-cover" />
            </div>
          </div>
        </header>

        <div className="wrap grid gap-12 py-14 lg:grid-cols-12">
          <aside className="lg:col-span-3 lg:col-start-10 lg:row-start-1">
            <div className="lg:sticky lg:top-28 space-y-6">
              <nav aria-label="Inhalt dieses Beitrags" className="card p-6">
                <h2 className="font-display text-lg font-semibold">Inhalt</h2>
                <ol className="mt-3 space-y-2 text-[.95rem]">
                  {toc.map((h) => <li key={h.id}><a href={`#${h.id}`} className="hover:underline underline-offset-4">{h.text}</a></li>)}
                </ol>
              </nav>
              <div className="ticket p-6">
                <p className="display text-xl leading-tight">{main.name} in Graz</p>
                <p className="mt-2 text-sm text-paper/75">Individuelles Angebot nach Ihren Angaben.</p>
                <Link href={`/kontakt?leistung=${main.formValue}`} className="btn btn-primary btn-sm mt-4 w-full">{main.cta}</Link>
              </div>
            </div>
          </aside>

          <div className="prose lg:col-span-8 lg:row-start-1">
            <Markdown source={p.body} />

            <h2 id="haeufige-fragen">Häufige Fragen</h2>
            <FaqList faqs={p.faqs} />

            {p.sources.length > 0 && (
              <>
                <h2 id="quellen">Quellen und weiterführende Informationen</h2>
                <ul>
                  {p.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}
                </ul>
              </>
            )}

            <p className="text-[.95rem] text-char">
              Hinweis: Dieser Beitrag dient der allgemeinen Information und ersetzt keine rechtliche oder behördliche Auskunft. Stand: <time dateTime={p.updated ?? p.date}>{fmt(p.updated ?? p.date)}</time>.
            </p>
          </div>
        </div>
      </article>

      <section className="section border-t border-line" aria-labelledby="weiter-title">
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div>
            <h2 id="weiter-title" className="display h-md">Passende Leistungen</h2>
            <ul className="mt-6 space-y-4">
              {svc.map((s) => (
                <li key={s.slug}>
                  <Link href={`/leistungen/${s.slug}`} className="card block p-6 hover:bg-sky">
                    <span className="h-sm block">{s.name}</span>
                    <span className="mt-2 block text-char">{s.tagline}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {related.length > 0 && (
            <div>
              <h2 className="display h-md">Weiterlesen</h2>
              <ul className="mt-6 space-y-4">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/blog/${r.slug}`} className="card block p-6 hover:bg-sky">
                      <span className="h-sm block">{r.title}</span>
                      <span className="mt-2 block text-char">{r.excerpt}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <CtaBand title="Sie planen etwas Ähnliches?" text="Schicken Sie uns die Eckdaten und gerne ein paar Fotos, Sie erhalten ein individuelles Angebot." primary={main.cta} href={`/kontakt?leistung=${main.formValue}`} />
      <JsonLd data={graph(webPage(path, p.metaTitle, p.metaDescription), breadcrumbs(crumbs), articleLd(p))} />
    </>
  );
}
