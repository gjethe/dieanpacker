import Link from "next/link";
import type { Faq } from "@/content/services";
import { site, telHref, waHref } from "@/lib/site";
import { ArrowIcon, PhoneIcon, WhatsAppIcon } from "./icons";

export function JsonLd({ data }: { data: object }) {
  // Content is our own static data; escape "<" so it can never close the script tag.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Brotkrümelnavigation" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-char">
        <li><Link href="/" className="hover:underline underline-offset-4">Startseite</Link></li>
        {items.map((it, i) => (
          <li key={it.path} className="flex items-center gap-2">
            <span aria-hidden>/</span>
            {i === items.length - 1 ? (
              <span aria-current="page" className="text-ink">{it.name}</span>
            ) : (
              <Link href={it.path} className="hover:underline underline-offset-4">{it.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function FaqList({ faqs, headingLevel = 3 }: { faqs: Faq[]; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className="faq">
      {faqs.map((f) => (
        <details key={f.q}>
          <summary><H>{f.q}</H></summary>
          <div><p>{f.a}</p></div>
        </details>
      ))}
    </div>
  );
}

export function ContactButtons({ primary = "Unverbindlich anfragen", href = "/kontakt", invert = false }: { primary?: string; href?: string; invert?: boolean }) {
  const ghost = invert ? "btn btn-invert" : "btn btn-ghost";
  return (
    <div className="flex flex-wrap gap-3">
      <Link href={href} className="btn btn-primary">{primary} <ArrowIcon className="size-4" /></Link>
      <a href={telHref} className={ghost}><PhoneIcon className="size-4" /> Direkt anrufen</a>
      <a href={waHref()} className={ghost} target="_blank" rel="noopener noreferrer"><WhatsAppIcon className="size-4" /> Per WhatsApp schreiben</a>
    </div>
  );
}

export function CtaBand({ title, text, primary, href }: { title: string; text: string; primary?: string; href?: string }) {
  return (
    <section className="section" aria-labelledby="cta-title">
      <div className="wrap">
        <div className="grid gap-8 rounded-[20px] bg-blush p-7 sm:p-10 md:grid-cols-[1.3fr_1fr] md:items-end md:p-14">
          <div>
            <h2 id="cta-title" className="display h-lg">{title}</h2>
            <p className="lead mt-4">{text}</p>
          </div>
          <div className="md:justify-self-end">
            <ContactButtons primary={primary} href={href} />
            <p className="mt-4 text-sm text-char">
              Oder per E-Mail: <a className="link" href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
