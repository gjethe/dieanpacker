import Image from "next/image";
import Link from "next/link";
import { site, telHref, waHref } from "@/lib/site";
import { services } from "@/content/services";
import { DesktopNav, MobileMenu } from "./Nav";
import { PhoneIcon, WhatsAppIcon } from "./icons";

export function Logo({ size = 52 }: { size?: number }) {
  return (
    <Image
      src="/logo.webp"
      alt="Die Anpacker, Umzüge & Entrümpelungen, Logo"
      width={size}
      height={size}
      className="shrink-0"
    />
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
      <div className="wrap flex h-[72px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label="Die Anpacker, zur Startseite">
          <Logo />
          <span className="display text-[1.35rem] leading-none">
            Die Anpacker
            <span className="mt-1 hidden whitespace-nowrap font-sans min-[380px]:block lg:hidden xl:block text-[.78rem] font-medium tracking-normal text-char">Umzug &amp; Räumung in Graz</span>
          </span>
        </Link>

        <DesktopNav />

        <div className="hidden items-center gap-2 md:flex">
          <a href={telHref} className="btn btn-ghost btn-sm" aria-label={`Anrufen: ${site.phone.display}`}>
            <PhoneIcon className="size-4" /> <span className="hidden xl:inline">{site.phone.display}</span><span className="xl:hidden">Anrufen</span>
          </a>
          {/* only on wide screens; smaller screens have WhatsApp in the menu panel and contact bar (.btn sets its own display) */}
          <span className="hidden xl:contents">
            <a href={waHref()} className="btn btn-ghost btn-sm" target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="size-4" /> WhatsApp
            </a>
          </span>
          <Link href="/kontakt" className="btn btn-primary btn-sm">Anfragen</Link>
        </div>

        <MobileMenu services={services.map(({ slug, name }) => ({ slug, name }))} />
      </div>
    </header>
  );
}
