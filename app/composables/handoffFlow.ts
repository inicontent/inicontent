/**
 * B2 — the pure decision layer for the destination-initiated handoff.
 *
 * `sid-ingest.global.ts` wires Nuxt (cookies, `$fetch`, `navigateTo`) to the
 * plan this returns. Keeping the decision here — free of Nuxt and of the DOM —
 * is what makes the whole flow (initiate / mint / redeem / strip) unit
 * testable off-browser.
 */
import {
	HANDOFF_CHALLENGE_PARAM,
	HANDOFF_INIT_PARAM,
	HANDOFF_PLATFORM_CODE_PARAM,
	HANDOFF_STATE_PARAM,
	HANDOFF_TO_PARAM,
	handoffCodeParams,
	isHandoffChallenge,
	isPlatformHandoffOrigin,
} from "./handoffVerifier.ts";

export interface HandoffCodeRef {
	/** Query key the code will be stored under (`{db}_handoff`). */
	key: string;
	/** Database the code is redeemed against. */
	slug: string;
}

export interface HandoffRedeemCode extends HandoffCodeRef {
	code: string;
}

export type HandoffPlan =
	| {
			/** Destination: codes are present, redeem them with the local verifier. */
			kind: "redeem";
			codes: HandoffRedeemCode[];
			state: string;
	  }
	| {
			/** Source: the destination sent a challenge, mint codes and return. */
			kind: "mint";
			destination: string;
			challenge: string;
			state?: string;
			to: string;
			codes: HandoffCodeRef[];
	  }
	| {
			/** Destination: the source asked to start a handoff; generate the verifier. */
			kind: "initiate";
			source: string;
	  }
	| {
			/** A malformed/foreign handshake: drop the parameters and continue. */
			kind: "strip";
	  }
	| { kind: "none" };

export interface HandoffPlanContext {
	databaseSlug: string;
	/** Resolved destination origin (`scheme://host`), or null for a bad slug. */
	destinationOrigin: string | null;
	/** The origin the plan is evaluated on (the current window). */
	currentOrigin: string;
	/** Whether this origin already holds the sessions a handoff would deliver. */
	destinationSignedIn: boolean;
}

function param(
	query: Record<string, unknown>,
	key: string,
): string | undefined {
	const value = query[key];
	return typeof value === "string" && value ? value : undefined;
}

function slugForCode(key: string, databaseSlug: string): string {
	return key === HANDOFF_PLATFORM_CODE_PARAM ? "inicontent" : databaseSlug;
}

/**
 * Decide what a navigation carrying handoff parameters should do. Precedence is
 * redeem → mint → initiate so a returning code is never re-interpreted as the
 * start of a new handoff.
 */
export function planHandoff(
	query: Record<string, unknown>,
	ctx: HandoffPlanContext,
): HandoffPlan {
	const codeKeys = handoffCodeParams(ctx.databaseSlug).filter((key) =>
		param(query, key),
	);
	if (codeKeys.length) {
		return {
			kind: "redeem",
			codes: codeKeys.map((key) => ({
				key,
				slug: slugForCode(key, ctx.databaseSlug),
				code: param(query, key) as string,
			})),
			state: param(query, HANDOFF_STATE_PARAM) ?? "",
		};
	}

	const challenge = param(query, HANDOFF_CHALLENGE_PARAM);
	const to = param(query, HANDOFF_TO_PARAM);
	if (challenge || to) {
		if (challenge && to && isHandoffChallenge(challenge)) {
			let target: URL | null = null;
			try {
				target = new URL(to);
			} catch {
				target = null;
			}
			if (
				target &&
				ctx.destinationOrigin &&
				target.origin === ctx.destinationOrigin
			) {
				return {
					kind: "mint",
					destination: target.origin,
					challenge,
					state: param(query, HANDOFF_STATE_PARAM),
					to,
					codes: handoffCodeParams(ctx.databaseSlug).map((key) => ({
						key,
						slug: slugForCode(key, ctx.databaseSlug),
					})),
				};
			}
		}
		return { kind: "strip" };
	}

	const init = param(query, HANDOFF_INIT_PARAM);
	if (init) {
		let source: URL | null = null;
		try {
			source = new URL(init);
		} catch {
			source = null;
		}
		if (
			source &&
			isPlatformHandoffOrigin(source.origin) &&
			source.origin !== ctx.currentOrigin &&
			!ctx.destinationSignedIn
		) {
			return { kind: "initiate", source: init };
		}
		return { kind: "strip" };
	}

	return { kind: "none" };
}
