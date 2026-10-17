# Production data compatibility — NOT ACCEPTED

Observed read-only on 2026-10-17. No production database was opened with the new
engine, migrated, replaced, decrypted for testing or copied from staging.

## Inventory

- Production: EC2 `i-086846ce8cb3e18af`, data volume mounted `/mnt/databases`;
  20 database directories, 304 schema files, 15,876,562 logical file bytes.
  Filesystem allocation was approximately 29 MiB. Count differences between
  logical bytes and `du` are expected; this is not a row-loss calculation.
- Production engine external to the Nitro bundle is **3.2.0**, not the API
  package manifest's later dependency range. Staging has 3.8.0, 19 DBs/273 schemas
  and a different set of databases/files. They are not interchangeable.
- No `.format` markers found at the inspected database/table depth in either
  environment. This is evidence of legacy-format tables, not proof that every
  index, schema, encoded identifier or customer value is compatible.
- Table schema digests, row counts for available `id.txt` columns, sizes and
  runtime file digests were recorded by `scripts/production-inventory.py`.
  It imports no engine and emits no row contents or credential values.

## Synthetic upgrade probe

Exact probe: iniBase `tests/production-upgrade.mjs`, using an isolated npm 3.2.0
package verified against its npm SHA-512, and the current compiled engine.
The probe forcibly uses a public synthetic 32-byte key and a disposable store;
it cannot take a customer database path. No production identifiers/passwords
were supplied.

Command (verified locally):

```sh
LEGACY_INIBASE_MODULE=<isolated-inibase-3.2.0>/dist/index.js \
  node tests/production-upgrade.mjs
```

Results:

| Contract | Result |
|---|---|
| 3.2 writes → 3.8 reads, including Unicode/percent/newline/backslash fixtures | Passed for the tested stored legacy values |
| Same-key encrypted row identifiers | Passed |
| Legacy password hashes authenticate under the new helper | Passed |
| Legacy session cipher payload bytes with the same key | Passed |
| Plain legacy row update and readback | Passed |
| No automatic `.format` / putLog activation | Passed |
| **3.8 escaped-string write → 3.2 rollback reader** | **FAILED: one synthetic string differs** |

The probe deliberately exits **1** when the downgrade mismatch is detected.
This is a real rollback blocker, not a flaky test to skip. It also does not
prove all customer data formats are safe: optional schema/index behaviors,
transactions and string-escape semantics changed between engine versions.

## Required acceptance before any customer writer starts

1. Obtain a complete consistent backup/restore point with all writers quiesced,
   including any separate cron host. Preserve hidden journals, schemas, indexes,
   auth/passkey/session records, billing tables and audit logs.
2. Produce an authorized **sanitized** representative copy covering every schema
   pattern and legacy string encoding. Verify reads, criteria/index lookup,
   update/delete/transaction behavior, passwords, ownership links, assets and
   sessions with the exact candidate engine. Do not test on the live mount.
3. Compare logical row counts and representative application results, not only
   schema hashes or a successful process start. Examine recovery/journal effects
   on an isolated clone. Rebuild disposable caches/indexes only after identifying
   which are derived; do not delete production indexes or data as a shortcut.
4. Decide and verify an upgrade/rollback writer contract. A 3.2 binary cannot be
   the unconditional rollback reader after 3.8 has written new escaping. Options:
   an approved read-only validation window before opening writes; a separately
   verified compatible rollback reader; or a deliberate reversible migration/
   write-set recovery process. Do not silently backport a decoder or run a bulk
   customer migration in this launch task.
5. Retain `INIBASE_SECRET` exactly. Verify the actual loaded key against the
   approved production fingerprint, ID-one value, encoded links and sessions.
   Historical staging has divergent `.env` copies; never copy one into production.
6. Test existing tenant/custom domains, internationalized slugs, role-change
   revocation and both legacy/new session formats. Legacy claimless SIDs are a
   documented residual issue; local synthetic cipher equivalence does not prove
   every existing production session can safely be retained.

**No putLog migration is authorized.** Format-2/update-log durability, recovery,
backup inclusion and downgrade acceptance require a separate project. Do not
set a new table flag on existing customer tables for the reported write benchmark.
The sparse-read improvement is independent of enabling putLog and is included
in the candidate's pinned engine.

## Assets and persistence

Preserve production objects, names, keys, visibility and stored/fallback URLs.
Do not copy the 15,706 empty-`publicURL` staging references into production or
rewrite their URL base. Those staging references point to objects in a different
bucket history; they are an isolation blocker, not production seed data.
Private/unclassified assets must fail closed without making public assets
disappear through an unreviewed mass reclassification. New private upload and
legacy content-key layouts need a complete S3/CDN/broker acceptance test.

## Backups actually prepared

Read-only **online** production data and legacy runtime/config copies were
streamed over SSH into encrypted operator-local files outside every repository.
They were decrypted only into a tar listing stream to verify archive readability;
no customer file contents were printed or extracted for application testing.

| Copy | Ciphertext SHA-256 | Status |
|---|---|---|
| `production-databases.online-r2.tar.gz.enc` | `e9c0dd8a5b72de6a6cabf2773bae455cd778dcd81c57a72761e72522e5c72950` | tar exit 0, 4,433 listed entries |
| `legacy-runtime.online.tar.gz.enc` | `0fe66947153d4018f0858a22a6107d276057d5e7ec1c1ae8bc6bb363938a8880` | tar exit 0, 25,377 listed entries |

Location: approved operator temporary workspace, `prod-launch-20261017/protected-recovery/copies/`;
the generated backup key is held in a separate restricted `keys/` directory,
never in source/release/docs. Import it into the approved durable secret store
and verify retention/off-host custody before relying on these copies. Encryption:
AES-256-CBC with PBKDF2 (200,000 iterations), independent ciphertext SHA-256.

The first data copy had tar exit 2 because `lost+found` was not readable; it is
retained as **incomplete**, not accepted. The explicit read-only privileged retry
included it and exited 0. Both remain **`consistent:false`**: active writers were
not stopped. No EBS snapshot, S3 object recovery copy, full restore rehearsal or
working legacy rollback service has been certified. **Do not satisfy the
activation backup/rollback gate with these preliminary copies.**
