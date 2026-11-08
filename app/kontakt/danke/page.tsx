import type { Metadata } from "next";
import Link from "next/link";
import { site, telHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Danke für Ihre Anfrage",
  robots: { index: false, follow: true },
};

export default function DankePage() {
  return (
    <section className="section">
      <div className="wrap max-w-3xl">
        <h1 className="display h-lg">Danke, Ihre Anfrage ist bei uns angekommen.</h1>
        <p className="lead mt-6">
          Wir sehen uns Ihre Angaben an und melden uns bei Ihnen. Wenn es eilt, erreichen Sie uns telefonisch unter{" "}
          <a className="link" href={telHref}>{site.phone.display}</a>.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-ghost">Zur Startseite</Link>
          <Link href="/blog" className="btn btn-ghost">Zum Ratgeber</Link>
        </div>
      </div>
    </section>
  );
}
