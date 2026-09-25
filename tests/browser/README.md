# Offline browser checks

These checks use real IndexedDB and a real page reload, with a mocked API. Serve them on an isolated localhost origin: the harness clears its own origin's offline queue.

From the repository root:

```sh
mkdir -p /tmp/inicontent-offline-check
pnpm exec esbuild tests/browser/offline.ts --bundle --platform=browser --outfile=/tmp/inicontent-offline-check/test.js
cp tests/browser/index.html /tmp/inicontent-offline-check/index.html
python3 -m http.server 4318 --bind 127.0.0.1 --directory /tmp/inicontent-offline-check
```

Open http://127.0.0.1:4318. The page reloads itself once and prints `ALL BROWSER CHECKS PASSED` on success. Coverage includes atomic child creation, durable ID substitution (including parents saved later), manual reconnect behavior, schema failure blocking, reload persistence, edited retry, and discard continuation.

`pnpm test` runs the complementary ordering and reference-resolution unit tests.
