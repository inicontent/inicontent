# Browser persistence containment checks

Run on a fresh, isolated localhost origin only. The harness replaces synthetic IndexedDB/cache fixtures on its own origin. Never serve it on an application origin containing real drafts.

From the repository root, after installing the locked dependencies:

```sh
mkdir -p /tmp/inicontent-containment-check/_nuxt
node_modules/.pnpm/esbuild@0.28.2/node_modules/esbuild/bin/esbuild tests/browser/containment.ts --bundle --platform=browser --outfile=/tmp/inicontent-containment-check/_nuxt/test.js
node_modules/.pnpm/esbuild@0.28.2/node_modules/esbuild/bin/esbuild tests/browser/containment-startup.ts --bundle --platform=browser --define:import.meta.dev=false --outfile=/tmp/inicontent-containment-check/_nuxt/startup.js
cp tests/browser/index.html /tmp/inicontent-containment-check/index.html
cp public/inicontent-containment-v1.js /tmp/inicontent-containment-check/
cat > /tmp/inicontent-containment-check/sw.js <<'JS'
importScripts('/inicontent-containment-v1.js');
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
JS
cat > /tmp/inicontent-containment-check/startup.html <<'HTML'
<!doctype html><html><head><title>Containment startup checks</title></head><body><h1>Containment startup checks</h1><script src="/_nuxt/startup.js"></script></body></html>
HTML
python3 tests/browser/server.py --directory /tmp/inicontent-containment-check --port 4319
```

Open `http://127.0.0.1:4319/`. It reloads once and prints `ALL CONTAINMENT BROWSER CHECKS PASSED`. Then open `/startup.html`; expect `STARTUP PLUGIN CHECKS PASSED`.

Coverage: real IndexedDB upgrades blocked by old connections, preservation of a late legacy draft, atomic quarantine and resolved-ID preservation, old-version rejection, cached URL metadata/thumbnail purge, safe shell/preferences retained, repeatable cleanup, quarantine survives reload, normal readers/replay/discard disabled, stale worker clients denied, updated clients use network-only requests. The startup harness imports the actual Nuxt plugin with mocked Nuxt state and tests its gate, migration, notice state, no-store defaults and worker handshake.

Use a new port for a fresh fixture run. This harness uses synthetic API responses and a minimal worker wrapper; production Workbox output is additionally checked by builds. Deployed proxy/CDN, real login/logout across tabs and supported-browser coverage remain release checks. `pnpm test` covers the complementary application contracts.

## Handoff origin-isolation checks

`handoff.html` / `handoff.ts` prove, in a real browser, the property the B2 review asked about: a handoff PKCE verifier written by the destination is readable only on the destination's own origin. A sibling origin that knows the flow `state` (and therefore an intercepted code, since both travel in the redirect URL) still cannot read the verifier, so it cannot redeem.

Two origins are required. Build once and serve the same directory on two ports:

```sh
mkdir -p /tmp/inicontent-handoff-check/_nuxt
ESBUILD=$(ls node_modules/.pnpm/esbuild@*/node_modules/esbuild/bin/esbuild | head -1)
"$ESBUILD" tests/browser/handoff.ts --bundle --platform=browser --define:import.meta.dev=false --outfile=/tmp/inicontent-handoff-check/_nuxt/handoff.js
cp tests/browser/handoff.html /tmp/inicontent-handoff-check/handoff.html
python3 tests/browser/server.py --directory /tmp/inicontent-handoff-check --port 4319 &
python3 tests/browser/server.py --directory /tmp/inicontent-handoff-check --port 4320 &
```

Open `http://127.0.0.1:4319/handoff.html?child=http://127.0.0.1:4320`. The page loads the second origin in a hidden iframe and prints `ALL HANDOFF BROWSER CHECKS PASSED`. Without `?child=` the in-origin checks still run (store/read/clear, TTL sweep, PKCE shape) and the cross-origin checks are skipped with a warning.

Coverage: verifier store/read/clear by state, expired-verifier sweep on read, challenge shape, and cross-origin isolation in both directions (the sibling cannot read this origin's verifier even after writing its own; this origin cannot read the sibling's). This harness is browser-enforced, so it is not part of `pnpm test`; `tests/handoff-redirect.test.ts` and `tests/handoff-flow.test.ts` cover the same contract headlessly.
