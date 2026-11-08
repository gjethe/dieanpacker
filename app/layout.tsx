import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { ViewTransition } from "react";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer, MobileContactBar } from "@/components/Footer";
import { ConsentManager } from "@/components/Consent";
import { JsonLd } from "@/components/ui";
import { graph, organization, website } from "@/lib/schema";
import { site } from "@/lib/site";
import { defaultOgImage } from "@/lib/meta";

// next/font downloads the files at build time and serves them from our own domain.
// One family for everything. "optional": text never repaints late (protects LCP); the metric-matched fallback is used if the font is slow.
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins", display: "optional" });

const isPreview = process.env.VERCEL_ENV === "preview";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Die Anpacker: Umzugsfirma & Entrümpelung in Graz", template: "%s | Die Anpacker" },
  description: site.description,
  applicationName: site.name,
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    locale: "de_AT",
    siteName: site.name,
    title: "Die Anpacker: Umzüge & Räumungen in Graz und der Steiermark",
    description: site.description,
    images: [defaultOgImage],
  },
  // Next fills twitter:title/description/image from openGraph on every page.
  twitter: { card: "summary_large_image" },
  robots: isPreview ? { index: false, follow: false } : { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  // data-scroll-behavior lets Next.js turn smooth scrolling off during route changes
  return (
    <html lang="de-AT" className={poppins.variable} data-scroll-behavior="smooth">
      {/* Browser extensions often inject attributes into <body>; this ignores only attribute diffs on this element. */}
      <body suppressHydrationWarning>
        <a href="#inhalt" className="skip">Zum Inhalt springen</a>
        <Header />
        {/* crossfades page content on navigation; header and footer stay put */}
        <main id="inhalt"><ViewTransition>{children}</ViewTransition></main>
        <Footer />
        <MobileContactBar />
        <ConsentManager />
        <JsonLd data={graph(organization(), website())} />
      </body>
    </html>
  );
}
