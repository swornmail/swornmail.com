import type { MetadataRoute } from "next";

// `output: export` has no server to evaluate a metadata route at request
// time, so Next requires the route to declare itself static explicitly.
export const dynamic = "force-static";

/**
 * One page, listed explicitly. A sitemap on a single-page site earns little
 * on its own — it exists so the `Sitemap:` line in robots.txt resolves, and
 * so adding a second page is a one-line change rather than a new decision.
 *
 * `lastModified` is deliberately omitted: a build timestamp would change on
 * every deploy whether or not the content did, which teaches a crawler to
 * ignore the field.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://swornmail.com/", changeFrequency: "monthly", priority: 1 }];
}
