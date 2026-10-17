#!/usr/bin/env python3
"""Generate promotion evidence from explicit pins, not mutable working trees."""
import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import struct
import subprocess
import tarfile

p = argparse.ArgumentParser(description=__doc__)
p.add_argument("--workspace", required=True)
p.add_argument("--pins", required=True, help="verified exported SOURCES.json")
p.add_argument("--output", required=True)
p.add_argument("--validation-dir", required=True, help="retained local test/type/audit logs")
p.add_argument("--artifact", help="completed immutable Linux tarball; omit while pending")
p.add_argument("--artifact-sha256", help="independently retrieved expected archive digest")
p.add_argument("--linux-validation-dir", help="retrieved Linux builder logs")
a = p.parse_args()
workspace, output = Path(a.workspace), Path(a.output)
validation = Path(a.validation_dir)
pins = json.loads(Path(a.pins).read_text())
output.mkdir(parents=True, exist_ok=True)
bases = {
    "api": ("7070c1d9daed61e917f877f925bcea2417b72fdb", "783579e0437808004cba1edd7e0cef86d637ba8a"),
    "inibase": ("38d2dba417ad140c2e267dafe845b5778f9a47b7", "9f33a73823e16055d36fa8fda66160256b9febae"),
    "inicontent": ("6f04e27bb323b07c7f296d3a842d9342b285a0a8", "2751defba4cc6a7a881c1dfdb6b2393eb8522736"),
    "saas": ("1c047f37c5ed055b328584348dbebcb9a041c02b", "bf4877b7601a1e3e7001f13c535cedead1d29050"),
}

def git(repo, *args):
    return subprocess.check_output(["git", *args], cwd=workspace / repo, text=True).strip()

def sha256(path):
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()

def test_result(path, expected):
    text = path.read_text()
    counts = {
        key: sum(map(int, re.findall(r"ℹ " + key + r" (\d+)", text)))
        for key in ("tests", "pass", "fail", "skipped", "cancelled")
    }
    assert counts["tests"] == counts["pass"] == expected, path.name
    assert not any(counts[key] for key in ("fail", "skipped", "cancelled")), path.name
    return {"status": "passed", **counts, "log": path.name, "logSHA256": sha256(path)}

def commits(repo, left, right):
    text = git(repo, "log", "--reverse", "--format=%H%x09%s", left + ".." + right)
    return [{"commit": line.split("\t", 1)[0], "subject": line.split("\t", 1)[1]} for line in text.splitlines()]

record = {"observedAt": datetime.now(timezone.utc).isoformat(), "integrationBranch": "production/launch-eu-paris", "mergeConflicts": [], "repositories": {}}
changed = {"sourceChanges": {}, "documentationAndReportingFiles": []}
for repo, (base, incoming) in bases.items():
    pin = pins["source"][repo]["commit"]
    assert git(repo, "cat-file", "-t", pin) == "commit"
    assert git(repo, "rev-parse", pin + "^{tree}") == pins["source"][repo]["tree"]
    assert git(repo, "rev-parse", "refs/tags/launch-paris-20261017-rc1^{commit}") == pin
    subprocess.run(["git", "merge-base", "--is-ancestor", base, incoming], cwd=workspace / repo, check=True)
    subprocess.run(["git", "merge-base", "--is-ancestor", incoming, pin], cwd=workspace / repo, check=True)
    entries = []
    for line in git(repo, "diff", "--name-status", "--no-renames", base, pin).splitlines():
        status, path = line.split("\t", 1)
        entries.append({"status": status, "path": path})
    changed["sourceChanges"][repo] = {"base": base, "pin": pin, "files": entries}
    record["repositories"][repo] = {
        "destination": base, "incoming": incoming, "candidateSource": pin,
        "incomingCommits": commits(repo, base, incoming),
        "preparationCommits": commits(repo, incoming, pin),
        "refsAtReport": git(repo, "for-each-ref", "--format=%(refname) %(objectname)", "refs/heads", "refs/remotes", "refs/tags").splitlines(),
        "uncommittedAtReportNotIncludedInSourcePin": git(repo, "status", "--porcelain").splitlines(),
    }
record["inheritedApiSecurityCommits"] = [
    {"commit": line.split("\t", 1)[0], "subject": line.split("\t", 1)[1]}
    for line in git("api", "log", "--format=%H%x09%s", pins["source"]["api"]["commit"], "--grep=security:", "--grep=B1", "--grep=B2", "--grep=B3", "--grep=B4", "--grep=C1", "--grep=C2", "--grep=C3", "--grep=C4").splitlines()
]
names = {str(f.relative_to(workspace / "inicontent")) for f in (workspace / "inicontent/docs").rglob("*") if f.is_file()}
names.update({"scripts/production-report.py", "docs/production/MERGED_COMMITS.json", "docs/production/CHANGED_FILES.json", "docs/production/SOURCE_REVISIONS.json", "docs/production/RELEASE_MANIFEST.json", "docs/production/DEPENDENCY_AUDIT.json"})
changed["documentationAndReportingFiles"] = sorted(names)

audits = {}
for repo, name in (("inibase", "inibase"), ("api", "api"), ("inicontent", "layer"), ("saas", "saas")):
    path = validation / (name + "-dependency-audit.json")
    audit = json.loads(path.read_text())
    audits[repo] = {
        "command": "pnpm audit --prod --json",
        "scope": "lockfile dependencies, not a runtime reachability determination",
        "sourceCommit": pins["source"][repo]["commit"],
        "lockSHA256": pins["lockfiles"][repo],
        "rawLogSHA256": sha256(path),
        "counts": audit["metadata"]["vulnerabilities"],
        "advisories": [
            {key: item.get(key) for key in ("id", "module_name", "severity", "title", "vulnerable_versions", "patched_versions", "url", "findings")}
            for item in audit["advisories"].values()
        ],
    }

artifact = {"status": "pending", "approvedForProduction": False}
linux = {"status": "pending"}
if a.artifact:
    assert a.artifact_sha256 and a.linux_validation_dir, "artifact digest and Linux logs required"
    path = Path(a.artifact)
    assert sha256(path) == a.artifact_sha256, "archive digest mismatch"
    with tarfile.open(path, "r:gz") as archive:
        files = {}
        for member in archive.getmembers():
            name = PurePosixPath(member.name)
            assert not name.is_absolute() and ".." not in name.parts, "unsafe archive path"
            assert member.isdir() or member.isfile(), "archive links/devices forbidden"
            if member.isfile():
                key = str(name)
                assert key not in files, "duplicate archive file"
                files[key] = member
        manifest_bytes = archive.extractfile(files["MANIFEST.json"]).read()
        manifest = json.loads(manifest_bytes)
        assert manifest["source"] == pins["source"] and manifest["lockfiles"] == pins["lockfiles"], "artifact source/lock identity mismatch"
        assert manifest["target"] == "linux-arm64" and manifest["linuxValidation"] == "passed"
        assert manifest["nodeVersion"] == "v26.9.0" and manifest["secretScan"] == "passed"
        assert set(files) == set(manifest["files"]) | {"MANIFEST.json"}, "unmanifested payload file"
        frontend_files = {name.removeprefix("frontend/"): digest for name, digest in manifest["files"].items() if name.startswith("frontend/")}
        assert frontend_files == pins["frontendFiles"], "frontend payload differs from independently hashed static build"
        natives = []
        for name, expected in manifest["files"].items():
            data = archive.extractfile(files[name]).read()
            assert hashlib.sha256(data).hexdigest() == expected, "payload digest mismatch: " + name
            if name.endswith(".node"):
                assert len(data) > 20 and data[:6] == b"\x7fELF\x02\x01" and struct.unpack("<H", data[18:20])[0] == 183, "non-Linux ARM64 native payload"
                natives.append(name)
        runtime = json.load(archive.extractfile(files["validation/linux-runtime.json"]))
        assert runtime["status"] == "passed" and runtime["linux"] and runtime["arch"] == "arm64"
        assert runtime["release"] == pins["source"]["api"]["commit"][:12]
    linux_logs = Path(a.linux_validation_dir)
    linux = {
        "status": "passed",
        "engineTests": test_result(linux_logs / "inibase-tests.log", 393),
        "apiTests": test_result(linux_logs / "api-tests.log", 1038),
        "standaloneBuiltServer": runtime,
        "nativeModules": natives,
        "builderNODE_OPTIONS": "--max-old-space-size=512",
        "sandbox": {"memoryMaxMiB": 300, "memorySwapMaxMiB": 768, "cpuQuotaPercent": 50, "liveDataInaccessible": True, "credentialsCleared": True},
    }
    artifact = {
        "status": "built-and-integrity-verified",
        "approvedForProduction": False,
        "filename": path.name,
        "bytes": path.stat().st_size,
        "sha256": a.artifact_sha256,
        "manifestSHA256": hashlib.sha256(manifest_bytes).hexdigest(),
        "payloadFileCount": len(manifest["files"]),
        "frontendFileCount": sum(name.startswith("frontend/") for name in manifest["files"]),
        "nodeVersion": manifest["nodeVersion"],
        "nodeModuleABI": manifest["nodeModuleABI"],
        "packageManager": manifest["packageManager"],
        "createdAt": manifest["createdAt"],
    }

local_tests = {
    repo: test_result(validation / filename, expected)
    for repo, filename, expected in (("inibase", "inibase-pinned-tests.log", 393), ("api", "api-tests.log", 1038), ("inicontent", "layer-pinned-tests.log", 209), ("saas", "saas-pinned-tests.log", 2))
}
types = {}
for repo, filename in (("api", "api-typecheck-final.log"), ("inicontent", "layer-typecheck-final.log"), ("saas", "saas-typecheck-final.log")):
    path = validation / filename
    count = len(re.findall(r"error TS\d+", path.read_text()))
    assert count > 0, "review typecheck status before changing this blocked manifest"
    types[repo] = {"status": "failed", "errors": count, "log": filename, "logSHA256": sha256(path)}

builds = {}
for name, filename, marker in (("apiMacOS", "api-build-macos-final.log", "Nitro Server built"), ("layerMacOS", "layer-build-final.log", "Build complete!"), ("saasStaticMacOS", "saas-generate-final.log", "Prerendered 12 routes")):
    path = validation / filename
    assert marker in path.read_text(), "missing successful build evidence: " + filename
    builds[name] = {"status": "passed", "log": filename, "logSHA256": sha256(path)}
mac_runtime_path = validation / "macos-runtime-final.json"
mac_runtime = json.loads(mac_runtime_path.read_text())
assert mac_runtime["status"] == "passed" and mac_runtime["release"] == pins["source"]["api"]["commit"][:12]
compatibility_path = validation / "compatibility-final.json"
compatibility = json.loads(compatibility_path.read_text())
assert compatibility["syntheticOnly"] and compatibility["differences"] == [{"direction": "new-write/old-read", "row": 7, "field": "label"}]

release = {
    "format": 1,
    "recordedAt": record["observedAt"],
    "decision": "NO-GO",
    "finalCutoverAuthorized": False,
    "localCandidateTag": "launch-paris-20261017-rc1",
    "target": {"displayName": "Europe (Paris)", "awsRegion": "eu-west-3", "registryCode": "main", "runtimeRegionID": "", "role": "main", "instanceID": "i-086846ce8cb3e18af", "apiURL": "https://api.inicontent.com", "additionalInstances": 0},
    "source": pins["source"],
    "lockfiles": pins["lockfiles"],
    "artifact": artifact,
    "linuxValidation": linux,
    "localTests": local_tests,
    "localBuilds": builds,
    "localBuiltServer": mac_runtime,
    "frontendStatic": {"sourcePins": {repo: pins["source"][repo]["commit"] for repo in ("inicontent", "saas")}, "files": len(pins["frontendFiles"]), "indexHTMLSHA256": pins["frontendFiles"]["index.html"], "dependencyScope": "Both committed locks retained; pinned sibling layer replaces published layer source during build."},
    "dataCompatibility": {"status": "blocked", "syntheticOnly": True, "probe": compatibility, "logSHA256": sha256(compatibility_path), "customerDataOpenedWithNewEngine": False},
    "typechecks": types,
    "dependencyAuditCounts": {repo: result["counts"] for repo, result in audits.items()},
    "backups": {
        "consistent": False, "restoreRehearsed": False, "legacyRollbackVerified": False, "durableKeyCustodyVerified": False, "ebsSnapshotsAccepted": False, "s3RecoveryAccepted": False,
        "copies": [
            {"filename": "production-databases.online-r2.tar.gz.enc", "sha256": "e9c0dd8a5b72de6a6cabf2773bae455cd778dcd81c57a72761e72522e5c72950", "archiveEntries": 4433, "tarExit": 0},
            {"filename": "legacy-runtime.online.tar.gz.enc", "sha256": "0fe66947153d4018f0858a22a6107d276057d5e7ec1c1ae8bc6bb363938a8880", "archiveEntries": 25377, "tarExit": 0},
        ],
    },
    "servingProductionUnchanged": {
        "apiIndexSHA256": "cfb6e488f0f07b5b93c09af8c0aa904380f4229e70d48f484fa26a481c855344",
        "sourceCommitKnown": False,
        "engineVersion": "3.2.0",
        "frontend": {"amplifyAppID": "d1c78msfpnlifg", "awsRegion": "eu-west-3", "branch": "main", "job": 68, "deployRepositoryCommit": "03b24395b431a1e814465989e8322e42e1489dce", "originalSaasLayerPinsVerified": False},
    },
    "unresolvedGates": [
        "CDN viewer authorization, private upload/legacy-key/cache revocation acceptance",
        "Reviewed instance role, credential dependency cutover, SMTP/PayPal rotation",
        "Consistent EBS/S3 recovery point, durable key custody, full isolated restore",
        "Production data compatibility and verified rollback writer contract (3.8 escaped strings differ under 3.2)",
        "API/layer/SaaS typecheck failures and dependency-vulnerability remediation/reachability",
        "Production browser/session/passkey/tenant-domain and frontend source provenance acceptance",
        "External cron/payment dependencies and effective PM2 job-freeze impact review",
        "M6 lifecycle, M8 cross-host journey, independent audit/alert custody, M10 scale/credit soak",
    ],
    "operationsNotPerformed": ["git push", "live activation", "customer data replacement/migration", "putLog enablement", "legacy asset-reference copy", "IAM/CDN/DNS changes", "secret rotation", "payment capture enablement"],
    "excludedUncommittedWork": "Engine seek/index/storage edits were preserved and excluded by explicit committed source pins.",
}

for name, value in (("MERGED_COMMITS.json", record), ("CHANGED_FILES.json", changed), ("SOURCE_REVISIONS.json", {"source": pins["source"], "lockfiles": pins["lockfiles"]}), ("DEPENDENCY_AUDIT.json", {"observedAt": record["observedAt"], "repositories": audits}), ("RELEASE_MANIFEST.json", release)):
    (output / name).write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n")
print(json.dumps({repo: {"incomingCommits": len(r["incomingCommits"]), "preparationCommits": len(r["preparationCommits"]), "changedSourceFiles": len(changed["sourceChanges"][repo]["files"])} for repo, r in record["repositories"].items()}, indent=2))
