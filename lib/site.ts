// Single source of truth for business facts. Change contact details here only.
// Items marked VERIFY are listed in CLIENT-VERIFICATION-REQUIRED.md.

const phoneE164 = "+436603926662"; // VERIFY: taken from old site + its WhatsApp widget config

export const site = {
  name: "Die Anpacker",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://dieanpacker.at").replace(/\/+$/, ""),
  locale: "de-AT",
  description:
    "Die Anpacker aus Graz übernehmen Privat- und Firmenumzüge, Entrümpelungen, Haushaltsauflösungen, Verlassenschaftsräumungen, Möbeltransporte sowie Möbelmontage, in Graz und der Steiermark, nach Absprache auch österreichweit.",
  // Short, factual description used for AI/entity consistency across pages.
  entity:
    "Die Anpacker ist ein Umzugs- und Räumungsunternehmen mit Sitz in Graz. Hauptgebiet sind Graz, Graz-Umgebung und die Steiermark; Aufträge in anderen Bundesländern sind je nach Umfang und Entfernung möglich.",
  email: "office@dieanpacker.at",
  phone: {
    e164: phoneE164,
    display: "+43 660 392 66 62",
  },
  whatsapp: {
    number: phoneE164.replace("+", ""),
    message:
      "Hallo Die Anpacker, ich hätte gerne eine unverbindliche Anfrage zu einem Umzug bzw. einer Räumung.",
  },
  address: {
    street: "Neusiedlergasse 7",
    postalCode: "8041",
    city: "Graz",
    region: "Steiermark",
    country: "AT",
    countryName: "Österreich",
  },
  // Google Business Profile place (CID from the client's embed code). Embed set to German / Austria.
  maps: {
    url: "https://www.google.com/maps?cid=17061681373244183094",
    embed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d86954.23037542186!2d15.44196275!3d47.073193950000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9cdc375e5b56871%3A0xecc744cff31e5236!2sDie%20Anpacker!5e0!3m2!1sde!2sat!4v1794072383106!5m2!1sde!2sat",
  },
  // VERIFY all legal fields with the client before launch (values from the old Impressum).
  legal: {
    owner: "Gentrit Hoxha",
    tradeName: "DieAnpacker, Gentrit Hoxha",
    vatId: "ATU83037278",
    trade: "Güterbeförderungsgewerbe",
    authority: "Magistrat der Stadt Graz",
    chamber: "Wirtschaftskammer Steiermark, Fachgruppe Transport und Verkehr",
  },
  hosting: {
    // VERIFY: assumed deployment target. Update the privacy policy if hosting changes.
    name: "Vercel Inc.",
    address: "440 N Barranca Ave #4133, Covina, CA 91723, USA",
  },
  mailProvider: {
    name: "Hostinger International Ltd.",
    address: "61 Lordou Vironos Street, 6023 Larnaca, Zypern",
  },
  serviceArea: ["Graz", "Graz-Umgebung", "Steiermark", "Österreich (nach Absprache)"],
} as const;

export const telHref = `tel:${site.phone.e164}`;
export const mailHref = `mailto:${site.email}`;
export const waHref = (message: string = site.whatsapp.message) =>
  `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;

export const nav = [
  { href: "/leistungen", label: "Leistungen" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/blog", label: "Ratgeber" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export const abs = (path = "/") => `${site.url}${path === "/" ? "" : path}`;
