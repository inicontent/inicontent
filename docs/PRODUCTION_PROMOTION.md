# Production promotion — Paris-only initial launch

**2026-10-17 · integration performed locally; LIVE CUTOVER IS NO-GO.**
This is an executed integration record, not a claim that M8 or production
security acceptance has passed. No branch was pushed. No serving application,
customer database, production S3 object, secret or DNS record was changed.

Related deliverables:
- [Region lifecycle](ADDING_REGIONS.md)
- [Production configuration](production/CONFIGURATION.md)
- [Data compatibility](production/DATA_COMPATIBILITY.md)
- [Security readiness](production/SECURITY_READINESS.md)
- [Tests/builds](production/TEST_BUILD_REPORT.md)
- `production/MERGED_COMMITS.json`, `production/CHANGED_FILES.json`,
  `production/SOURCE_REVISIONS.json`, `production/RELEASE_MANIFEST.json`
  (machine-readable exact identities)
- `production/DEPENDENCY_AUDIT.json` (advisories, exact versions/paths and patched ranges)
- API repository: `deploy/production/README.md` and executable deployment kit.

## A. Architecture and observed environments

| Component | Production (observed) | Staging (observed) | Candidate |
|---|---|---|---|
| API host | `ini` → `52.47.97.143`; EC2 `i-086846ce8cb3e18af`, t4g.micro | `51.44.85.163`; EC2 `i-06218d64284b1ae5b`, t4g.nano | Same **existing** production host after approval |
| Compute | Amazon Linux 2023, ARM64, Paris `eu-west-3`, Node 26.9.0 | Amazon Linux ARM64, Paris, Node 26.9.0 | Linux ARM64, Node 26.9.0 / pinned native ABI |
| Process | ec2-user PM2 `API`, `/home/ec2-user/index.mjs`, cwd `/home/ec2-user` | PM2 `API`, `/opt/api-build/.output/server/index.mjs`, cwd `/home/ec2-user` | One process, versioned releases + atomic `current` activation |
| Identity probe | `/health` returns legacy `dbNotFound`, **not** a release probe | `/health` → `02bb5bf8092a` | Baked commit identity, verified against manifest/checksums |
| Engine | Installed iniBase **3.2.0** | Installed **3.8.0**, not the new sparse-read patch | Pinned 3.8.0 source including sparse-read optimization |
| Data | `/mnt/databases`: 20 DB directories, 304 schemas, 15,876,562 logical bytes | 19 DB directories, 273 schemas; not identical | Existing production data volume, never staging data |
| Formats | No `.format` markers found | No `.format` markers found | Legacy format by default; no putLog migration |
| Secrets | `.env` mode 0644; old bundle contains non-empty SMTP credentials | `.env` 0600; old bundle also carries SMTP literals | Runtime-only secrets, 0600 environment; existing ID key retained |
| Storage | Bucket `inic`; `s3.inicontent.com` → CloudFront `E30OSCC7T7VR66` | Historical shared storage; isolated `inic-staging` prepared but not cut over | Existing objects/URLs preserved; CDN authorization must be remediated |
| Cache | Legacy/shared configuration; no candidate cache changes applied | Legacy deployed cache differs from new runtime resolver | `/opt/inicontent-api/shared/cache/main`, per-instance locks/cache |

The inventory used filesystem reads only, **not** an engine opened against live
customer data (engine recovery and cache code may write even during a read).
Schema hashes/counts and runtime file hashes were recorded in restricted local
operator evidence. Table counts are observed schema files, not a migration plan.

The production source revision cannot be reliably reconstructed from a timestamp
or a package version. Its deployed index SHA-256 is
`cfb6e488f0f07b5b93c09af8c0aa904380f4229e70d48f484fa26a481c855344`;
Nitro chunk SHA-256 is
`d7d9e1a402ada5d28ebcc60d19fcef3cc0f5eadd2e85c0d795a8b42738bab13b`.
`9dcb5e3f75652be1f65412badf6c04b992d5a5be` is a historical source/rollback
reference, **not proof** of the exact production runtime or its external engine.
Staging's full recorded source is
`02bb5bf8092ad95f51fec7153ad5dc72f916791e`; its process is **not** executing a
`current` symlink. Do not assume the proposed staging deployment scaffold has
already been adopted.

The SaaS/frontend is a Nuxt SPA extending this layer. AWS confirms Amplify Paris
app `d1c78msfpnlifg`, production branch `main`, successful job **68**, serving
deploy-repository commit `03b24395b431a1e814465989e8322e42e1489dce`
(`inicontent/dist`, also matching the untouched local deploy checkout). That
identifies the deployed static revision, not its original SaaS/layer source pins;
those still require provenance verification. A local dependency directory is not
proof of the remotely installed npm package. The release uses
the pinned sibling layer source, not the older published `inicontent@1.5.0`.
`ini-cron` (`52.47.173.25`) was unreachable over SSH: its writers and recurring
jobs remain an unverified dependency and must be accounted for before quiescing.

### Target responsibilities

Paris is the **only available onboarding region**: display `Europe (Paris)`,
provider `aws`, provider location `eu-west-3`, main role, EUR catalog metadata.
Registry code `main` is the legacy-main lookup alias. The existing undeclared
runtime region id remains **empty**: setting it to `main` would introduce
`main--` hostname/SEO prefixes in paths that historically use bare tenant hosts.
No database association or tenant hostname is rewritten.

The main region owns global users, registry, pricing, billing inventory,
subscriptions/invoices/payments, monitoring authority and compliance evidence.
Tenant data/authentication remain scoped to their selected API/database.
Future regional deployments keep the registry, grants, regional sessions,
authority gates and routing architecture; they are **not deployed or advertised**.
No additional EC2 instance, geographic region, queue or large new service is
required for this launch. Keep one API worker and bounded caches on the existing
small server. Do not run acceptance instances against its live data volume.

## B. Git integration and dependency order

All four repositories now have `production/launch-eu-paris`. Fresh `git fetch
origin` verified each destination tracking ref was an ancestor of its local
integration input. Each merge was a **fast-forward**; no textual conflict was
discarded and no published history was rewritten.

| Repo | Starting destination | Integration input | Incoming commits |
|---|---|---|---:|
| inibase | `origin/master` `38d2dba417ad140c2e267dafe845b5778f9a47b7` | `9f33a73823e16055d36fa8fda66160256b9febae` | 1 |
| api | `origin/main` `7070c1d9daed61e917f877f925bcea2417b72fdb` | `783579e0437808004cba1edd7e0cef86d637ba8a` | 87 |
| inicontent | `origin/main` `6f04e27bb323b07c7f296d3a842d9342b285a0a8` | `2751defba4cc6a7a881c1dfdb6b2393eb8522736` | 13 |
| saas | `origin/main` `1c047f37c5ed055b328584348dbebcb9a041c02b` | `bf4877b7601a1e3e7001f13c535cedead1d29050` | 11 |

Verified final **code** source pins (subsequent documentation-only commits may
advance this layer branch; the candidate keeps these exact pins):

```
inibase    3692895c3a1feacf1e76c4bf65cd11b10c445c0f
api        e96217bb63e86aa54a9179801f6e8d3b44adb15c
inicontent e4143d8f6f7991c9d195736b7004a51fdda86908
saas       04a83b146a497dbdcd40b5612ad1904405bc3fdf
```

Order: **iniBase → API → client layer → SaaS**. The API vendors the exact
compiled engine package from `dacd10280bfdf8c39fae1bc0f0ebbd3d14abd9c5`
(later engine commits add its dependency lock and acceptance-harness fixes,
not a runtime storage change). Package SHA-256:
`e265a89ef690026d24f3beea03f2a85cbe6322cd96ef7b717f9f7002c7ab076e`.
This removes the old manual, unpinned native-base/engine overlay from production
packaging. Every repository's lockfile is committed and recorded in the manifest.

To repeat safely, use new branch names if these already exist; never `-B`, reset,
force-push or overwrite user work:

```sh
git status --short
git fetch origin
git switch -c production/<unique-candidate> <verified-destination-sha>
git merge --ff-only <verified-integration-input-sha>
git log --reverse --format='%H %s' <destination-sha>..HEAD
```

If histories diverge, inspect both diffs and use an ordinary reviewed merge;
resolve schema, auth, storage and config semantics explicitly. Do not apply
`ours`/`theirs` across a repository. Re-run compatibility and HTTP acceptance
after resolution. A source merge is not a database migration or a live release.

### M1–M10 coverage

`MERGED_COMMITS.json` lists **every full hash and subject**, including inherited
security work already present at the merge base. Principal milestones:

| Milestone | Code references | Acceptance status |
|---|---|---|
| M1 registry | API `3a9994a`; layer `a89213b`, `a01d523` | Implemented; Paris seed/gate tested synthetically |
| M2 identity | API `ae5a21e`; layer region/session transport | Implemented; multi-host journey still open |
| M3 provisioning/routing | `e2522e3`, `3e5cbf1`, `c47fd25`, `09b88b3`, `c76631d`, `93b0964`, `5d1d274` | Unit and built-server synthetic tests; live domains not accepted |
| M4 central billing | `8bda374`, `8031aaf`, `39f5851`, `81be23c` | Tested; recurring jobs remain off |
| M5 gateways/payments | `6e96625`, `365aa7f`, `2730f87`, `fb339dc` | Tested; production capture/checkout/webhook processing gated |
| M6 installer | `8c85714`, `908697f` | Portable smoke passes; fresh-host lifecycle not accepted |
| M7 monitoring | `79d0c6a`, `8772d72`, `c918ec1` | Implemented/tests pass; production delivery/alerts not accepted |
| M8 acceptance/release | `000e4ed` through `783579e` | **OPEN**; cross-host authentication not run; no extra region installed |
| M9 compliance center | API `0e44ef2`, `a69ab50`, `7e9fde4`; SaaS `bf4877b` | Integrated; not certification or independent assessment |
| M10 performance | `cc5364a`, `29e6685`, `e702882`, `bccdd5a`, `45374c3`; engine `9f33a73` | Sparse reads/cache/cron fixes included; 100k/1M/credit-soak not run |

### Compatibility fixes during this integration

- Region onboarding enforced server-side, including unavailable/unregistered
  deployments, with audited denial; the UI hides undeployed choices and disables
  creation when the active region is closed.
- An explicit `main` selection keeps bare tenant login hosts, not `main--…`;
  the seeder refuses a prefix that would shadow an existing legacy hostname.
- Partial region PUT no longer blanks `name/code/apiUrl`; a seed refuses to
  rename an existing identity associated with the same API origin.
- Provisioning obtains full metadata independent of requested response columns;
  disk cleanup uses the validated slug, never a projected response value.
- Removed the fake anonymous `role:"guest"` fallback that defeated existing
  `@user.4 = null` denial rules. No customer flow/schema was rewritten.
- Hardened private projections, the platform private-byte route and HTTP 403;
  fixed a denied-read audit reference error. CDN protection is **still a blocker**.
- Runtime-only secret defaults, strict startup checks with no unsafe production
  override, role-based S3 clients, payment gates (503/retry, not false webhook
  acknowledgement), and complete data-backup/atomic deployment safeguards.
- Removed the SaaS's committed PayPal defaults. Rotation is still required.

New uncommitted seek/index/storage work appeared in the engine checkout during
preparation. It is recorded as **not included**, was not overwritten or committed
by this promotion, and is excluded by explicit source pins. Validation uses
exported committed trees, not that changing working directory.

Create only **local candidate** tags until all gates pass; never label this
unapproved candidate as a production release. `launch-paris-20261017-rc1` names
the exact code pins above, not later documentation commits. Reproducible syntax:

```sh
git tag -a launch-paris-20261017-rc1 <verified-code-sha> -m 'Candidate only; live promotion blocked'
# No git push. Publish/final release tag requires the approved repository workflow.
```

## C. Configuration

Use [CONFIGURATION.md](production/CONFIGURATION.md) and the API's
`deploy/production/production.env.example`. Never build on a host carrying its
production `.env`. Runtime Nitro overrides are **`NITRO_*`**, not arbitrary
legacy build-variable names. Preserve the exact production `INIBASE_SECRET`;
record/verify a protected SHA-256 fingerprint rather than rotating it.
Do not copy staging's administrator AWS keys, SMTP credentials, region secret,
payment configuration, cache paths or authentication configuration.

## D. Preserve production data

Preserve the complete production filesystem tree: databases, schemas, auth
records, users, compatible sessions, assets metadata, billing records, audit
logs, journals, backups and any format markers. Preserve S3 objects and current
URLs independently; database backups do not contain all object bytes. Keep
secret-store versions and legacy runtime/native modules as protected rollback
material. Runtime bundles may themselves contain compromised secrets.

**Never** rsync staging over production; never backfill/copy the 15,706 legacy
staging asset references as a shortcut; never bulk-publish unclassified assets;
never rewrite URL prefixes, rotate the ID key, or enable putLog automatically.
Online traversal is inventory, not proof of a consistent backup. The candidate
must never be started with live database paths just to see whether it boots.

## E. Deployment, rollback and recovery

1. Review actual host/process paths again. Reconfirm target instance, source
   hashes, independent artifact digest, tenant domains and external cron writers.
2. Resolve **all** security/data/config/type-check blockers in the reports.
   Validate IAM dependencies, rotate exposed SMTP/PayPal credentials, remediate
   CDN authorization/cache behavior, and verify no development bypasses.
3. Rehearse the **legacy-to-atomic-layout adoption** on an isolated restore.
   Current production has no release symlink/health identity, so the new kit
   intentionally refuses direct activation. Capture its actual PM2/nginx/native
   runtime/config into an encrypted rollback bundle and test that exact bundle.
4. During an explicitly approved writer-quiescence window: drain traffic/cron
   writers, stop the old process, flush filesystems, capture encrypted EBS root
   and data snapshots, wait for completion, verify backup checksums/off-host
   copies, restore separately and test. Verify S3 recovery/versioning separately.
   Do not automatically restore a snapshot over customer writes.
5. Build/export only pinned clean trees; validate on isolated Linux ARM64:

   ```sh
   # In the API checkout. OUT must be new, outside the worktree.
   python3 scripts/export-production-sources.py --workspace <workspace> --out <new-source-dir>
   # Build the SPA from the exported SaaS + sibling layer with their frozen
   # lockfiles and NO .env. Hash its public output into SOURCES.json.
   # On isolated Linux ARM64, no AWS/SMTP/payment credentials, live data inaccessible:
   scripts/build-production-release.sh --sources <SOURCES.json> \
     --frontend <pinned-static-output> --out <new-artifact-dir>
   ```

   Do not treat the old JS-only M8 tarball as this standalone production
   artifact; that tarball required a mutable host native base.
   The build sandbox on the existing small staging host needs
   `NODE_OPTIONS=--max-old-space-size=512`: the default heap exhausted at about
   253 MiB. This is a builder setting, not a production runtime policy; keep the
   300 MiB RAM/768 MiB swap/50% CPU sandbox limits and protect the serving process.
6. Stage only: API `deploy/production/deploy.sh --artifact <tar.gz> --sha256
   <independently-verified-digest>` is a plan; `--execute` extracts/verifies into
   an inactive release, without using live data. No automatic activation.
7. Fill `readiness.example.json` with **evidence**, not hopeful booleans. Its
   target, exact release/digest, backup references and review age are checked.
   Run `preflight.sh --release <sha12> --evidence <private-json>` read-only.
8. **Request final go/no-go**: exact instance/domain, complete commit/digest,
   verified backup/restore status, IAM/CDN/config compatibility, expected restart
   downtime and session effects, and exact rollback path/commands. Do not request
   a routine approval to bypass a known blocker.
9. Only after authorization: use `activate.sh --release <sha12> --evidence <json>
   --approved-release <sha12> --execute`. It atomically renames the `current`
   symlink, restarts the preverified service, checks health and runs smoke;
   failure restores the exact previous target. One forked worker means a brief
   restart, not zero downtime. Billing/capture remain disabled.
10. Monitor for at least ten minutes, then a complete operational day: identity,
    auth failures, tenant/domain routing, audit delivery, protected-byte leaks,
    latency/5xx, CPU credits, memory/swap, disk/inodes and unintended payments.

Modern-layout rollback: `rollback.sh --to <verified-prior-sha12> --execute`;
the target must have a recorded restore/runtime rehearsal. Initial legacy
rollback instead uses the sealed PM2/nginx/runtime bundle and verified paths.
Never downgrade a 3.8 writer onto a 3.2 reader over newly escaped string cells.
If writes are incompatible: stop writers, retain both data generations and logs,
reconcile the write set, and obtain incident-owner approval for recovery.

Stop/rollback immediately on protected-data exposure, tenant/session confusion,
health identity mismatch, restart loops, new 5xx, three consecutive health
failures, sustained p95 over the approved threshold, disk exhaustion, or
unexpected charges. Preserve the failed release and evidence; do not delete or
reset anything to make checks pass. Notify the incident owner, drain traffic,
and verify the rollback health/auth/domain state before reopening writes.

**Current decision: NO-GO.** Backups/restore/rollback adoption, CDN authorization,
least-privilege credential cutover/rotation, full data compatibility, hosting
source provenance, type checks and dependency-vulnerability remediation are not
all accepted. Effective production cron/schedule overrides also need review
before the proposed job freeze. The code integration and candidate preparation
do not silently waive these gates.

## Immutable Linux ARM64 candidate

Built and validated on the existing staging ARM64 host in an isolated sandbox.
Archive SHA-256:
`afffd0f38c08f77139e4cb0d0154332849afcfdc0403a91bc50b6bb437398487`
(`inicontent-production-e96217bb63e8-linux-arm64.tar.gz`, 183,865,240 bytes).
All 189,875 payload files digest-verified; 1 native module (Linux ARM64 ELF);
standalone runtime passed 13 checks; secret scan passed. The artifact is a
validated candidate, **not a production release**. See
`docs/production/RELEASE_MANIFEST.json` for the complete evidence record.
