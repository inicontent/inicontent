/**
 * B2 handoff — real-browser origin-isolation checks.
 *
 * The unit tests prove the flow logic; this harness proves the property the
 * security review asked about in an actual browser: a verifier written by the
 * destination is only readable on the destination's own origin. A sibling
 * origin that knows the *state* (and therefore the intercepted code, since both
 * travel in the redirect URL) still cannot read the verifier, so it cannot
 * redeem.
 *
 * The harness runs two origins. Serve the built files on two ports and open the
 * main page with `?child=<other origin>`, e.g.
 *
 *   http://127.0.0.1:4319/handoff.html?child=http://127.0.0.1:4320
 *
 * See tests/browser/README.md. Without `?child=` the cross-origin checks are
 * skipped and a warning is printed.
 */
import {
	clearHandoffVerifier,
	createHandoffPkce,
	HANDOFF_VERIFIER_TTL_MS,
	handoffVerifierStorageKey,
	newHandoffState,
	readHandoffVerifier,
	storeHandoffVerifier,
} from "../../app/composables/handoffVerifier";

const params = new URLSearchParams(location.search);
const verifierOf = (seed: string) => seed.repeat(43).slice(0, 43);

function report(checks: Array<[string, boolean]>, note?: string) {
	const failed = checks.filter(([, ok]) => !ok);
	for (const [name, ok] of checks) {
		const line = document.createElement("p");
		line.textContent = `${ok ? "PASS" : "FAIL"} — ${name}`;
		line.style.color = ok ? "green" : "red";
		document.body.appendChild(line);
	}
	const summary = document.createElement("p");
	summary.textContent = failed.length
		? `HANDOFF BROWSER CHECKS FAILED (${failed.length}/${checks.length})`
		: note
			? `ALL HANDOFF BROWSER CHECKS PASSED (${checks.length}; ${note})`
			: `ALL HANDOFF BROWSER CHECKS PASSED (${checks.length})`;
	document.body.appendChild(summary);
}

/** The sibling origin: it reports what it can see and writes its own verifier. */
function runChild() {
	const parentState = params.get("parentState") ?? "";
	const childState = params.get("childState") ?? "";
	// The "attacker" knows the intercepted state/code but not the verifier.
	const canReadParent = readHandoffVerifier(parentState) !== null;
	if (childState) {
		storeHandoffVerifier(childState, {
			verifier: verifierOf("c"),
			destination: location.origin,
			to: location.origin,
		});
	}
	// Even after writing its own, it still cannot see the parent's.
	const canReadParentAfterWrite = readHandoffVerifier(parentState) !== null;
	(window.parent ?? window).postMessage(
		{
			type: "inicontent-handoff-isolation",
			canReadParent,
			canReadParentAfterWrite,
			childState,
			childOrigin: location.origin,
		},
		"*",
	);
	report([["child origin booted", true]], "child");
}

function probeChild(
	childOrigin: string,
	parentState: string,
	childState: string,
): Promise<{ canReadParent: boolean; canReadParentAfterWrite: boolean }> {
	return new Promise((resolve, reject) => {
		const frame = document.createElement("iframe");
		frame.style.display = "none";
		const url = new URL("/handoff.html", childOrigin);
		url.searchParams.set("mode", "child");
		url.searchParams.set("parentState", parentState);
		url.searchParams.set("childState", childState);
		const timer = setTimeout(
			() => reject(new Error("child probe timed out")),
			10000,
		);
		window.addEventListener("message", function onMessage(event: MessageEvent) {
			const data = event.data as { type?: string } | null;
			if (data?.type !== "inicontent-handoff-isolation") return;
			if (event.origin !== childOrigin) return;
			clearTimeout(timer);
			window.removeEventListener("message", onMessage);
			resolve(
				data as { canReadParent: boolean; canReadParentAfterWrite: boolean },
			);
		});
		frame.src = url.toString();
		document.body.appendChild(frame);
	});
}

async function runMain() {
	const checks: Array<[string, boolean]> = [];
	const destination = location.origin;

	const state = newHandoffState();
	storeHandoffVerifier(state, {
		verifier: verifierOf("a"),
		destination,
		to: destination,
	});
	checks.push([
		"a verifier is stored and read back by state",
		readHandoffVerifier(state)?.verifier === verifierOf("a"),
	]);
	clearHandoffVerifier(state);
	checks.push([
		"cleared verifier reads as absent",
		readHandoffVerifier(state) === null,
	]);
	checks.push([
		"cleared verifier is removed from storage",
		sessionStorage.getItem(handoffVerifierStorageKey(state)) === null,
	]);

	const expired = newHandoffState();
	sessionStorage.setItem(
		handoffVerifierStorageKey(expired),
		JSON.stringify({
			verifier: verifierOf("b"),
			destination,
			to: destination,
			createdAt: Date.now() - HANDOFF_VERIFIER_TTL_MS - 1,
		}),
	);
	checks.push([
		"an expired verifier reads as absent",
		readHandoffVerifier(expired) === null,
	]);
	checks.push([
		"an expired verifier is swept on read",
		sessionStorage.getItem(handoffVerifierStorageKey(expired)) === null,
	]);

	const { verifier, challenge } = await createHandoffPkce();
	checks.push([
		"a challenge is a 43-char base64url digest",
		challenge.length === 43 && /^[A-Za-z0-9_-]+$/.test(challenge),
	]);
	checks.push(["verifier and challenge differ", verifier !== challenge]);

	const childOrigin = params.get("child");
	let note: string | undefined;
	if (childOrigin) {
		const isolationState = newHandoffState();
		const childState = newHandoffState();
		storeHandoffVerifier(isolationState, {
			verifier: verifierOf("d"),
			destination,
			to: destination,
		});
		const result = await probeChild(childOrigin, isolationState, childState);
		checks.push([
			"a sibling origin cannot read this origin's verifier (intercepted code is useless)",
			result.canReadParent === false,
		]);
		checks.push([
			"the sibling still cannot read it after writing its own",
			result.canReadParentAfterWrite === false,
		]);
		checks.push([
			"this origin can still read its own verifier",
			readHandoffVerifier(isolationState)?.verifier === verifierOf("d"),
		]);
		checks.push([
			"this origin cannot read the sibling's verifier",
			readHandoffVerifier(childState) === null,
		]);
	} else {
		note = "cross-origin checks skipped; pass ?child=<other origin>";
		console.warn("No ?child= origin: skipping cross-origin isolation checks.");
	}

	report(checks, note);
}

if (params.get("mode") === "child") runChild();
else runMain();
