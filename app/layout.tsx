import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://swornmail.com"),
  // Declared explicitly because `trailingSlash: true` means /deploy and
  // /deploy/ both resolve; without this a crawler picks its own winner.
  alternates: { canonical: "/" },
  title: "SwornMail — an accountable unit for IPv6 mail",
  // Kept under 160 characters, where search results start truncating.
  description:
    "SwornMail is an open protocol for IPv6 email reputation: an operator attests that a prefix is one accountable entity, staked on its domain. Fail-open.",
  // No image is referenced on purpose: a preview fetcher pulling an image is
  // still an external request, and there is no product screenshot worth
  // showing because there is no product.
  openGraph: {
    type: "website",
    url: "https://swornmail.com/",
    title: "SwornMail — an accountable unit for IPv6 mail",
    description:
      "IP reputation is arithmetically dead against 2^64 addresses. SwornMail lets the sender declare the accountable unit, and stake a domain name on it.",
  },
  twitter: { card: "summary" },
  // Same-origin SVG favicon. Still no external request, and unlike the data:
  // URI it replaces, it is a URL a search engine can fetch and show.
  icons: { icon: "/favicon.svg" },
};

/**
 * Structured data. Two jobs: getting the protocol into rich results, and
 * giving an assistant something unambiguous to cite when someone asks how
 * IPv6 sender reputation is supposed to work.
 *
 * Every claim here is one the page already makes. Nothing asserts adoption,
 * an organisation, or a product, because none of those exist.
 */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://swornmail.com/#website",
      url: "https://swornmail.com/",
      name: "SwornMail",
      description:
        "An open protocol for attesting that an IPv6 prefix is one accountable entity, staked on a domain name.",
      inLanguage: "en",
      publisher: { "@id": "https://swornmail.com/#maintainer" },
    },
    {
      "@type": "Person",
      "@id": "https://swornmail.com/#maintainer",
      name: "Val Kafedzhy",
      url: "https://github.com/swornmail",
    },
    {
      "@type": "TechArticle",
      "@id": "https://swornmail.com/#article",
      isPartOf: { "@id": "https://swornmail.com/#website" },
      headline: "IP reputation is arithmetically dead on IPv6",
      description:
        "SwornMail lets a sending operator publish a signed, verifiable claim that an IPv6 prefix is one accountable entity, so receivers get a stable reputation unit instead of 2^64 unusable addresses.",
      author: { "@id": "https://swornmail.com/#maintainer" },
      license: "https://www.apache.org/licenses/LICENSE-2.0",
      about: [
        { "@type": "Thing", name: "Email authentication" },
        { "@type": "Thing", name: "IPv6 sender reputation" },
      ],
    },
  ],
};

// Applied before first paint so the page never flashes the wrong theme. It
// runs ahead of hydration, which is the only reason it is inlined rather than
// living in the toggle component.
const themeBootstrap = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}document.documentElement.classList.add('js')})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        {/* dangerouslySetInnerHTML is correct here and carries no XSS risk:
            the payload is a module-scope constant defined directly above,
            with no interpolation and no runtime input of any kind. It has to
            be inlined and blocking so the theme is set before first paint;
            deferring it to a component would reintroduce the flash it exists
            to prevent. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        {/* JSON-LD. Inert data rather than executable code, and built from a
            module-scope constant with no runtime input, so it carries the same
            (absent) XSS risk as the theme bootstrap above. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
