import { abs, site } from "./site";
import { services } from "@/content/services";
import type { Service } from "@/content/services";
import type { Post } from "@/content/posts";

export const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;

const areaServed = [
  { "@type": "City", name: "Graz" },
  { "@type": "AdministrativeArea", name: "Graz-Umgebung" },
  { "@type": "State", name: "Steiermark" },
  { "@type": "Country", name: "Österreich" },
];

// MovingCompany is the schema.org LocalBusiness subtype that matches the business.
// Deliberately no openingHours, geo, priceRange or ratings: none are confirmed.
export function organization() {
  return {
    "@type": "MovingCompany",
    "@id": ORG_ID,
    name: site.name,
    url: abs("/"),
    logo: { "@type": "ImageObject", url: abs("/brand/die-anpacker-logo.png"), width: 457, height: 457 },
    image: abs("/images/og-die-anpacker.jpg"),
    description: site.description,
    email: site.email,
    telephone: site.phone.e164,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    hasMap: site.maps.url,
    areaServed,
    vatID: site.legal.vatId,
    knowsLanguage: "de",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: site.phone.e164,
      email: site.email,
      areaServed: "AT",
      availableLanguage: "de",
    },
    // Topics the business demonstrably covers on this site (service pages + Ratgeber).
    knowsAbout: ["Umzug", "Übersiedlung", "Firmenumzug", "Entrümpelung", "Haushaltsauflösung", "Verlassenschaftsräumung", "Messiewohnung räumen", "Möbeltransport", "Möbelmontage"],
    makesOffer: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.name, url: abs(`/leistungen/${s.slug}`) },
    })),
  };
}

export function website() {
  return { "@type": "WebSite", "@id": SITE_ID, url: abs("/"), name: site.name, inLanguage: site.locale, publisher: { "@id": ORG_ID } };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${abs(items.at(-1)?.path ?? "/")}#breadcrumb`,
    itemListElement: [{ name: "Startseite", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function serviceLd(s: Service) {
  return {
    "@type": "Service",
    "@id": `${abs(`/leistungen/${s.slug}`)}#service`,
    name: s.name,
    serviceType: s.name,
    description: s.answer,
    url: abs(`/leistungen/${s.slug}`),
    image: abs(s.image.src),
    provider: { "@id": ORG_ID },
    areaServed,
  };
}

// Ties a page to the site, its breadcrumb trail and what it is about.
export function webPage(path: string, name: string, description: string, about?: object) {
  return {
    "@type": "WebPage",
    "@id": `${abs(path)}#webpage`,
    url: abs(path),
    name,
    description,
    inLanguage: site.locale,
    isPartOf: { "@id": SITE_ID },
    breadcrumb: { "@id": `${abs(path)}#breadcrumb` },
    ...(about ? { about } : {}),
  };
}

export function articleLd(p: Post) {
  return {
    "@type": "BlogPosting",
    "@id": `${abs(`/blog/${p.slug}`)}#article`,
    headline: p.title,
    description: p.metaDescription,
    image: abs(p.image.src),
    datePublished: p.date,
    dateModified: p.updated ?? p.date,
    inLanguage: site.locale,
    mainEntityOfPage: abs(`/blog/${p.slug}`),
    isPartOf: { "@id": SITE_ID },
    articleSection: p.category,
    wordCount: p.body.split(/\s+/).filter(Boolean).length,
    ...(p.sources.length ? { citation: p.sources.map((s) => s.url) } : {}),
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    about: p.services.map((slug) => ({ "@id": `${abs(`/leistungen/${slug}`)}#service` })),
  };
}

export const graph = (...nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes });
