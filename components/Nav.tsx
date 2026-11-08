"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { nav, site, telHref, waHref } from "@/lib/site";
import { ArrowIcon, PhoneIcon, WhatsAppIcon } from "./icons";

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export function DesktopNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Hauptnavigation" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {nav.map((n) => (
          <li key={n.href}>
            <Link href={n.href} className="navlink" aria-current={isActive(pathname, n.href) ? "page" : undefined}>
              {n.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Slide-in side panel built on <dialog>: focus stays inside, Escape and backdrop click close it.
// Service links come in as props: importing content/services here would ship all service copy to every visitor.
export function MobileMenu({ services }: { services: { slug: string; name: string }[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const close = () => ref.current?.close();

  return (
    <>
      {/* wrapper hides the trigger on desktop (.btn sets its own display) */}
      <div className="lg:hidden">
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        aria-haspopup="dialog"
        aria-controls="mobile-menu"
        onClick={() => ref.current?.showModal()}
      >
        <svg aria-hidden className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h10" /></svg>
        Menü
      </button>
      </div>

      <dialog
        id="mobile-menu"
        ref={ref}
        aria-label="Menü"
        className="drawer"
        onClick={(e) => {
          // backdrop clicks land on the <dialog> itself; links close the panel before navigating
          if (e.target === ref.current || (e.target as HTMLElement).closest("a")) close();
        }}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <p className="text-lg font-semibold">{site.name}</p>
            <button type="button" onClick={close} className="grid size-11 place-items-center rounded-full bg-fog transition-colors hover:bg-sky" aria-label="Menü schließen">
              <svg aria-hidden className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>

          <nav aria-label="Mobile Navigation" className="px-3 pt-4">
            <ul>
              {[{ href: "/", label: "Startseite" }, ...nav].map((n) => {
                const active = n.href === "/" ? pathname === "/" : isActive(pathname, n.href);
                return (
                  <li key={n.href}>
                    <Link href={n.href} aria-current={active ? "page" : undefined} className="drawer-link">
                      {n.label}
                      <ArrowIcon className="size-4" />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <p className="mt-6 px-3 text-sm font-medium text-char">Leistungen</p>
            <ul className="mt-2 grid gap-0.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/leistungen/${s.slug}`} aria-current={pathname === `/leistungen/${s.slug}` ? "page" : undefined} className="drawer-sublink">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sticky bottom-0 mt-auto space-y-3 border-t border-line bg-fog px-6 py-5">
            <Link href="/kontakt" className="btn btn-primary w-full">Unverbindlich anfragen <ArrowIcon className="size-4" /></Link>
            <div className="grid grid-cols-2 gap-3">
              <a href={telHref} className="btn btn-ghost btn-sm"><PhoneIcon className="size-4" /> Anrufen</a>
              <a href={waHref()} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm"><WhatsAppIcon className="size-4" /> WhatsApp</a>
            </div>
            <p className="pt-1 text-center text-sm text-char">{site.address.street}, {site.address.postalCode} {site.address.city}</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
