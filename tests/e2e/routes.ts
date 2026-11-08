import { posts } from "../../content/posts";
import { services } from "../../content/services";

export const routes = [
  "/",
  "/leistungen",
  ...services.map((s) => `/leistungen/${s.slug}`),
  "/ueber-uns",
  "/kontakt",
  "/blog",
  ...posts.map((p) => `/blog/${p.slug}`),
  "/impressum",
  "/datenschutz",
];
