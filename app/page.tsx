import { ThemeToggle } from "./theme-toggle";

/* Shared class strings. Named because they encode a decision, not because
   they save characters: the measure cap in particular is a deliberate reading
   choice, not an accident of the grid. */
const WRAP = "mx-auto w-full max-w-[62rem] px-[1.1rem] sm:px-6";
const SECTION =
  "scroll-mt-14 border-t border-rule py-12 sm:py-[4.5rem]";
const LABEL =
  "mb-4 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted";
const H2 =
  "mb-1.5 text-2xl font-semibold leading-tight tracking-[-0.015em] sm:text-3xl";
const LEDE = "mb-8 max-w-[34rem] text-[1.0625rem] text-muted";
const PROSE = "max-w-[34rem]";
const H3 = "mt-8 mb-2 text-[1.0625rem] font-semibold leading-tight";
const CAPTION = "mb-8 max-w-[52ch] text-[0.8125rem] text-muted";
const NOTE = "my-6 border-l-2 border-firm pl-[1.1rem]";
const NOTE_FLAG = "my-6 border-l-2 border-flag pl-[1.1rem]";
const LINK = "text-accent underline decoration-1 underline-offset-2 hover:text-accent-deep";

function C({ children }: { children: React.ReactNode }) {
  return <code className="inline-code">{children}</code>;
}

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="absolute left-[-9999px] z-10 bg-accent px-4 py-[0.6rem] text-white focus:left-0 focus:top-0"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-[5] border-b border-rule bg-paper/90 backdrop-blur">
        <div className={`${WRAP} flex min-h-14 flex-wrap items-center gap-5`}>
          <a
            href="/"
            className="mr-auto text-[1.0625rem] font-semibold tracking-[-0.02em] text-ink"
          >
            SwornMail
          </a>
          <nav aria-label="Primary" className="flex flex-wrap items-center gap-5">
            <a href="#problem" className="text-sm text-muted hover:text-accent hover:underline">
              The&nbsp;/64 problem
            </a>
            <a href="#how" className="hidden text-sm text-muted hover:text-accent hover:underline md:inline">
              How it works
            </a>
            <a href="#deploy" className="text-sm text-muted hover:text-accent hover:underline">
              Deploy
            </a>
            <a href="#status" className="hidden text-sm text-muted hover:text-accent hover:underline md:inline">
              Status
            </a>
            {/* Navigation slot reserved for swornmail.dev (documentation).
                Until that site exists, documentation links point at the
                repositories. */}
            <a href="https://github.com/swornmail" className="text-sm text-muted hover:text-accent hover:underline">
              GitHub
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main id="main">
        {/* ============ hero ============ */}
        <div className={WRAP}>
          <div className="py-13 sm:py-[4.5rem] lg:pt-22">
            <h1 className="mb-6 max-w-[20ch] text-balance text-[2rem] font-semibold leading-[1.15] tracking-[-0.015em] sm:text-5xl lg:text-[3.4rem]">
              IP reputation is arithmetically dead on IPv6.{" "}
              <span className="font-medium text-muted">
                Let the sender declare the unit.
              </span>
            </h1>
            <p className="mb-8 max-w-[44ch] text-[1.0625rem] text-muted sm:text-xl">
              SwornMail lets a sending operator publish a signed, verifiable
              claim: <em>this IPv6 prefix is one accountable entity, and we
              stake our domain name on it.</em>
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <a
                href="#deploy"
                className="rounded bg-accent px-[1.1rem] py-[0.55rem] text-[0.9375rem] font-medium text-btn-ink hover:bg-accent-deep"
              >
                Deploy in 5 minutes
              </a>
              <a href="https://github.com/swornmail/spec" className={`text-[0.9375rem] ${LINK}`}>
                Read the Internet-Draft&nbsp;→
              </a>
            </div>
          </div>
        </div>

        {/* ============ the /64 problem ============ */}
        <section id="problem" className={SECTION}>
          <div className={WRAP}>
            <p className={LABEL}>The problem</p>
            <h2 className={H2}>One allocation. Eighteen quintillion addresses.</h2>
            <p className={LEDE}>
              A single IPv6 /64 — the ordinary subnet boundary, the one every
              SLAAC network uses — contains 18,446,744,073,709,551,616
              addresses.
            </p>

            <figure className="my-10 max-w-[44rem]">
              <div
                className="scale-bar"
                role="img"
                aria-label="A bar representing one IPv6 /64. The entire IPv4 address space, drawn at the same scale, is a hairline at the far left, roughly four million times narrower than a single pixel."
              />
              <div className="mt-2 flex justify-between gap-4 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted">
                <span>← the entire IPv4 internet</span>
                <span>one /64 →</span>
              </div>
              <figcaption className="mt-4 max-w-[52ch] text-sm text-muted">
                Drawn to scale, the whole IPv4 address space would be about one
                four-millionth of a pixel wide. The hairline on the left is
                roughly four million times too generous.
              </figcaption>
            </figure>

            {/* Two columns, not auto-fit: four items in an auto-fit grid
                resolve as 3+1 at this width and leave an orphan. */}
            <div className="grid max-w-[52rem] gap-x-10 gap-y-6 sm:grid-cols-2">
              <div>
                <h3 className={H3}>Blocklists cannot converge</h3>
                <p>
                  A sender rotating source addresses never repeats one.
                  Per-address listings never catch up, and per-address lookups
                  approach a 100% cache-miss rate — degrading the blocklist
                  infrastructure itself.
                </p>
              </div>
              <div>
                <h3 className={H3}>Aggregating is a guess</h3>
                <p>
                  Aggregate at /64 and you punish shared infrastructure.
                  Aggregate wider and you punish an entire provider for one
                  tenant. There is no correct answer, because the boundary you
                  actually want is invisible.
                </p>
              </div>
              <div>
                <h3 className={H3}>So IPv6 mail gets treated as suspect</h3>
                <p>
                  Receivers respond to an unanswerable question with blanket
                  caution. Email has become the last major workload that
                  penalises operators for adopting IPv6 — at a point where IPv6
                  carries more than half of global internet traffic.
                </p>
              </div>
              <div>
                <h3 className={H3}>The missing fact</h3>
                <p>
                  Which addresses constitute <em>one accountable entity</em> is
                  an administrative fact. The operator knows it. The receiver
                  cannot see it. Nothing in the mail stack carries it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ how it works ============ */}
        <section id="how" className={SECTION}>
          <div className={WRAP}>
            <p className={LABEL}>How it works</p>
            <h2 className={H2}>
              The operator states the boundary, and signs their name to it.
            </h2>
            <p className={LEDE}>
              Two DNS TXT records. Receivers verify at connection time, before
              message data, and key reputation on{" "}
              <C>(operator domain, prefix)</C> instead of on individual
              addresses.
            </p>

            {/* The one diagram, built from HTML rather than SVG so it reflows
                to a single column on a phone, stays selectable and searchable,
                and needs no accessibility retrofit. */}
            <div className="my-8 grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-5">
              <div className="rounded-md border border-firm bg-sunk p-[1.1rem]">
                <h3 className="mb-0.5 text-[0.9375rem] font-semibold">
                  Sending operator
                </h3>
                <p className="mb-3 break-all font-mono text-xs text-muted">
                  mailer.example.com
                </p>
                <p className="record mb-2">
                  {`_prefixes._sworn.mailer.example.com. IN TXT\n"v=SWORN1; p=2001:db8:f00::/48; u=64"`}
                </p>
                <p className="record mb-2">
                  {`2026a._sworn.mailer.example.com. IN TXT\n"v=SWORN1; k=ed25519; pk=…"`}
                </p>
                <ul className="list-disc pl-[1.1rem] text-sm [&>li]:mb-1.5 [&>li:last-child]:mb-0">
                  <li>Declares the prefix it stands behind</li>
                  <li>
                    Declares the unit receivers should aggregate at (<C>u=64</C>)
                  </li>
                  <li>Stakes the domain&rsquo;s own reputation on both</li>
                </ul>
              </div>

              <div
                aria-hidden="true"
                className="flex flex-col items-center justify-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-muted"
              >
                <span className="rotate-90 text-lg tracking-normal text-firm md:rotate-0">
                  →
                </span>
                <span>DNS</span>
              </div>

              <div className="rounded-md border border-firm bg-sunk p-[1.1rem]">
                <h3 className="mb-0.5 text-[0.9375rem] font-semibold">
                  Receiving MTA
                </h3>
                <p className="mb-3 break-all font-mono text-xs text-muted">
                  connection from 2001:db8:f00:1234::25
                </p>
                <ol className="list-decimal pl-[1.1rem] text-sm [&>li]:mb-1.5 [&>li:last-child]:mb-0">
                  <li>Discover the operator accountable for the source address</li>
                  <li>Fetch and verify their published policy</li>
                  <li>Confirm the address really falls inside the attested prefix</li>
                  <li>
                    Key reputation on <C>2001:db8:f00:1234::/64</C>
                  </li>
                </ol>
              </div>
            </div>
            <p className={CAPTION}>
              Verification is stateless and O(1) per connection, with no
              verifier-initiated fetch to attacker-named endpoints beyond DNS.
            </p>

            <h3 className={H3}>Two modes</h3>
            <div className="grid max-w-[52rem] gap-x-10 gap-y-6 sm:grid-cols-2">
              <p>
                <strong>DNS-only.</strong> Publish the records; nothing in your
                mail software changes. Receivers discover the operator from the
                connecting address. This is deployable today and is the baseline
                the protocol is designed around.
              </p>
              <p>
                <strong>Signed token.</strong> An SMTP extension carries a
                compact signed token verified statelessly at connection time,
                for stronger source authenticity. Optional, and it requires
                software that speaks the extension.
              </p>
            </div>

            <div className={NOTE}>
              <p className={PROSE}>
                <strong>Attestation is accountability, not endorsement.</strong>{" "}
                Publishing a record does not ask anyone to trust you. It says
                who to hold responsible. Receivers and reputation services
                decide what that is worth — and SwornMail is fail-open by
                design: its absence or failure must never make treatment worse
                than a receiver&rsquo;s existing default for unattested IPv6.
              </p>
            </div>
          </div>
        </section>

        {/* ============ deploy ============ */}
        <section id="deploy" className={SECTION}>
          <div className={WRAP}>
            <p className={LABEL}>Deploy</p>
            <h2 className={H2}>Three commands and two DNS records.</h2>
            <p className={LEDE}>
              Real output from the <C>sworn</C> CLI, abbreviated only where
              marked. Addresses are from the documentation range{" "}
              <C>2001:db8::/32</C>.
            </p>

            <h3 className={H3}>1. Generate a signing key</h3>
            <pre className="code-block mb-4">
              <code>
                <span className="tok-c">$</span> sworn keygen --selector 2026a
                {"\n\n"}
                selector    2026a{"\n"}
                private key 2026a.key{" "}
                <span className="tok-c">
                  (mode 0600 — keep it secret, back it up)
                </span>
                {"\n"}
                public key  gJvTSUnyzNPsehUuIhWlLwPOcCRvbiM+fbCLseUpAf0=
              </code>
            </pre>

            <h3 className={H3}>2. Generate the records</h3>
            <pre className="code-block mb-4">
              <code>
                <span className="tok-c">$</span> sworn genrecord --domain
                mailer.example.com --selector 2026a \{"\n"}
                {"      "}--key 2026a.key --prefix 2001:db8:f00::/48 --unit 64
                {"\n\n"}
                Publish these records for mailer.example.com.{"\n\n"}
                1. key record — the signing key receivers fetch{"\n"}
                {"   "}zone file:{"\n"}
                {"     "}2026a._sworn.mailer.example.com. 3600 IN TXT{" "}
                <span className="tok-k">
                  &quot;v=SWORN1; k=ed25519;
                  pk=gJvTSUnyzNPsehUuIhWlLwPOcCRvbiM+fbCLseUpAf0=&quot;
                </span>
                {"\n\n"}
                2. policy record — the prefixes you stand behind{"\n"}
                {"   "}zone file:{"\n"}
                {"     "}_prefixes._sworn.mailer.example.com. 3600 IN TXT{" "}
                <span className="tok-k">
                  &quot;v=SWORN1; p=2001:db8:f00::/48; u=64;{" "}
                  <span className="tok-f">t=y</span>&quot;
                </span>
                {"\n\n"}
                3. reverse-tree pointer (optional) — publish in your reverse
                zone if you{"\n"}
                {"   "}control it; otherwise discovery uses your MTA&apos;s
                forward-confirmed PTR{"\n"}
                {"     "}_sworn.0.0.f.0.8.b.d.0.1.0.0.2.ip6.arpa. 3600 IN TXT
                &quot;v=SWORN1; d=mailer.example.com&quot;{"\n\n"}
                notes:{"\n"}
                {"  "}-{" "}
                <span className="tok-f">t=y is set, so this is observe-only</span>
                : receivers report sworn=none policy.testing=y{"\n"}
                {"    "}and stake no reputation on you, for credit or blame.
                Watch your traffic, then{"\n"}
                {"    "}re-run with --testing=false to accept accountability.
              </code>
            </pre>
            <p className={CAPTION}>
              The command also prints a DNS-panel form of each record, for
              providers without zone-file editing, and <C>--json</C> for a
              provider API.
            </p>

            <h3 className={H3}>3. Publish them, then check from anywhere</h3>
            <pre className="code-block mb-4">
              <code>
                <span className="tok-c">$</span> sworn record
                mailer.example.com --selector 2026a{"\n"}
                <span className="tok-c">$</span> sworn discover --ip
                2001:db8:f00:1234::25
              </code>
            </pre>

            <h3 className={H3}>
              What it looks like when it works — and when it does not
            </h3>
            <pre className="code-block mb-4">
              <code>
                <span className="tok-c">$</span> sworn verify $TOKEN --ip
                2001:db8:f00:1234::25 --key gJvTSUn…Af0={"\n"}
                <span className="tok-k">
                  sworn=pass op=mailer.example.com unit=2001:db8:f00:1234::/64
                </span>
                {"\n"}
                <span className="tok-c">$?</span> 0{"\n\n"}
                <span className="tok-c">
                  # the same token, presented from outside the attested prefix
                </span>
                {"\n"}
                <span className="tok-c">$</span> sworn verify $TOKEN --ip
                2001:db8:999::25 --key gJvTSUn…Af0={"\n"}
                <span className="tok-k">sworn=fail reason=off_prefix</span>
                {"\n"}
                <span className="tok-c">$?</span> 1
              </code>
            </pre>
            <p className={CAPTION}>
              A stolen key alone buys nothing: the attestation is bound to the
              address space it was issued for, so it cannot be replayed from
              anywhere else.
            </p>

            <h3 className={H3}>Integrations</h3>
            <p className={PROSE}>
              A{" "}
              <a href="https://github.com/swornmail/swornmail-go" className={LINK}>
                Postfix milter
              </a>{" "}
              and an{" "}
              <a href="https://github.com/swornmail/rspamd-swornmail" className={LINK}>
                rspamd module
              </a>{" "}
              are available for the receiving side. We wrote both; neither
              implies any involvement by, or endorsement from, the Postfix or
              rspamd projects.
            </p>
          </div>
        </section>

        {/* ============ testing mode ============ */}
        <section id="testing" className={SECTION}>
          <div className={WRAP}>
            <p className={LABEL}>Before you commit to anything</p>
            <h2 className={H2}>
              Publish <C>t=y</C> and stake nothing.
            </h2>
            <p className={LEDE}>
              Testing mode is not a flag you have to find. It is what the
              tooling publishes unless you explicitly turn it off.
            </p>
            <div className="grid max-w-[52rem] gap-x-10 gap-y-6 sm:grid-cols-2">
              <p>
                An operator in testing mode is reported as{" "}
                <C>sworn=none policy.testing=y</C>. Conforming receivers stake
                no reputation on them in either direction — not credit, not
                blame. You can watch how your traffic would be classified
                without having accepted accountability for anything.
              </p>
              <p>
                When you are satisfied, re-run <C>genrecord</C> with{" "}
                <C>--testing=false</C> and publish the updated record. That
                single change is the moment the oath is actually taken, and it
                is entirely yours to make.
              </p>
            </div>
            <div className={NOTE}>
              <p className={PROSE}>
                This is enforced, not advisory. A testing-mode operator being
                reported as passing is treated as a conformance bug in this
                project — the observe-only on-ramp is worthless if
                implementations score you anyway.
              </p>
            </div>
          </div>
        </section>

        {/* ============ vs SPF/DKIM/DMARC ============ */}
        <section id="compare" className={SECTION}>
          <div className={WRAP}>
            <p className={LABEL}>Relationship to what you already run</p>
            <h2 className={H2}>It attests the connection, not the message.</h2>
            <p className={LEDE}>
              SwornMail replaces nothing. SPF, DKIM and DMARC answer questions
              about a message and the domain it claims. SwornMail answers a
              question none of them ask.
            </p>

            <div className="my-6 overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-[0.9375rem]">
                <thead>
                  <tr>
                    <th scope="col" className="border-b border-rule px-[0.9rem] py-[0.7rem] text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                      Mechanism
                    </th>
                    <th scope="col" className="border-b border-rule px-[0.9rem] py-[0.7rem] text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                      What it authenticates
                    </th>
                    <th scope="col" className="border-b border-rule px-[0.9rem] py-[0.7rem] text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                      The question it answers
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_td]:border-b [&_td]:border-rule [&_td]:px-[0.9rem] [&_td]:py-[0.7rem] [&_td]:align-top [&_th]:border-b [&_th]:border-rule [&_th]:whitespace-nowrap [&_th]:px-[0.9rem] [&_th]:py-[0.7rem] [&_th]:text-left [&_th]:align-top [&_th]:font-semibold">
                  <tr>
                    <th scope="row">SPF</th>
                    <td>The sending host, against a domain&rsquo;s published list</td>
                    <td>
                      “Is this host <em>authorised</em> to send for the domain
                      this message claims?”
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">DKIM</th>
                    <td>The message content, cryptographically</td>
                    <td>
                      “Was this message signed by the domain it claims, and
                      unmodified since?”
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">DMARC</th>
                    <td>Alignment and policy</td>
                    <td>
                      “Do those results line up with the visible <C>From:</C>,
                      and what should I do if not?”
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">SwornMail</th>
                    <td>The connection&rsquo;s address space</td>
                    <td>
                      “Which addresses are <em>one accountable entity</em>, so I
                      have something stable to keep reputation on?”
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={NOTE_FLAG}>
              <p className={PROSE}>
                <strong>“Doesn&rsquo;t SPF already list IPv6 ranges?”</strong> It
                does — and that is a fair objection to raise first. The
                difference is what the range is <em>for</em>. An SPF range
                authorises hosts for a domain a message claims, and is only
                meaningful once you have a claimed identity to check it against.
                SwornMail&rsquo;s prefix is an assertion about the address space
                itself: it gives you a stable reputation key at connection time,
                including for a sender whose domain you have never seen before,
                and it names who has volunteered to be held responsible for it.
              </p>
            </div>
          </div>
        </section>

        {/* ============ adoption ============ */}
        <section id="adoption" className={SECTION}>
          <div className={WRAP}>
            <p className={LABEL}>Adoption</p>
            <h2 className={H2}>No public deployments yet.</h2>
            <p className={LEDE}>
              SwornMail is new. We are not going to pretend otherwise on the
              page where you are deciding whether to believe us.
            </p>

            <div className="grid max-w-[52rem] gap-x-10 gap-y-6 sm:grid-cols-2">
              <div>
                <h3 className={H3}>What does exist</h3>
                <ul className="list-disc pl-[1.1rem] [&>li]:mb-1.5">
                  <li>
                    A frozen <C>-01</C> wire format with 62 published
                    conformance vectors
                  </li>
                  <li>
                    Two independent implementations — Go and Rust — cross-checked
                    by a differential harness
                  </li>
                  <li>
                    A sender CLI, a Postfix milter, and an rspamd module, all
                    written by us
                  </li>
                  <li>Apache-2.0, with a patent pledge</li>
                </ul>
              </div>
              <div>
                <h3 className={H3}>What we want</h3>
                <p>
                  Operator feedback, more than adoption. If you run mail on IPv6
                  and this is wrong, impractical, or solves a problem you do not
                  have, that is the most useful thing you could tell us right
                  now.
                </p>
                <p className="mt-3">
                  <a href="mailto:val@sworn.email" className={LINK}>
                    val@sworn.email
                  </a>
                </p>
              </div>
            </div>

            {/*
              ADOPTERS SECTION — intentionally disabled until there is a real one.

              To enable: delete this comment wrapper and add real names. Styles
              are deliberately not written yet, so the layout gets designed
              around actual content rather than placeholders.

              Do NOT populate this with Postfix or rspamd marks: we wrote those
              integrations, and presenting them here would imply an endorsement
              neither project has given.

              <h3 className={H3}>Operators running SwornMail</h3>
              <ul>
                <li>Operator name — prefix count, since YYYY-MM</li>
              </ul>
              <blockquote>
                <p>Quote from a named engineer at a real deploying operator.</p>
                <footer>— Name, Role, Operator</footer>
              </blockquote>
            */}
          </div>
        </section>

        {/* ============ status & limitations ============ */}
        <section id="status" className={SECTION}>
          <div className={WRAP}>
            <p className={LABEL}>Status and limitations</p>
            <h2 className={H2}>What is settled, and what is not.</h2>

            <div className="grid max-w-[52rem] gap-x-10 gap-y-6 sm:grid-cols-2">
              <div>
                <h3 className={H3}>Settled</h3>
                <ul className="list-disc pl-[1.1rem] [&>li]:mb-1.5">
                  <li>
                    The <C>-01</C> wire format is frozen: token bytes, record
                    syntax, and the conformance vectors are a public contract.
                  </li>
                  <li>
                    62 conformance vectors (48 token, 14 record), published in
                    the spec repository.
                  </li>
                  <li>
                    Two implementations agree. A differential harness generates
                    an adversarial corpus and runs both verifiers over it —
                    3,048 cases at the default setting, zero accept/reject or
                    result divergences. A second harness cross-checks record
                    parsing between the Go and Lua implementations across 217
                    cases, also with zero divergences.
                  </li>
                  <li>
                    Apache-2.0. A provisional patent exists specifically to keep
                    the mechanism open, with a published pledge never to assert
                    it against implementations.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className={H3}>Not settled</h3>
                <ul className="list-disc pl-[1.1rem] [&>li]:mb-1.5">
                  <li>
                    <strong>This is not an IETF standard.</strong> It is an
                    Internet-Draft, and one that has not yet been submitted.
                    Nothing here is an RFC and nothing here has IETF consensus.
                  </li>
                  <li>
                    No public deployments. Nobody is running this in production,
                    including us.
                  </li>
                  <li>
                    The SMTP extension mode needs software that speaks the
                    extension; a milter cannot advertise it, because milters run
                    after the command phase.
                  </li>
                  <li>
                    Post-quantum signatures are designed for but not yet
                    registered.
                  </li>
                </ul>
              </div>
            </div>

            <div className={NOTE_FLAG}>
              <p className={PROSE}>
                The differential figure above is reproducible rather than a
                marketing number. The corpus size is a parameter of the harness;
                run it yourself with a larger fuzz count and the divergence
                count should stay at zero. If it does not, that is a bug worth
                reporting.
              </p>
            </div>
          </div>
        </section>

        {/* ============ get involved ============ */}
        <section id="involved" className={SECTION}>
          <div className={WRAP}>
            <p className={LABEL}>Get involved</p>
            <h2 className={H2}>The useful thing you can do is disagree with us.</h2>
            <p className={LEDE}>
              Especially if you run mail at scale on IPv6, and especially if you
              think this is wrong.
            </p>
            <div className="grid gap-x-10 gap-y-6 sm:grid-cols-3">
              <div>
                <h3 className={H3}>Read it</h3>
                <ul className="list-disc pl-[1.1rem] [&>li]:mb-1.5">
                  <li>
                    <a href="https://github.com/swornmail/spec" className={LINK}>
                      Internet-Draft and threat model
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/swornmail/spec/tree/main/test-vectors" className={LINK}>
                      Conformance vectors
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className={H3}>Run it</h3>
                <ul className="list-disc pl-[1.1rem] [&>li]:mb-1.5">
                  <li>
                    <a href="https://github.com/swornmail/swornmail-go" className={LINK}>
                      Go reference, CLI, Postfix milter
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/swornmail/swornmail" className={LINK}>
                      Independent Rust verifier
                    </a>{" "}
                    (
                    <a href="https://crates.io/crates/swornmail" className={LINK}>
                      crates.io
                    </a>
                    )
                  </li>
                  <li>
                    <a href="https://github.com/swornmail/rspamd-swornmail" className={LINK}>
                      rspamd module
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className={H3}>Argue with it</h3>
                <ul className="list-disc pl-[1.1rem] [&>li]:mb-1.5">
                  <li>
                    <a href="mailto:val@sworn.email" className={LINK}>
                      val@sworn.email
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/swornmail/spec/issues" className={LINK}>
                      Open an issue on the spec
                    </a>
                  </li>
                  <li>
                    IETF: the draft is headed for the <C>mailmaint</C> working
                    group
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-rule py-12 text-sm text-muted">
        <div className={WRAP}>
          <div className="grid gap-x-12 gap-y-8 sm:grid-cols-3">
            <div>
              <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                Protocol
              </h3>
              <ul className="[&>li]:mb-1.5">
                <li><a href="https://github.com/swornmail/spec" className={LINK}>Specification</a></li>
                <li><a href="https://github.com/swornmail/spec/blob/main/threat-model.md" className={LINK}>Threat model</a></li>
                <li><a href="#status" className={LINK}>Status and limitations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                Implementations
              </h3>
              <ul className="[&>li]:mb-1.5">
                <li><a href="https://github.com/swornmail/swornmail-go" className={LINK}>Go</a></li>
                <li><a href="https://github.com/swornmail/swornmail" className={LINK}>Rust</a></li>
                <li><a href="https://github.com/swornmail/rspamd-swornmail" className={LINK}>rspamd</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                Contact
              </h3>
              <ul className="[&>li]:mb-1.5">
                <li><a href="mailto:val@sworn.email" className={LINK}>val@sworn.email</a></li>
                <li><a href="https://github.com/swornmail" className={LINK}>github.com/swornmail</a></li>
              </ul>
            </div>
          </div>
          <p className="mt-10 max-w-[60ch] text-[0.8125rem]">
            SwornMail is an open protocol, licensed Apache-2.0. Maintained by{" "}
            <a href="https://platops.com" className={LINK}>PlatOps Security, LLC</a>. A
            provisional patent covering the mechanism is held personally and is
            pledged royalty-free: it exists to keep the mechanism open and will
            not be asserted against implementations.
          </p>
          <p className="mt-4 max-w-[60ch] text-[0.8125rem]">
            This site sets no cookies, runs no analytics, and makes no external
            requests.
          </p>
        </div>
      </footer>
    </>
  );
}
