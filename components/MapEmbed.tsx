"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/lib/site";

// Two-click embed: Google receives nothing (IP, cookies) until the visitor asks for the map.
export function MapEmbed({ className = "" }: { className?: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className={`relative overflow-hidden rounded-[20px] text-ink ${className}`}>
      {on ? (
        <iframe
          src={site.maps.embed}
          title={`Google Maps: ${site.name}, ${site.address.street}, ${site.address.postalCode} ${site.address.city}`}
          className="absolute inset-0 size-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-5 text-center">
          <svg aria-hidden className="size-8 text-ember" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
          </svg>
          <p className="font-semibold">{site.address.street}, {site.address.postalCode} {site.address.city}</p>
          <p className="max-w-xs text-sm text-char">
            Beim Laden der Karte werden Daten an Google übertragen.{" "}
            <Link href="/datenschutz#google-maps" className="link">Mehr erfahren</Link>
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOn(true)}>Karte laden</button>
            <a href={site.maps.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">In Google Maps öffnen</a>
          </div>
        </div>
      )}
    </div>
  );
}
