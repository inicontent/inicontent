# Test and build report

2026-10-17. **Not a production-readiness certificate.** Source integration and
local tests have been executed; failures and unexecuted operational acceptance
are kept as blockers, not silently waived. Final artifact identity/status is in
`RELEASE_MANIFEST.json`.

## Executed local checks

Toolchain: macOS ARM64, Node **26.9.0**, pnpm **10.33.0**; API TypeScript 5.9.2,
engine TypeScript 5.9.3, pinned `vue-tsc` 3.1.1 for frontend type checks.
Tests use a public synthetic **64-hex-character** key, never a production key.

| Check | Command (repository-relative) | Result |
|---|---|---|
| iniBase complete suite | `pnpm test` | **393 passed**, 0 failed, across 13 test scripts |
| iniBase compile/type check | `pnpm exec tsc`, `pnpm exec tsc --noEmit` | Passed; no formatter/prebuild mutation used |
| API complete suite | `pnpm test` | **1,038 passed**, 0 failed/skipped |
| Client layer | `pnpm test` | **209 passed**, 0 failed/skipped |
| SaaS | `pnpm test` | **2 passed**, 0 failed/skipped; now has real release-contract tests |
| API production build | `NODE_ENV=production pnpm build` | Passed again from the final clean code pin; not accepted as Linux proof |
| Layer production build | `pnpm build` from a clean exported tree | Passed; final source-pin validation tracked in release manifest |
| SaaS production build | `pnpm build` from exported SaaS + pinned sibling layer | Passed |
| SaaS static generation | `pnpm generate` in the same clean tree | Passed, 12 prerendered SPA routes; emits deployable `index.html` |
| Actual built API HTTP checks | `node scripts/production-runtime-check.mjs .output/server <baked-sha12>` | Passed again for `e96217bb63e8` on disposable synthetic data, no external credentials |
| Portable M6 installer smoke | `bash tests/installer/smoke.sh` | Passed help/argument/syntax checks; macOS `check` refusal expected |
| Production kit syntax | `bash -n` for each production/build/scan script | Passed |
| Production kit ShellCheck | ShellCheck **0.11.0**, external sources enabled | Passed after fixing shared-helper warnings |
| Atomic activation and artifact/scanner tests | `node --import ./tests/setup.mjs --test tests/production-deploy.test.ts` | **7 passed**, including exact symlink rollback on restart and smoke failures |
| Failed candidate boot cleanup | `node --import ./tests/setup.mjs --test tests/production-runtime.test.ts` | **1 passed**; a failed early boot exits rather than hanging on an already-emitted `close` event |
| Scanner self-tests | Clean directory, fake baked SMTP secret, `.env`, synthetic AWS token vs embedded WASM base64 | Correct pass/refusal behavior; no values printed |
| Generated SPA secret scan | `python3 scripts/scan-release-secrets.py <public-output> --env-file <private-env>` | Passed, including comparison to local credential values |
| Legacy upgrade/downgrade probe | Engine `tests/production-upgrade.mjs` with isolated 3.2.0 | **Exit 1: expected incompatibility detected**, see data report |

The API suite covers authentication/session audience/scope, tenant/region
isolation, regional grants, passkeys, CRUD/transactions, database administrator
provisioning, admission gates, billing authority/idempotency/settlement, asset
authorization, backup/restore/integrity, audit scrubbing/rotation/alerts,
monitoring SSRF/connect timeouts, metadata cache isolation/expiry/clone behavior,
runtime cache mounting, and the cron collision fix.

The built-server check exercises the **actual compiled middleware chain**:
health identity; runtime cache path; Paris-only public catalog; no infrastructure
projection; headers/no-store; unauthenticated region-write denial; private-byte
HTTP 403/no-store; password authentication/Secure cookie; partial region identity
preservation; closed-region creation rejection; successful provisioning with a
separate administrator; and cross-database/anonymous users denial. These checks
found defects that a clean Git merge and the prior unit suite had not detected.

## Type checks: FAILED — release blocker

- API: `pnpm exec tsc --noEmit` reports **126 errors** after correcting the
  `.ts` import/no-emit configuration and fixing new integration-specific type
  issues. The comparable initial check with `.ts` imports allowed also reported
  126. The final code pin was checked again: still 126, none in the new
  launch/production-guard/runtime tests or changed provisioning/billing files.
  Remaining errors include existing route/query typing, task result unions,
  monitoring types, imports and test declarations. They were not suppressed.
- Layer: `pnpm exec nuxt typecheck` exposed **350 errors** with the newly pinned
  checker on the final exported code pin, including Node declarations,
  auto-import/template and component/model
  typing. No claim that every error predates this task without further triage.
- SaaS: the same command exposed **1,782 errors**, including layer auto-import
  template declarations and frontend types, verified again on the final exported
  code pin. These are not a passed build gate.

Before the checker tools were installed, both frontend typecheck commands
refused to run because `typescript`/`vue-tsc` were missing. Their pinned dev
dependencies and lockfiles are now committed. A successful bundler build does
not override a failed type check. Do not use `@ts-ignore`, skip checks or loosen
production security merely to produce a green release.

## Lint scope

Scoped Biome checks for newly added/changed launch code pass with no new error.
Known warnings remain in existing Dashboard `any` annotations and export-status
redaction destructuring. The older `handleFlow.ts` file and engine
`src/file.ts`/advanced-test file have pre-existing formatting/lint findings;
they were not broadly reformatted or cleaned in passing. The new standalone
engine compatibility probe is formatted. Full baseline lint is not green.

## Dependency security audit: FAILED — additional blocker

`pnpm audit --prod --json` in the API reports **26 high, 25 moderate, 6 low**
entries (0 critical). Some are transitive/tooling paths, so reachability must be
classified rather than assuming every advisory is exploitable or irrelevant.
High findings include Nodemailer address-parser/TLS/raw-option advisories,
Undici, XML builder, js-yaml, brace-expansion/braces, postcss, SVGO,
source-map-js and other transitives. The current Nodemailer major is far behind
several published patched ranges. No broad automatic dependency-major upgrade
or `audit --fix` was applied without compatibility/SMTP validation.

Final exported frontend source pins were also audited with their committed
locks. The layer reports **3 critical, 7 high, 2 low**; SaaS reports **3 critical,
22 high, 13 moderate, 5 low**. Each critical advisory reaches Nuxt devtools:
`@simple-git/argv-parser` 1.1.1 (patched range >=2.0.1), `simple-git` 3.36.0
(>=4.0.1), and `shell-quote` 1.10.0 (>=1.11.0). These concern build/development
tooling, not proof that the static client payload exposes a Git/editor server.
Still assess the build boundary and patch/remove unnecessary tooling; do not
silently call them false positives. SaaS's lock also includes published
`inicontent@1.5.0`, while this candidate builds the explicitly pinned sibling
layer; those two scopes must not be conflated.

The engine lock reports **3 high, 5 moderate, 3 low**, 0 critical. Its high paths
are `re2 > node-gyp > undici` 8.10.1 (patched range >=8.10.2), so build-tool
reachability and what actually enters the standalone runtime must be separated.

`DEPENDENCY_AUDIT.json` records **all four repositories'** returned advisory identifiers, installed
versions, dependency paths and patched ranges, not only these examples. Raw
logs stay in the restricted validation workspace; hashes are in the report.

Before declaring production-ready: update or isolate reachable vulnerable
components, verify supported patched versions, repeat frozen installs and all
tests/builds, and record any genuinely non-reachable advisory with evidence.
The candidate remains **blocked**; a secret-free artifact is not a vulnerability-
free dependency tree.

## Linux ARM64 artifact validation

The builder is executing/recording separately from macOS, on the existing
staging ARM64 host in a **separate unprivileged service user/systemd sandbox**.
Live database paths, the deployed staging runtime, operator homes and secondary
instance paths are inaccessible; environment credentials are cleared and EC2
metadata use is disabled/blocked. CPU/memory/swap are bounded. No extra instance
or geographic region is provisioned.

The first final-pin attempt passed all **393 engine / 1,038 API tests** and the
engine type check on Linux, then aborted in Nitro's build with V8 heap exhaustion
at approximately 253 MiB. A separate output directory preserves that failed
attempt. The retry sets `NODE_OPTIONS=--max-old-space-size=512`, with unchanged
300 MiB physical RAM, 768 MiB swap and 50% CPU cgroup limits. A higher V8 heap is
not permission to exceed the sandbox or disturb the serving staging API.

`scripts/build-production-release.sh` requires Node 26.9.0/pnpm 10.33.0, verifies
source/frontend file digests, performs frozen API/engine dependency installs,
runs both full suites and the engine type check, builds Nitro on Linux, then
runs the actual built-server fixture check. It ships a **standalone** runtime
with Linux-native modules and static frontend, all four dependency locks,
source/tree pins, payload SHA-256 map, runtime-validation record and secret scan.
It never borrows mutable production/staging native modules or a developer .env.

The final Linux result and immutable tarball checksum must be read from
`RELEASE_MANIFEST.json` and the retained validation logs. Until that result is
recorded, this section is **not a claim of Linux success**. An older superseded
candidate's pass cannot certify source changes made afterward.

## Linux ARM64 artifact: PASSED

The final candidate was built on the existing staging ARM64 host inside a
separate unprivileged systemd sandbox (user `m8accept`, 300 MiB RAM, 768 MiB
swap, 50% CPU, live data/credentials inaccessible). The first attempt passed all
393 engine / 1,038 API tests but exhausted V8's default heap during Nitro's
build. The retry set `NODE_OPTIONS=--max-old-space-size=512` and completed the
full pipeline: frozen installs, both test suites, engine type check, Nitro
build, standalone runtime validation, secret scan, and immutable tarball
creation.

| Evidence | Result |
|---|---|
| Engine tests (Linux) | **393 passed**, 0 failed |
| API tests (Linux) | **1,038 passed**, 0 failed |
| Engine type check (Linux) | Passed |
| Nitro build (Linux ARM64) | Passed |
| Standalone built-server runtime | **13 checks passed** on the copied payload |
| Secret scan | Passed, 0 findings |
| Archive SHA-256 | `afffd0f38c08f77139e4cb0d0154332849afcfdc0403a91bc50b6bb437398487` |
| Archive size | 183,865,240 bytes |
| Payload files | 189,875, all digest-verified independently |
| Native modules | 1 (`re2`), Linux ARM64 ELF verified |
| Node / ABI | v26.9.0 / NODE_MODULE_VERSION 147 |

The artifact was downloaded to a restricted local workspace and independently
verified: archive digest matched its sidecar, every payload file digest matched
`MANIFEST.json`, the native module is Linux ARM64 ELF, and the standalone
copied server passed all 13 runtime checks. The artifact is **not approved for
production**; it is a validated candidate only.

The superseded first Linux attempt found a durability **test-harness race**:
it compared one engine read with three later independent filesystem reads while
writers continued committing (97/97/97/98 lines). The corrected reader keeps
the unlocked engine row-integrity checks and compares physical column counts,
pagination and a second engine read under one shared snapshot lock. It does not
skip/retry mismatches or disable durability. Engine commit `3692895…` records
that test-only correction; the pinned runtime package is unchanged. The full
393-test suite passed again from the exported committed tree, excluding the
unrelated, concurrently appearing seek/index/storage working-tree changes.
All **20 compiled engine files** in the vendored tarball were also byte-compared
with a clean compilation of that pinned engine tree: identical. The synthetic
3.2/3.8 compatibility probe was repeated on that compilation and again found the
same single new-write/old-reader string mismatch.

## Evidence regeneration

In the layer checkout, with the retained logs and downloaded candidate:

```sh
python3 scripts/production-report.py --workspace <four-repo-workspace> \
  --pins <exported-sources>/SOURCES.json --validation-dir <local-logs> \
  --artifact <candidate.tar.gz> --artifact-sha256 <independently-checked-digest> \
  --linux-validation-dir <retrieved-linux-logs> --output docs/production
pnpm exec biome check --write docs/production/*.json
```

This release-specific generator verifies source trees/ancestry/local RC tags,
test totals, typecheck failures, lock audit scope, archive safety, every payload
digest, Linux native architecture, standalone runtime identity and the independently
hashed frontend. It always preserves the **NO-GO** decision; it is not an approval
tool. Without `--artifact` it writes **pending**, never a fabricated Linux pass.
An intentional wrong-digest invocation was tested and refused before writing any
release records. Reports were scanned against local credential values without
printing those values. No encrypted recovery copy, private environment or key is
an input to the public reports or release archive.

## Explicitly NOT accepted

Real production-domain browser/session/passkey journeys; actual protected CDN
bytes/cache behavior; IAM role/rotation and email delivery; provider payment
capture/recurring jobs; consistent EBS/S3 backups and complete restore/legacy
service adoption; M6 fresh-host lifecycle; M8 two-host grant journey; M9 private
evidence byte broker/independent assessment; M10 100k/1M/credit-exhaustion soaks.
The separate cron host is unreachable and must be accounted for. None of these
is inferred from local unit tests, synthetic fixtures or an online tar listing.
