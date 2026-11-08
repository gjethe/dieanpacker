import Link from "next/link";
import { services } from "@/content/services";

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap max-w-3xl">
        <p className="kicker">Fehler 404</p>
        <h1 className="display h-lg mt-3">Diese Seite gibt es nicht (mehr).</h1>
        <p className="lead mt-6">Vielleicht hilft Ihnen einer dieser Links weiter:</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          <li><Link href="/" className="btn btn-ghost btn-sm">Startseite</Link></li>
          {services.slice(0, 4).map((s) => <li key={s.slug}><Link href={`/leistungen/${s.slug}`} className="btn btn-ghost btn-sm">{s.name}</Link></li>)}
          <li><Link href="/kontakt" className="btn btn-primary btn-sm">Kontakt</Link></li>
        </ul>
      </div>
    </section>
  );
}
