import Link from "next/link";
import type { ReactNode } from "react";

// Minimal Markdown subset for our own trusted article content:
// ## h2, ### h3, paragraphs, "- " lists, "1. " lists, "> " callouts, **bold**, [text](href).

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function inline(text: string, key = ""): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${key}-${i++}`;
    if (m[1]) out.push(<strong key={k}>{m[1]}</strong>);
    else {
      const href = m[3];
      out.push(
        href.startsWith("/") ? (
          <Link key={k} href={href}>{m[2]}</Link>
        ) : (
          <a key={k} href={href} target="_blank" rel="noopener noreferrer">{m[2]}</a>
        ),
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export type Heading = { id: string; text: string };

export function headings(md: string): Heading[] {
  return md
    .split("\n")
    .filter((l) => l.startsWith("## "))
    .map((l) => ({ id: slugify(l.slice(3)), text: l.slice(3).trim() }));
}

export function Markdown({ source }: { source: string }) {
  const blocks = source.trim().split(/\n\s*\n/);
  return (
    <>
      {blocks.map((block, b) => {
        const lines = block.split("\n").map((l) => l.trim());
        const first = lines[0];
        const key = `b${b}`;
        if (first.startsWith("### ")) return <h3 key={key} id={slugify(first.slice(4))}>{inline(first.slice(4), key)}</h3>;
        if (first.startsWith("## ")) return <h2 key={key} id={slugify(first.slice(3))}>{inline(first.slice(3), key)}</h2>;
        if (lines.every((l) => l.startsWith("- ")))
          return <ul key={key}>{lines.map((l, i) => <li key={i}>{inline(l.slice(2), `${key}-${i}`)}</li>)}</ul>;
        if (lines.every((l) => /^\d+\. /.test(l)))
          return <ol key={key}>{lines.map((l, i) => <li key={i}>{inline(l.replace(/^\d+\. /, ""), `${key}-${i}`)}</li>)}</ol>;
        if (lines.length > 2 && lines.every((l) => l.startsWith("|"))) {
          // | head | head |  /  |---|---|  /  | cell | cell |
          const cells = (l: string) => l.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
          const [head, , ...rows] = lines;
          return (
            // focusable + labelled so keyboard users can scroll it on narrow screens (WCAG 2.1.1)
            <div key={key} className="table-wrap" tabIndex={0} role="region" aria-label={`Tabelle: ${cells(head).join(", ")}`}>
              <table>
                <thead><tr>{cells(head).map((c, i) => <th key={i} scope="col">{inline(c, `${key}-h${i}`)}</th>)}</tr></thead>
                <tbody>{rows.map((r, j) => <tr key={j}>{cells(r).map((c, i) => <td key={i} data-label={cells(head)[i]}>{inline(c, `${key}-${j}-${i}`)}</td>)}</tr>)}</tbody>
              </table>
            </div>
          );
        }
        if (lines.every((l) => l.startsWith(">")))
          return (
            <aside key={key} className="callout">
              <p>{inline(lines.map((l) => l.replace(/^>\s?/, "")).join(" "), key)}</p>
            </aside>
          );
        return <p key={key}>{inline(lines.join(" "), key)}</p>;
      })}
    </>
  );
}
