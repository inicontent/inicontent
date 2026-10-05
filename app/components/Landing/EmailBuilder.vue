<template>
    <section id="email-builder" class="section-block">
        <div class="container">
            <NCard class="email-builder-shell" :bordered="false">
                <NFlex vertical :size="20">
                    <NFlex align="center" justify="center" :size="8" class="email-builder-tag-row">
                        <NTag round size="large" type="info" class="email-builder-tag">{{
                            t("marketingLayout.emailBuilder")
                        }}</NTag>
                        <NTag round size="small" type="success" :bordered="false" class="email-builder-new-tag">{{ t("marketingLayout.newLabel") }}</NTag>
                    </NFlex>
                    <NText tag="h3" class="section-title email-builder-title">{{ t("homePageUi.emailBuilderTitle") }}</NText>
                    <NText depth="3" class="centered-text email-builder-subtitle">{{ t("homePageUi.emailBuilderSubtitle") }}</NText>
                    <NGrid x-gap="16" y-gap="16" cols="1 s:2 l:3" responsive="screen">
                        <NGi v-for="item in emailBuilderFeatures" :key="item.title">
                            <NCard class="email-builder-item" hoverable>
                                <NFlex vertical :size="8">
                                    <NText class="email-builder-icon">{{ item.icon }}</NText>
                                    <NText tag="h4" class="card-title">{{ item.title }}</NText>
                                    <NText depth="3">{{ item.text }}</NText>
                                </NFlex>
                            </NCard>
                        </NGi>
                    </NGrid>
                </NFlex>
            </NCard>
        </div>
    </section>
</template>

<script setup lang="ts">
const emailBuilderFeatures = computed(() => [
	{
		icon: "✉️",
		title: t("homePageUi.emailBuilderItems.mjmlTitle"),
		text: t("homePageUi.emailBuilderItems.mjmlText"),
	},
	{
		icon: "🧠",
		title: t("homePageUi.emailBuilderItems.variablesTitle"),
		text: t("homePageUi.emailBuilderItems.variablesText"),
	},
	{
		icon: "🔍",
		title: t("homePageUi.emailBuilderItems.previewTitle"),
		text: t("homePageUi.emailBuilderItems.previewText"),
	},
	{
		icon: "⚙️",
		title: t("homePageUi.emailBuilderItems.flowTitle"),
		text: t("homePageUi.emailBuilderItems.flowText"),
	},
	{
		icon: "🧪",
		title: t("homePageUi.emailBuilderItems.testTitle"),
		text: t("homePageUi.emailBuilderItems.testText"),
	},
	{
		icon: "📊",
		title: t("homePageUi.emailBuilderItems.meteredTitle"),
		text: t("homePageUi.emailBuilderItems.meteredText"),
	},
]);
</script>

<style scoped>
.section-block {
    padding: 2.2rem 0;
}

.section-title {
    text-align: center;
    font-size: clamp(1.45rem, 2.8vw, 2rem);
    font-weight: 750;
}

.centered-text {
    text-align: center;
}

.card-title {
    font-size: 1.1rem;
    font-weight: 700;
}

.email-builder-shell {
    background: linear-gradient(140deg, rgba(2, 132, 199, 0.09), rgba(14, 165, 233, 0.07));
    border: 1px solid rgba(2, 132, 199, 0.2);
    border-radius: 18px;
}

.email-builder-tag {
    align-self: center;
}

.email-builder-tag-row {
    align-self: center;
}

.email-builder-new-tag {
    font-weight: 700;
}

.email-builder-title,
.email-builder-subtitle {
    max-width: 860px;
    align-self: center;
}

.email-builder-item {
    height: 100%;
    border: 1px solid rgba(2, 132, 199, 0.2);
    background: rgba(255, 255, 255, 0.78);
}

.email-builder-icon {
    font-size: 1.5rem;
}

body.dark .email-builder-shell {
    background: linear-gradient(140deg, rgba(3, 105, 161, 0.24), rgba(30, 41, 59, 0.7));
    border: 1px solid rgba(125, 211, 252, 0.24);
}

body.dark .email-builder-item {
    background: rgba(15, 23, 42, 0.75);
    border: 1px solid rgba(125, 211, 252, 0.2);
}

body.dark .centered-text {
    color: #cbd5e1;
}
</style>