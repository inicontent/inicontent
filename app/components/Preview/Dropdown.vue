<template>
	<NPopselect trigger="click" :options="deviceDropdownOptions" v-model:value="selectedDevice">
		<NTooltip :delay="1500">
			<template #trigger>
				<NButton round>
					<template #icon>
						<NIcon>
							<Icon name="tabler:devices" v-if="!selectedDevice" />
							<Icon name="tabler:device-desktop" v-else-if="selectedDevice === 'desktop'" />
							<Icon name="tabler:device-tablet" v-else-if="selectedDevice === 'tablet'" />
							<Icon name="tabler:device-mobile" v-else-if="selectedDevice === 'mobile'" />
							<Icon name="tabler:devices-off" v-else />
						</NIcon>
					</template>
				</NButton>
			</template>
			{{ t("device") }}
		</NTooltip>
	</NPopselect>
</template>

<script lang="ts" setup>
import { Icon, NFlex, NIcon } from "#components";

const { showHide } = defineProps<{ showHide?: boolean }>();

const selectedDevice = usePreviewDevice();

const deviceDropdownOptions = [
	{
		label: () =>
			h(NFlex, { align: "center" }, () => [
				h(NIcon, () => h(Icon, { name: "tabler:device-desktop" })),
				t("desktop"),
			]),
		value: "desktop",
	},
	{
		label: () =>
			h(NFlex, { align: "center" }, () => [
				h(NIcon, () => h(Icon, { name: "tabler:device-tablet" })),
				t("tablet"),
			]),
		value: "tablet",
	},
	{
		label: () =>
			h(NFlex, { align: "center" }, () => [
				h(NIcon, () => h(Icon, { name: "tabler:device-mobile" })),
				t("mobile"),
			]),
		value: "mobile",
	},
	{
		label: () =>
			h(NFlex, { align: "center" }, () => [
				h(NIcon, () => h(Icon, { name: "tabler:devices-off" })),
				t("hidePreview"),
			]),
		value: "none",
		style: !showHide ? "display:none" : "",
	},
];
</script>
