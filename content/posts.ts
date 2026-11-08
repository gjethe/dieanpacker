import type { Faq } from "./services";
import { postsA } from "./posts-a";
import { postsB } from "./posts-b";
import { postsC } from "./posts-c";
import { postsD } from "./posts-d";

export type Post = {
  slug: string;
  category: "Umzug" | "Räumung" | "Möbel";
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  date: string; // ISO date, published
  updated?: string;
  image: { src: string; alt: string };
  services: string[];
  sources: { label: string; url: string }[];
  body: string; // markdown subset, see lib/md.tsx
  faqs: Faq[];
};

// Newest first, so the homepage teaser and the blog lists show recent articles at the top.
export const posts: Post[] = [...postsC, ...postsD, ...postsA, ...postsB].sort((a, b) => b.date.localeCompare(a.date));
export const categories = ["Umzug", "Räumung", "Möbel"] as const;
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

// Hand-picked "Weiterlesen" links per article (topic clusters, see TOPICAL-AUTHORITY-MAP.md).
const relatedMap: Record<string, string[]> = {
  "umzug-graz-checkliste": ["umzug-eine-woche-vorher", "umzug-graz-kosten", "moebel-umzug-vorbereiten"],
  "umzug-graz-kosten": ["umzugsangebot-vergleichen", "umzug-graz-checkliste", "moebelmontage-umzug"],
  "umzugsangebot-vergleichen": ["umzug-graz-kosten", "umzug-graz-checkliste", "moebel-umzug-vorbereiten"],
  "umzug-graz-umgebung": ["umzug-graz-checkliste", "keller-dachboden-entruempeln", "umzugsangebot-vergleichen"],
  "umzug-kurzfristig-organisieren": ["umzug-eine-woche-vorher", "umzug-graz-checkliste", "moebeltransport-graz-einzelstuecke"],
  "umzug-eine-woche-vorher": ["umzug-graz-checkliste", "moebel-umzug-vorbereiten", "umzug-kurzfristig-organisieren"],
  "umzug-im-alter": ["wohnung-raeumen-graz", "verlassenschaftsraeumung-graz", "umzug-graz-checkliste"],
  "firmenumzug-graz-planen": ["firmenuebersiedlung-adressaenderung", "moebelmontage-umzug", "umzugsangebot-vergleichen"],
  "firmenuebersiedlung-adressaenderung": ["firmenumzug-graz-planen", "entruempelung-entsorgung-graz", "umzugsangebot-vergleichen"],
  "entruempelung-graz-ablauf": ["entruempelung-entsorgung-graz", "keller-dachboden-entruempeln", "wohnung-raeumen-graz"],
  "wohnung-raeumen-graz": ["entruempelung-graz-ablauf", "entruempelung-entsorgung-graz", "verlassenschaftsraeumung-graz"],
  "keller-dachboden-entruempeln": ["entruempelung-entsorgung-graz", "entruempelung-graz-ablauf", "umzug-graz-umgebung"],
  "entruempelung-entsorgung-graz": ["entruempelung-graz-ablauf", "keller-dachboden-entruempeln", "messiewohnung-raeumen"],
  "verlassenschaftsraeumung-graz": ["wohnung-raeumen-graz", "entruempelung-entsorgung-graz", "umzug-im-alter"],
  "messiewohnung-raeumen": ["entruempelung-entsorgung-graz", "wohnung-raeumen-graz", "verlassenschaftsraeumung-graz"],
  "moebeltransport-graz-einzelstuecke": ["moebel-umzug-vorbereiten", "moebelmontage-umzug", "umzug-kurzfristig-organisieren"],
  "moebelmontage-umzug": ["moebel-umzug-vorbereiten", "moebeltransport-graz-einzelstuecke", "umzug-eine-woche-vorher"],
  "moebel-umzug-vorbereiten": ["moebelmontage-umzug", "moebeltransport-graz-einzelstuecke", "umzug-eine-woche-vorher"],
};

export const relatedPosts = (p: Post) =>
  (relatedMap[p.slug] ?? posts.filter((x) => x.category === p.category).map((x) => x.slug))
    .filter((s) => s !== p.slug)
    .map(getPost)
    .filter((x): x is Post => !!x)
    .slice(0, 3);

export const readingMinutes = (p: Post) =>
  Math.max(1, Math.round(p.body.split(/\s+/).length / 200));
