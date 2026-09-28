type PreviewDevice = "desktop" | "mobile" | "tablet" | "none";

export function usePreviewDevice() {
	const { isMobile, isTablet } = useDevice();

	return useState<PreviewDevice>("selectedDevice", () => {
		if (isMobile) return "mobile";
		if (isTablet) return "tablet";
		return "desktop";
	});
}
