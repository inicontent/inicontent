interface UseAssetPreviewOptions {
	assets?: Asset[];
	index?: number;
}

function filterPreviewAssets(assets: Asset[]): Asset[] {
	return assets.filter((asset) => asset.type !== "dir" && !!asset.publicURL);
}

export function useAssetPreview() {
	const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
	const currentPreviewAsset = useState<Asset | undefined>("currentPreviewAsset");
	const previewAssetList = useState<Asset[]>("previewAssetList", () => []);
	const previewAssetIndex = useState<number>("previewAssetIndex", () => 0);
	const previewImageRotation = useState<number>("previewImageRotation", () => 0);

	function openPreview(asset: Asset, options?: UseAssetPreviewOptions) {
		const assets = options?.assets?.length
			? filterPreviewAssets(options.assets)
			: [asset];
		if (!assets.length) return;

		const requestedIndex =
			typeof options?.index === "number"
				? options.index
				: assets.findIndex((value) => value.id === asset.id);
		const resolvedIndex = requestedIndex > -1 ? requestedIndex : 0;

		previewAssetList.value = assets;
		previewAssetIndex.value = resolvedIndex;
		currentPreviewAsset.value = assets[resolvedIndex];
		previewImageRotation.value = 0;
		Loading.value.previewModal = false;
	}

	function closePreview() {
		currentPreviewAsset.value = undefined;
		Loading.value.previewModal = false;
		previewImageRotation.value = 0;
	}

	function showPrevPreviewAsset() {
		if (!previewAssetList.value.length) return;
		previewAssetIndex.value =
			(previewAssetIndex.value - 1 + previewAssetList.value.length) %
			previewAssetList.value.length;
		currentPreviewAsset.value = previewAssetList.value[previewAssetIndex.value];
		previewImageRotation.value = 0;
	}

	function showNextPreviewAsset() {
		if (!previewAssetList.value.length) return;
		previewAssetIndex.value =
			(previewAssetIndex.value + 1) % previewAssetList.value.length;
		currentPreviewAsset.value = previewAssetList.value[previewAssetIndex.value];
		previewImageRotation.value = 0;
	}

	function rotatePreviewImageLeft() {
		previewImageRotation.value -= 90;
	}

	function rotatePreviewImageRight() {
		previewImageRotation.value += 90;
	}

	function resetPreviewImageRotation() {
		previewImageRotation.value = 0;
	}

	return {
		currentPreviewAsset,
		previewAssetList,
		previewAssetIndex,
		previewImageRotation,
		openPreview,
		closePreview,
		showPrevPreviewAsset,
		showNextPreviewAsset,
		rotatePreviewImageLeft,
		rotatePreviewImageRight,
		resetPreviewImageRotation,
	};
}
