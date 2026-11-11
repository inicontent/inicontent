# Production runtime configuration

Status: **template prepared, not installed on production**. The authoritative
template is API `deploy/production/production.env.example`; it contains no real
credentials. Keep the completed runtime file outside releases/git, owned by the
service account, mode 0600, with a protected parent directory. Do not source an
untrusted file as shell code: launch through the service manager/Node env parser.

## Build vs runtime

Nitro serializes `runtimeConfig` defaults at build time. Production builds must
run in a clean exported tree and an empty credential environment; no `.env`,
AWS/SMTP/PayPal/region/evidence secrets or developer paths. Sensitive defaults
(`smtpUser`, `smtpPass`, region/evidence signing secrets) are now empty in source.
Supply their **`NITRO_*` overrides at runtime**, not legacy build names.
The release scanner examines payload files and optionally compares actual
environment secret values without printing them. It verifies native `.node`
files are Linux ARM64 ELF, rejects Mach-O/env/private-key files, and rejects
opaque nested archives. Generated WASM base64 is not misclassified as a literal
AWS token; actual credential tokens and known environment values remain checked.

`INICONTENT_BUILD_REVISION` is a **build-only verified 40-character Git pin** for
an exported source archive. `/health` uses a compile-time literal; runtime
`NITRO_RELEASE` cannot prove or override the shipped source identity. Artifact
digests and source manifests, not a configurable health string, are the trust
anchor. Never set a development flag just to make an acceptance test work.

## Required deployment inputs

| Purpose | Runtime names / required policy |
|---|---|
| Mode/listener | `NODE_ENV=production`, `NITRO_HOST=127.0.0.1`, `NITRO_PORT=3000`; proxy/TLS remain at nginx |
| Main identity | `NITRO_REGION_ROLE=main`, **`NITRO_REGION_ID=`** retains historical bare-host routing; public label `eu`; `NITRO_REGION_GATE=strict` |
| API origins | `NITRO_REGION_MAIN_API_URL`, `NITRO_REGION_API_URL` = `https://api.inicontent.com`; `NITRO_URL_API=https://api.inicontent.com/` |
| Registry seed | `main`, `Europe (Paris)`, FR/aws/eu-west-3, enabled/acceptNewDatabases true, EUR. Seed only after backup/approval; do not rename existing rows |
| Databases | `NITRO_DATABASE_PATH=/mnt/databases`; preserve `INIBASE_SCHEMA_EXTENSION=inis`, compression and existing table settings after inventory |
| ID cipher | **Existing** `INIBASE_SECRET`, 64 hex characters, plus `INIBASE_SECRET_FINGERPRINT=sha256:<hex>`. Secret-store source/version must match production; no random replacement |
| Cache/locks | `INICONTENT_CACHE_DIR=/opt/inicontent-api/shared/cache/main`, `INICONTENT_LOCK_DIR=/opt/inicontent-api/shared/locks/main`; writable only by the app user |
| Cache policy | `CACHE_ENABLED`, `INIBASE_CACHE`; do **not** set `INICONTENT_PURGE_SHARED_INIBASE_CACHE=true` on a shared database root |
| S3 | `AWS_REGION=eu-west-3`, `AWS_S3_BUCKET_NAME=inic`, `AWS_S3_PUBLIC_URL=https://s3.inicontent.com`, `NITRO_URL_S3=https://s3.inicontent.com/` preserve current URLs. To publish under `eu.s3.inicontent.com`, add the alias first and switch both values only after an object check |
| Asset visibility | Private assets are disabled by default (`ASSETS_PRIVATE_ENABLED` unset): every upload is public. Set `ASSETS_PRIVATE_ENABLED=true` only with the C2a access-logging/acceptance gates |
| AWS identity | Reviewed EC2 instance role; `INICONTENT_AWS_USE_ROLE=true`. `AWS_SHARED_CREDENTIALS_FILE=/dev/null`, `AWS_CONFIG_FILE=/dev/null`, no profile/static/web-identity/container overrides. The old user's admin profile must not win the provider chain. Tenant-owned custom S3 pairs retain existing compatibility |
| Region grants | `NITRO_REGION_SECRET` from the approved store. Optional/off in the main-only deployment; mandatory and equal for future grant participants. Not the ID cipher key |
| Email identity | `NITRO_EMAIL_FROM_EMAIL`, `NITRO_EMAIL_FROM_NAME`, `NITRO_EMAIL_SES_REGION=eu-west-3`; verified SES identity and reviewed sender permissions |
| SMTP alternative | `NITRO_EMAIL_SMTP_HOST`, `_PORT`, `_USER`, `_PASS`, `_SECURE`; newly rotated runtime credentials. Do not reuse secrets recovered from the old bundle |
| Authentication | `NITRO_PASSKEY_RP_ID`, `NITRO_PASSKEY_EXPECTED_ORIGIN`, `NITRO_PASSKEY_REQUIRED_ROLES` (JSON array), challenge TTL if overridden. Preserve approved tenant/passkey behavior; do not impose a new role list without recovery acceptance. Session transport is Bearer header or scoped **HttpOnly** cookie; query-string SIDs are refused |
| CORS | `NITRO_CORS_PLATFORM_ORIGINS` JSON allowlist for the real SPA hosts; tenant origins remain database-scoped and must include canonical `*.<label>.inicontent.com` plus legacy hosts. `NITRO_CORS_ALLOW_LOOPBACK=false`. `GET /inicontent/regions` is readable by tenant origins without credentials |
| Security headers | API CSP/nosniff/frame/referrer policy is in code. `NITRO_SECURITY_HSTS_*` is a separate HTTPS-domain acceptance decision; do not enable preload/includeSubDomains blindly |
| Billing | `NITRO_BILLING_ENABLED=false`, `NITRO_CENTRAL_BILLING_ENABLED=false`, **`NITRO_CRONS_ENABLED=false`** at launch |
| Capture | `PAYMENTS_CAPTURE_ENABLED=false`; leave `PAYPAL_CLIENT_ID`/`PAYPAL_CLIENT_SECRET` unset until separately validated. If later authorized, `PAYPAL_MODE=live`; no sandbox/mock flags in production |
| Other writers | `NITRO_SCHEDULES_ENABLED=false`, `NITRO_BACKUPS_ENABLED=false` until individually validated and the inaccessible legacy cron host is accounted for |
| Monitoring | `NITRO_REGION_MONITORING_ENABLED=false` initially; allowlist `api.inicontent.com,.api.inicontent.com`; `_ALLOW_LOOPBACK=false`. Enable scheduled monitoring only after reviewed runtime/SSRF/alert acceptance |
| Independent alerts | `AUDIT_ALERT_WEBHOOK_URL` from the approved store; prove off-host delivery, retries and incident ownership |
| Compliance | `NITRO_COMPLIANCE_EVIDENCE_ACCESS_SECRET`, security contact/policy/language/expiry inputs. No public certification claim or private evidence byte broker is inferred from an enabled UI |
| Domains | Preserve existing Amplify app/region/branch and tenant-domain associations; use `NITRO_DOMAIN_MANAGEMENT_APP_ID`, `_REGION`, `_BRANCH_NAME` if needed. Do not conflate compute region with historical domain-management settings |

The bounded metadata L0 caches are 128 entries / 8 MiB **each**, with clone-on-
read; source TTL 5 minutes, enriched metadata TTL 30 minutes. Both cache key
families include region and database. The Nitro fs mount is re-resolved at
runtime, so the deployment cache path is not stuck at the builder's default.
Use one API worker initially; the cache/lock design is not a claim of distributed
multi-host payment atomicity.

### Verified legacy values and impact

Production's current environment has `INIBASE_COMPRESSION=false`,
`INIBASE_CACHE=false`, `INIBASE_SCHEMA_EXTENSION=inis`, `CACHE_ENABLED=true`,
`AWS_REGION=eu-west-3`, bucket `inic`, public base `https://s3.inicontent.com`,
and `PAYPAL_MODE=sandbox`. The launch template preserves the compression/cache
defaults; it does not opt existing tables into a new format.
The file says crons/schedules false, **but PM2 overrides both to true**. Therefore
copying that file is not an inventory of effective configuration. Holding all
jobs off in the proposed launch configuration would pause existing schedules,
backups and other cron work as well as billing. Reconcile and validate those
workflows before approval; do not call that behavior preservation without proof.

## Least privilege preparation (not applied)

Production and staging's default AWS CLI identities both resolved to the shared
`user/admin`; a read-only STS check using production's configured application
credential pair confirmed the same principal. Production has **no EC2 instance
profile**. Do not revoke that
identity or copy it into a release. First inventory consumers (S3, SES, Amplify,
backups/cron/automation), prepare a dedicated production role, and test each
required action with that role. Templates in `deploy/production/iam-*.example.json`
grant only production-bucket object operations and a verified SES identity.
Replace placeholders, narrow prefixes where possible, and add a narrowly scoped
Amplify statement only if verified domain management requires it. Never attach
AdministratorAccess to solve an application error.

Commands below are AWS CLI syntax templates, **not executed changes**:

```sh
aws iam create-role --role-name <production-api-role> \
  --assume-role-policy-document file://<reviewed-trust.json>
aws iam put-role-policy --role-name <production-api-role> \
  --policy-name <reviewed-runtime-policy> --policy-document file://<reviewed-policy.json>
aws iam create-instance-profile --instance-profile-name <production-api-profile>
aws iam add-role-to-instance-profile --instance-profile-name <production-api-profile> \
  --role-name <production-api-role>
# Attach only after dependency review and explicit authorization:
aws ec2 associate-iam-instance-profile --region eu-west-3 \
  --instance-id i-086846ce8cb3e18af --iam-instance-profile Name=<production-api-profile>
```

No IAM writes were performed. Secret rotation/attachment is a separate approved
configuration operation. The runtime S3 client now omits static credentials for
role-based storage instead of passing an undefined pair. In instance-role mode,
the startup guard refuses static/profile/web-identity/container overrides and
requires both legacy credential/config files to be isolated with `/dev/null`.
STS session credentials and tenant-specific credential pairs remain supported
outside that platform EC2-role environment. Test least privilege
with synthetic prefixes and verify denial outside the approved bucket/prefix.

## Session and domain compatibility checks

Check legacy SID shapes and new audience binding; `Authorization: Bearer` and
scoped-cookie transport (query-string SIDs are refused); tenant/platform/regional
session separation; region grant mint/redeem/signout; sign-in/current/signout;
password reset/role revocation; passkey enrollment/recovery; custom tenant
domains; canonical `*.<label>.inicontent.com` and `/<label>/<slug>` hosts plus
legacy bare/internationalized hosts. Existing encrypted IDs, owner/admin
references and the `idOne` constant must agree with the retained production key.
If they do not, stop; do not generate a key that makes a fixture pass. Confirm the
actual frontend deploy repository and source/layer revisions before replacing its
static files. Update CSP/CORS/CDN headers at that hosting layer; API headers do
not secure the SPA or asset CDN by themselves.
