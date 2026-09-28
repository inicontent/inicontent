type SectionHandle = {
	isLoaded: () => boolean;
	forceLoad: () => void;
};

// Sections below the fold are mounted lazily (see OnVisible). When the user
// clicks a nav anchor that targets such a section, `OnVisible` hasn't loaded it
// yet, so `document.getElementById(id)` would return nothing. These helpers let
// OnVisible register itself and let anchor click handlers force the section to
// mount before scrolling to it.
const sections = new Map<string, SectionHandle>();

export function registerLazySection(id: string, handle: SectionHandle) {
	if (!id) return () => {};
	sections.set(id, handle);
	return () => sections.delete(id);
}

export function forceLoadLazySection(id: string) {
	const handle = sections.get(id);
	if (!handle || handle.isLoaded()) return Promise.resolve();
	handle.forceLoad();
	return Promise.resolve();
}

export async function scrollToSectionById(id: string) {
	await forceLoadLazySection(id);
	// Give Vue a tick to mount the freshly-loaded section before scrolling.
	await nextTick();
	const element = document.getElementById(id);
	if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
}
