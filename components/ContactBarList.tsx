"use client";

import type { PointerEvent, ReactNode } from "react";

// Chromium applies :active only once a quick tap has ended, so the pressed state starts on pointerdown instead.
const press = (e: PointerEvent<HTMLUListElement>) => (e.target as Element).closest("a")?.setAttribute("data-pressed", "");
const release = (e: PointerEvent<HTMLUListElement>) => e.currentTarget.querySelector("[data-pressed]")?.removeAttribute("data-pressed");

export function ContactBarList({ children }: { children: ReactNode }) {
  return <ul className="grid h-16 grid-cols-3" onPointerDown={press} onPointerUp={release} onPointerCancel={release} onPointerLeave={release}>{children}</ul>;
}
