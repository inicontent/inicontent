# Adding regions after the Paris-only launch

Initial deployment: **Europe (Paris), AWS eu-west-3 only**. This document describes
future capability, not installed or advertised regions. No additional instance
or region is needed for launch. Never change an existing region code, database
association, ID cipher secret or tenant URL to add capacity.

## Identity and ownership

The main API owns the `regions` registry and global billing/users/compliance/
monitoring authority. Regions host local tenant databases/assets and regional
sessions, not a copy of the central billing authority. The historical main
runtime id is empty (bare tenant hosts); registry lookup alias is `main`.
Secondary codes are stable DNS-safe identifiers; `<code>--<slug>` routes there.
There is no global database locator or implicit fallback to another region.

Registry schema (do not reorder existing schema fields): `name`, `code`,
`country`, `provider`, `providerRegion`, `apiUrl`, `enabled`,
`acceptNewDatabases`, `currency`. Availability is derived from the two flags.
The public projection does not disclose provider location or internal row ids.
The client is data-driven and does not contain a hardcoded list of countries.

## 1. Install privately, inactive

After a separate capacity/residency/security approval, select a stable new code,
approved API hostname and dedicated bucket/prefix, IAM role, data/cache/lock
paths, backup target, TLS and service account. Do not share Paris tenant files,
AWS administrator keys or a bucket keyspace merely because slugs differ.
Keep global billing/capture/schedules disabled on secondary deployments.

The existing API installer supports Debian/Ubuntu and Amazon Linux/RHEL-family
hosts. A fresh-host lifecycle remains a separate acceptance gate; it was not
executed as part of this Paris-only launch.

```sh
# Future host only; placeholders are intentionally not launch regions.
sudo bash scripts/inicontent-region.sh bootstrap \
  --region <stable-code> --role regional --domain <regional-api-host> \
  --main-api https://api.inicontent.com --repo https://github.com/inicontent/api.git \
  --ref <pinned-40-character-commit> --env-file /secure/region.env
```

Inspect `--help` and `docs/region-installer-acceptance.md` before use. Prefer the
validated immutable release artifact for upgrades; do not build with secrets on
a serving host. Runtime overrides include `NITRO_REGION_ID=<stable-code>`,
`NITRO_REGION_ROLE=regional`, main/own API URLs, `NITRO_REGION_GATE=strict` and
`NITRO_REGION_SECRET` from the approved shared grant-secret store. A secondary
instance with no grant secret must refuse startup/exchange, not use mock auth.
Retain each existing region's `INIBASE_SECRET` separately; never derive it from
the region grant secret or copy another region's customer data.

## 2. Register without advertising or accepting tenants

Use a platform-admin session **at the main API**, through the normal authorized
API client (Bearer/session cookie, never SID query strings):

```http
POST /inicontent/regions
Authorization: Bearer <operator-session>
Content-Type: application/json

{"name":"<reviewed display name>","code":"<stable-code>","country":"<ISO2>","provider":"aws","providerRegion":"<AWS-region>","apiUrl":"https://<approved-regional-api-host>","enabled":false,"acceptNewDatabases":false,"currency":"<ISO4217>"}
```

Registration validates the URL against the monitoring SSRF allowlist and rejects
hostname-prefix collisions with existing databases. Extend the approved host
allowlist narrowly; never enable production loopback or private/metadata targets.
`GET /inicontent/regions?includeDisabled=true` is admin-only. Do not delete a row
to simulate inactivity: existing associations and audit attribution must survive.

The launch seeder (`scripts/seed-launch-region.ts`) reconciles an explicit
desired catalog and deactivates unlisted rows. **Do not rerun the Paris-only
seed after adding a region** unless deliberately deactivating it. Either update
the reviewed desired catalog first or manage registration through the dynamic
admin API. Dry run works on a disposable copy so engine recovery cannot mutate
the original. It refuses a different existing code for the same API origin.

## 3. Test while private

- Full engine/API/client/SaaS tests, type checks, lint and Linux-native build.
- `/health` must identify the exact artifact and declared region.
- Real two-origin grant mint/redeem/signout; wrong audience/region, replay,
  expiration, role-change revocation, passkey enrollment and session isolation.
- Same synthetic slug in two isolated regions must never cross-read records,
  metadata caches, assets, audit trails or local filesystem paths.
- Closed/unregistered-region database creation must fail server-side, even when
  the request bypasses the UI. No paid customer provisioning during acceptance.
- Secondary billing/admin monetary operations refused; capture and recurring
  jobs off. Monitoring connect timeout/SSRF and main authority preserved.
- Synthetic private object: anonymous direct S3/CDN denied, authenticated broker
  allowed, unpublish revokes access and purges caches. A private bucket alone is
  not private CDN authorization.
- Backup/restore, loss of network/main region, incident delivery and exact
  artifact rollback. No customer migration or putLog activation as a test.

M8's cross-host acceptance remains **open**; local unit tests do not close it.
The old two-EC2 acceptance plan is not authorization to provision anything now.

## 4. Activate deliberately

Publish DNS/TLS only after infrastructure checks and owner approval. Update the
existing registry row by **id**, never by inventing a new code. Enable serving
with `enabled:true` while keeping `acceptNewDatabases:false` if draining/read-only
validation is still needed. Only after acceptance set `acceptNewDatabases:true`.
The main public catalog, status page and picker are dynamic; the single-option
picker remains hidden until multiple creatable choices actually exist.
Validate any app pinned to that region before exposing its deep links.

Partial PUT must preserve omitted fields (tested in this candidate). Recheck the
returned code, API URL and name after every update; keep registry snapshots in
the approved backup, never an ad hoc staging overwrite.

## 5. Deactivate and roll back

First set `acceptNewDatabases:false` to stop onboarding while preserving service
for existing tenants. If a region is unavailable, set `enabled:false`; do not
silently route its tenants to Paris. Restore service from its own verified
release/data/secret versions and revalidate before enabling again.

Rollback the exact registry flags/API origin and release pin recorded before the
change. Retain the stable row/code, database associations, object URLs and audit
records. Do not delete regions containing databases, bulk move data, reassign
slugs, share cache directories or rotate encryption keys during rollback.
Cross-region data migration, if ever needed, is a separate consented/validated
project with its own backup, residency and compatibility gates.
