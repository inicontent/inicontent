<template>
	<div class="centerCard">
		<NCard style="max-width: 300px;margin: auto;" >
			<NResult :description="t('platformFeatureIntro', { feature: t(feature) })">
				<template #icon>
					<NIcon :size="72" :color="ThemeConfig.primaryColor">
						<Icon :name="featureIcon" />
					</NIcon>
				</template>
				<template #default>
					<NFlex vertical :size="10" align="center" style="text-align: center;">
						<NText depth="3">{{ t("platformFeatureAt") }}</NText>
						<code class="platform-url">{{ platformHost }}</code>
						<NText depth="3">{{ t("platformFeatureHint") }}</NText>
					</NFlex>
				</template>
				<template #footer>
					<NButton type="primary" secondary round size="large" tag="a"
						:href="redirectUrl" target="_blank" rel="noopener">
						<template #icon>
							<NIcon>
								<Icon name="tabler:external-link" />
							</NIcon>
						</template>
						{{ t("openInPlatform") }}
					</NButton>
				</template>
			</NResult>
		</NCard>
	</div>
</template>

<script lang="ts" setup>
import type { PlatformFeature } from "~/composables/usePlatformRedirect";

const props = defineProps<{ feature: PlatformFeature }>();

const ThemeConfig = useState<ThemeConfig>("ThemeConfig", () => ({
	primaryColor: "#FF9800",
	primaryColorHover: "#F7A42A",
	primaryColorPressed: "#E19421",
	primaryColorSuppl: "#CB7900",
}));

const { platformHost, platformUrl } = usePlatformRedirect();

const featureIcons: Record<PlatformFeature, string> = {
	pages: "tabler:app-window",
	blocks: "tabler:tournament",
	templates: "tabler:template",
	billing: "tabler:credit-card",
};
const featureIcon = computed(() => featureIcons[props.feature]);
const redirectUrl = computed(() => platformUrl(props.feature));
</script>

<style scoped>
.platform-url {
	background-color: rgba(128, 128, 128, 0.12);
	border-radius: 6px;
	padding: 6px 12px;
	font-family: inherit;
	opacity: 0.9;
}
</style>