/**
 * Browser stand-in for `htmlnano`.
 *
 * `mjml-core` eagerly `require`s htmlnano for its optional `minify` feature
 * (used only when `options.minify` is truthy — it is off by default, and the
 * email editor never turns it on). htmlnano pulls in `cosmiconfig` →
 * `env-paths`, whose module body calls `os.homedir()` / `os.tmpdir()` and
 * destructures `process.env` at evaluation time. Those Node builtins have no
 * browser equivalent, so the entire lazily-loaded MJML chunk throws while it is
 * still being evaluated and every live preview silently falls back to the
 * "no preview" state.
 *
 * Aliasing htmlnano to this no-op keeps the MJML compile pipeline intact in the
 * browser and drops htmlnano + cosmiconfig + cssnano from the client bundle.
 */
export default {
	/**
	 * htmlnano API: `process(html, options) => Promise<{ html }>`.
	 * Returns the HTML untouched.
	 */
	async process(html) {
		return { html };
	},
};
