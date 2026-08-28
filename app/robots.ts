import type { MetadataRoute } from "next";

// `output: export` has no server to evaluate a metadata route at request
// time, so Next requires the route to declare itself static explicitly.
export const dynamic = "force-static";

/**
 * Shipped in the repository rather than left to Cloudflare's managed
 * robots.txt, which blocks GPTBot, ClaudeBot, Google-Extended, CCBot and
 * others by default.
 *
 * That default is wrong for this site. The protocol is Apache-2.0 and exists
 * to be implemented by people who have not heard of it; an engineer hitting
 * the IPv6 reputation problem is more likely to ask an assistant than to
 * search for a protocol whose name they do not know. There is no proprietary
 * content here to protect and no adoption to lose. Blocking the crawlers
 * closes the discovery channel best suited to an obscure specification.
 *
 * Cloudflare's managed block must also be turned off at the zone, or it is
 * served instead of this file.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://swornmail.com/sitemap.xml",
  };
}
