import { categories, posts } from "@/content/posts";
import { services } from "@/content/services";
import { abs, site } from "@/lib/site";

// llms.txt (llmstxt.org): a plain-text map of the site for AI tools. Built from the same data as the pages,
// so it can never say anything the visible site does not. Not a ranking factor; prerendered at build time.
export function GET() {
  const a = site.address;
  const body = [
    `# ${site.name}`,
    "",
    `> ${site.entity}`,
    "",
    `Leistungen: Privatumzüge, Firmen- und Büroumzüge, Entrümpelungen, Haushaltsauflösungen, Verlassenschaftsräumungen, Räumung stark überfüllter Wohnungen (Messiewohnungen), Möbeltransporte sowie Möbeldemontage und -montage.`,
    `Angebote werden individuell nach Umfang erstellt; auf der Website werden keine Pauschalpreise genannt. Anfragen sind per Formular (auch mit Fotos), Telefon, WhatsApp oder E-Mail möglich.`,
    "",
    "## Kontakt",
    "",
    `- Telefon und WhatsApp: ${site.phone.display}`,
    `- E-Mail: ${site.email}`,
    `- Geschäftsadresse: ${a.street}, ${a.postalCode} ${a.city}, ${a.countryName} (kein Kundenbüro, Termine nach Vereinbarung)`,
    `- Einsatzgebiet: ${site.serviceArea.join(", ")}`,
    `- [Anfrage stellen](${abs("/kontakt")})`,
    "",
    "## Leistungen",
    "",
    ...services.map((s) => `- [${s.name}](${abs(`/leistungen/${s.slug}`)}): ${s.tagline}`),
    "",
    ...categories.flatMap((c) => [
      `## Ratgeber: ${c}`,
      "",
      ...posts.filter((p) => p.category === c).map((p) => `- [${p.title}](${abs(`/blog/${p.slug}`)}): ${p.excerpt}`),
      "",
    ]),
    "## Unternehmen",
    "",
    `- [Über uns](${abs("/ueber-uns")})`,
    `- [Impressum](${abs("/impressum")})`,
    `- [Datenschutz](${abs("/datenschutz")})`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
