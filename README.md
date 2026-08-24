# swornmail.com

The public marketing site for the SwornMail protocol. Advocacy, not commerce:
nothing is sold here, and nothing commercial belongs here. The reputation feed
is a separate, private service and appears on this site only as a stated
limitation.

Next.js static export, Tailwind, published to S3 behind CloudFront by GitHub
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

`infra/` provisions S3 + CloudFront + ACM + Route 53 and the OIDC role GitHub
Actions assumes. `.github/workflows/deploy.yml` builds, publishes and then
verifies the live site actually serves the new build.

> **`infra/` has never been applied.** It is written from the provider
> documentation and validated (`terraform fmt`, `terraform validate`) but never
> run against an account, because the AWS session was expired when it was
> written. Treat the first `terraform plan` as its real review.

First-time setup:

```sh
cd infra
cp terraform.tfvars.example terraform.tfvars   # fill in bucket + hosted zone
terraform init
terraform plan       # read this properly; nothing here has been applied
terraform apply
```

Then set the three outputs as **repository variables** (not secrets — none of
them is one):

| Variable | From |
|---|---|
| `AWS_DEPLOY_ROLE_ARN` | `terraform output deploy_role_arn` |
| `S3_BUCKET` | `terraform output bucket_name` |
| `CLOUDFRONT_DISTRIBUTION_ID` | `terraform output distribution_id` |

Notes on choices worth not re-litigating:

- The bucket is **private**, reached through Origin Access Control. A public
  bucket is also directly reachable, which bypasses every response header on
  the distribution — including the CSP.
- Auth is **OIDC**. There are no long-lived AWS keys in this repository, and
  the role trust policy is scoped to this repo and `refs/heads/main`.
- Fingerprinted assets upload first and are cached for a year; pages upload
  second with `--delete` and a 60-second cache. That order means HTML never
  arrives before the assets it references.
- **The CSP carries `script-src 'unsafe-inline'`**, which is a real weakening.
  A static export inlines bootstrap scripts whose contents change per build, so
  neither a nonce (no server) nor a fixed hash list works without extracting
  hashes in CI. The page loads no third-party script and accepts no input, so
  residual risk is low — but if this site ever grows a form or an embed, fix
  this first.

## Facts still needed

- **IETF wording.** The site says the draft "is headed for the `mailmaint`
  working group". Once submitted, that should name the published draft and link
  the datatracker entry.
- **`swornmail.dev`.** A navigation slot is reserved and documentation links
  point at GitHub until it exists.

*(Contact address resolved: `val@sworn.email`, confirmed working. It is what the
site publishes.)*

## Not yet live

Nothing is deployed and no AWS resources exist. The site states that SwornMail
has no public deployments, which is accurate and must stay accurate until it is
not.
