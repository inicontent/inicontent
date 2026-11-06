/**
 * Ambient declarations for installed JavaScript packages that ship no
 * TypeScript types of their own. Only the exact API surface the app uses is
 * declared — this is a types-only gap (the packages are plain JS), not a
 * stand-in for missing runtime code.
 */

declare module "mjml" {
	interface MjmlError {
		message?: string;
		line?: number;
		formattedMessage?: string;
	}
	interface MjmlRenderResult {
		html: string;
		errors?: MjmlError[];
	}
	/** Compile an MJML document to HTML (mjml 5). */
	function mjml(
		content: string,
		options?: Record<string, unknown>,
	): MjmlRenderResult;
	export default mjml;
}

declare module "jscanify/client" {
	/**
	 * Browser build of jscanify. Instances are held behind the loosely-typed
	 * `scanner` ref in `useScanner`, so only the constructor needs declaring
	 * here (enough for `module.default ?? module` to resolve to a constructable
	 * value).
	 */
	class JScanify {
		constructor();
		findPaperContour(image: HTMLCanvasElement | HTMLImageElement): unknown;
		getCornerPoints(contour: unknown): unknown;
	}
	export default JScanify;
}
