# swornmail.com

The public marketing site for the SwornMail protocol. Advocacy, not commerce.

**The site is protocol-only.** It carries no reference to the commercial
reputation feed at all — not even as a limitation (Val, 2026-08-24). The
`public-boundary` workflow enforces that: it fails the build if commercial
language appears under `app/`, if private-side identifiers or credential
patterns appear anywhere, or if the copy starts claiming adoption that does not
exist.

The one deliberate exception is the footer's "Maintained by PlatOps Security,
LLC" credit, which every repository in the org carries and which is attribution
rather than a product reference.

Next.js static export, Tailwind, published to Cloudflare Pages by GitHub
Actions on merge to `main`.

```sh
npm install
npm run dev      # http://localhost:3000
npm run build    # static export into out/
npm run serve    # serve the built export
```

## Design decisions

**Typography.** System font stacks only, because a third-party font is a
third-party request and this audience checks. That rules out most typographic
effects, so hierarchy does the work: one large typographic hero, tight heading
tracking, and a monospace small-caps label above each section. Prose is capped
at 34rem — a protocol audience reads, and a 90-character line is where they
stop.

**Palette.** Warm off-white rather than pure white, near-black rather than
black, one deep blue accent. A second colour, amber, is reserved for exactly
one job: marking what an operator should notice in otherwise uniform terminal
output — the `t=y` flag and the observe-only note. Used anywhere else it would
spend its meaning.

**Both themes are authored, not inverted.** The dark palette is a separate set
of token values, because code panels need different decisions in each: a tinted
panel that reads as "quiet" on paper reads as "disabled" on black. Measured in a
browser in both themes — the lowest text/background pair is 6.4:1 against a WCAG
AA requirement of 4.5.

**Code is the main visual content.** Real terminal output and real DNS records,
captured by running the CLI. Record values are highlighted so the eye lands on
the part that matters. Long lines scroll inside their block; the page itself
never scrolls sideways, verified at a 320px viewport.

**One diagram, built from HTML rather than SVG.** Sender DNS on the left,
receiver verification on the right. HTML because it reflows to a single column
on a phone, stays selectable and searchable, and needs no accessibility
retrofit — an SVG of boxes and text would have needed all three added back.

**The oath, handled quietly.** The name suggests an attestation, so the site
borrows the register of a document: hairline rules, small-caps labels, generous
margins. No seal, no scroll, no wax. A literal treatment would read as costume
to the people this page is for.

**What was deliberately left out.** No logo wall, no metrics, no testimonials,
no pricing, no gradient hero, no stock photography, no animation. None of these
was omitted for time; each would cost credibility with an audience that has
watched a lot of protocols promise a lot of things.

## On the framework, honestly

The site is ~11 KB of content. Delivered through Next.js it transfers about
**188 KB gzipped**, because the App Router ships a React runtime whether or not
a page uses it. Measured, not estimated.

Removing the only client component (the theme toggle) changes that by roughly
700 bytes — so the runtime is the framework baseline, not anything this site
does, and the toggle is effectively free. There is no supported way to opt out
of it in Next.

That cost buys the GitHub-Actions-on-merge pipeline and a foundation the
documentation site can share. It is a deliberate trade, recorded here so nobody
has to re-derive it. If page weight ever matters more than the pipeline, this
page has no dynamic behaviour beyond one button and would go back to a single
hand-written file without losing anything.

What the framework did **not** cost: the page is fully readable with JavaScript
disabled (all content is in the HTML at build time), and it still makes zero
external requests. Both are enforced in CI.

## The adopters section

Built and intentionally disabled. It is a JSX comment inside
`<section id="adoption">` in `app/page.tsx` — search for `ADOPTERS SECTION`.

To enable: delete the comment wrapper and add real names. Styles are
deliberately **not** written yet, so the layout gets designed around real
content rather than placeholders.

**Do not populate it with Postfix or rspamd marks.** We wrote those
integrations; putting their logos under a "who's using it" heading would imply
an endorsement neither project has given. The visible section already describes
them accurately.

## Accuracy

Every technical claim was checked against the tooling before it was written.

- Terminal output in the deploy section is real, captured from `sworn`
  keygen / genrecord / verify. The only edits are truncating one base64 key and
  eliding a `$TOKEN` value.
- Record formats match `cmd/genvectors` output.
- 62 conformance vectors = 48 token + 14 record, confirmed by running it.
- All repository links were checked and resolve; all five are public.

**One correction to the original brief.** It specified "5,048 differential test
cases". That is not a fixed property — `cmd/difftest` takes a `--fuzz` flag
defaulting to 3000, so the default run is 3,048 cases (48 structured + 3,000
fuzz), and 5,048 came from a larger run. Publishing a flag-dependent number as a
fact would have been wrong, and it is the kind of wrong this audience finds. The
site states the reproducible default, says the corpus size is a parameter, and
invites the reader to run it larger — a stronger claim than a bigger number.

## Deployment

Cloudflare Pages, published by `.github/workflows/deploy.yml` on merge to
`main`.

**Why Pages and not AWS.** The stack was originally specified as S3 +
CloudFront + Route 53, and the Terraform for it was written and validated
before a fact turned up that changed the arithmetic: **DNS for swornmail.com
and swornmail.dev is already on Cloudflare.** That made the AWS path
strictly more work for the same result — an ACM validation record to add by
hand, apex CNAME flattening, a grey-cloud caveat where proxying would silently
rewrite the security headers, thirteen Terraform resources, and Terraform state
to keep safe. Pages provisions the certificate and the apex record itself.
Nothing was ever created in AWS; the Terraform was deleted rather than left to
rot as a decoy.

The one thing genuinely lost is infrastructure-as-code for the hosting itself.
`_headers` covers the part that matters — the security policy is a reviewable
file in this repository, not console state.

**Why the build stays in GitHub Actions** rather than using Pages' native Git
integration: Pages would build and publish the site itself, and neither the
checks in `deploy.yml` nor those in `public-boundary.yml` would run in the
publish path. The guards would exist but gate nothing. Building here and
publishing with wrangler keeps them where they can actually stop a bad deploy.

### First-time setup

1. ~~Create a Pages project named `swornmail-com`~~ — **done**. Direct upload,
   production branch `main`. Live at
   [swornmail-com.pages.dev](https://swornmail-com.pages.dev/).
2. ~~Create a scoped API token~~ — **done** (Account → Cloudflare Pages → Edit).
3. ~~Set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`~~ — **done**.
   Verified end to end: a `workflow_dispatch` run built, checked and published,
   and the live deployment serves every header from `_headers`.

   If either is ever cleared: with neither set the publish job skips entirely;
   with the variable but no token it skips the publish step and emits a warning
   rather than failing.
4. **Not yet done, and deliberately:** adding `swornmail.com` and
   `www.swornmail.com` as custom domains. Pages would create the DNS records
   itself — the zone is in the same Cloudflare account — which *is* the cutover.
   Do this when the content is ready to be public.

`www` → apex is a redirect rule at the zone level; Pages `_redirects` cannot
match on hostname.

### Response headers

`public/_headers` ships to the root of the deployment. The build fails if it is
missing, because a site serving with no CSP is worse than a failed deploy.

**The CSP carries `script-src 'unsafe-inline'`**, which is a real weakening. A
static export inlines bootstrap scripts whose contents change per build, so
neither a nonce (no server) nor a fixed hash list works without extracting
hashes in CI. The page loads no third-party script and accepts no input, so
residual risk is low — but if this site ever grows a form or an embed, fix this
first.

## Facts still needed

- **IETF wording.** The site says the draft "is headed for the `mailmaint`
  working group". Once submitted, that should name the published draft and link
  the datatracker entry.
- **`swornmail.dev`.** A navigation slot is reserved and documentation links
  point at GitHub until it exists.

*(Contact address resolved: `val@sworn.email`, confirmed working. It is what the
site publishes.)*

## Not yet live

Nothing is deployed. No Cloudflare Pages project exists yet, and nothing was
ever created in AWS. The site states that SwornMail has no public deployments,
which is accurate and must stay accurate until it is not.
