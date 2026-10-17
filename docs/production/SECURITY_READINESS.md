# Security readiness — LIVE PROMOTION BLOCKED

2026-10-17. Code integration is complete for the intended local M1–M10 changes;
operational security acceptance is not. This is not a HIPAA/SOC 2 certification
or an independent security assessment. No shared credential was revoked, rotated
or transferred into the candidate. No production CDN/IAM policy was changed.

| Area | Implemented / evidence | Remaining production gate |
|---|---|---|
| AWS credentials | Read-only STS: production and staging use shared `user/admin`; production's configured application credential pair confirms the same principal. No production instance profile. Role/trust/policy templates prepared; role mode refuses legacy profile/static/web-identity/container overrides | Dependency inventory, reviewed role creation/attachment, synthetic allow/deny tests, removal of shared static keys from the new runtime; **do not revoke shared admin keys blindly** |
| Embedded SMTP | Production old Nitro chunk has non-empty `smtpUser`/`smtpPass`. New sensitive defaults are empty; clean builds and automated artifact/value scans prepared | Provider-side rotation and runtime-only delivery test; changing `.env` alone cannot remove secrets baked into an old rollback bundle |
| SaaS payment credentials | Removed committed PayPal sandbox defaults and verified new generated source/output; no PayPal SDK secret needed in browser | Rotate previously committed values at PayPal; deletion from HEAD is not removal from Git history/provider logs |
| Private assets | Fail-closed classification, recursively redacted metadata, denied-read audit fix, platform private-byte route, actual HTTP 403/no-store, synthetic built-server tests | **CDN still bypasses authorization**; metadata redaction is not a byte gate. Private upload and legacy-key behavior need end-to-end validation |
| Authentication/tenants | B1 revocation/passkey scope, B2 audience binding/PKCE/region grants, B3 locking/rate limits, B4 scrubbed audit code preserved/tested. Built-server cross-database SID rejection and anonymous users denial checked | Actual production sessions/roles/passkeys/custom domains not accepted; legacy claimless SIDs/recovery/cross-worker behavior remain documented residual gates |
| Anonymous flow rules | Removed synthetic `role:"guest"` fallback which made stored `@user.4 = null` guards fail open. Regression and built-server tests added, no customer flow rewrite | Review real tenant flow semantics on sanitized copies before cutover |
| C1 browser persistence | Explicit opt-in/classification, containment and no-store work integrated | Supervised recovery workflow and deployed browser acceptance incomplete; no broad offline/PHI safety claim |
| C3 headers | API security headers/no-store tested against built server | SPA/CDN policy and all custom HTTPS domains separately validated; HSTS not blindly enabled |
| C4 durability/audit | Snapshot/integrity/alert/backup tooling integrated and unit tested; encrypted preliminary copies prepared | Consistent restore acceptance, independent/WORM integrity anchors, off-host alert delivery and incident ownership not closed |
| Runtime | Production boot refuses missing/malformed ID key, mismatched fingerprint, loopback/mock flags and unsafe override. Immutable Linux candidate pipeline; no `.env` in payload | Final environment/service ownership/secret versions, native ABI and actual deployment gates must pass |
| Billing | Main authority tests preserved; capture/checkout/settlement routes off by default in production. Disabled webhooks return 503/retry rather than false acknowledgement; cron/capture remain off in launch template | Existing provider agreements and legacy cron host inventory; separate approved production gateway/payment/recurring-job acceptance |
| Dependencies | API: **26 high, 25 moderate, 6 low**, 0 critical. Layer: **3 critical, 7 high, 2 low**. SaaS: **3 critical, 22 high, 13 moderate, 5 low**. Critical paths are Nuxt devtools/build dependencies; runtime reachability is not inferred. Exact audit records retained in `DEPENDENCY_AUDIT.json` | Classify build/runtime reachability, patch/isolate vulnerabilities, validate SMTP/payment/native dependencies and repeat frozen builds/tests/audit; secret scanning does not close this gate |

The engine lock additionally reports **3 high, 5 moderate, 3 low**, no critical;
the high paths are RE2's `node-gyp > undici` build dependencies. Counts are
per-lockfile advisory entries, not distinct exploitable production findings.

## Confirmed production CDN finding

Read-only AWS configuration: `s3.inicontent.com` is distribution
`E30OSCC7T7VR66`, direct S3 origin `inic.s3.eu-west-3.amazonaws.com`, OAC
`E2DWYJTX1SZ8AE`. Default behavior has **no trusted signers/key groups, no
CloudFront Function, no Lambda@Edge**, and cache policy
`658327ea-f89d-4fab-a63d-7e88639e58f6` (Managed-CachingOptimized). The bucket's
public-access block is on, but that does not authorize viewers of the CDN.
The bucket policy permits CloudFront `s3:GetObject` across `inic/*`, conditioned
on the distribution source ARN; it has no viewer/tenant authorization boundary.
There are **zero additional cache behaviors**, so no private-prefix exception
was found in that read-only configuration review.
S3 versioning is **not enabled** in the observed configuration.

The earlier staging synthetic round-trip already proved direct S3 403 vs CDN
200 and cached bytes after deletion (`api/docs/m8-release.md` §5.2). No real
customer private object was requested during this promotion investigation.
Production configuration has the same missing viewer-authorization boundary;
no production private-asset safety claim can be made from a private bucket.

### Proposed fix and acceptance (not a live change)

1. Inventory current object-key layouts and visibility using authorized sanitized
   metadata. Preserve all public URLs and existing objects; no bulk publish,
   staging-reference copy or key rewrite.
2. Put protected/unclassified paths behind an authorization broker on the
   **existing API**, with an appropriately reviewed CloudFront origin/edge policy
   at the existing hostnames. Alternatively, partition published/private storage
   with enforceable origin IAM conditions and a verified legacy compatibility
   mapping. Do not assume an unguessable key or signed **upload** URL is read
   authorization. The necessary viewer decision must occur **before** a cached
   private object can be served.
3. Forward required authorization/session context to the broker, scope lookup to
   tenant/asset and region, and never cache private/authenticated bytes. Prevent
   direct S3/origin bypass. Invalidate old private/unpublished cached objects and
   wait for completion. Public-to-private changes need a verified revocation
   sequence; already downloaded public bytes cannot be retroactively recalled.
4. With a dedicated synthetic object/prefix and reviewed least-privilege role:
   direct S3 and anonymous CDN must deny; owner/broker must return bytes;
   wrong-tenant/region/session must deny; signout/unpublish must deny subsequent
   requests; repeat through warm-cache, query-string, cookie/header and deletion
   variants. Keep 403/404/error caching from leaking authorization state.
5. Check legacy public URL continuity and authenticated private upload/download
   end to end. Record exact CloudFront version/ETag/policy and rollback config.
   CDN activation is a serving production change and requires the final approved
   window. Do not close this blocker by merely hiding `publicURL`.

No additional EC2 instance is required for this design. The edge/origin change
and broker legacy mapping are **not implemented or accepted on the serving
distribution**; infrastructure authorization/rollout is a blocker, not a silently
waived follow-up.

## Credential/secret handling rules

- `INIBASE_SECRET` is the existing production ID cipher key. Do not rotate it to
  satisfy isolation; validate the approved version/fingerprint and retain it.
- Rotate exposed SMTP and previously committed PayPal secrets through their
  providers after dependency review, test new runtime values, and retain only
  approved encrypted rollback material. Do not put values in tickets/docs/logs.
- Old runtime/environment/PM2 config copies are encrypted recovery material,
  **not** release payloads. The generated backup encryption key is unrelated to
  any production authentication secret and requires durable secret-store custody.
- Disable `PAYMENTS_MOCK_ACCEPTANCE`, `MOCK_PAYMENT_GATEWAY`, CORS/monitoring
  loopback and `INICONTENT_ALLOW_UNSAFE_RUNTIME`. The new guard has no production
  unsafe bypass. Synthetic runtime tests use a real approved production Origin
  header; they do not enable loopback exceptions.

## Required go/no-go evidence

Close CDN authorization, IAM/rotation, compatible production data/rollback,
consistent snapshots + restore, actual frontend/API revisions, browser/session/
domain acceptance, type-check failures, vulnerable dependencies, independent
audit/alert custody and external cron/payment dependencies. Effective production
PM2 configuration enables crons/schedules despite false values in its `.env`;
the proposed job freeze therefore requires an explicit behavior-impact review.
M6 fresh-host lifecycle, M8 cross-host
journey, M9 evidence-byte broker and M10 long credit/scale soaks remain explicitly
unaccepted; do not relabel their historical NOT RUN/BLOCKED results as passes.
