<template>
	<section class="cta-band" :class="[theme === 'light' ? 'cta-band-light' : 'cta-band-dark']">
		<div class="cta-container">
			<LazyBlockHeading v-if="hasHeading" v-model="modelValue" :design="1" />
			<div v-if="buttons.length" class="cta-buttons">
				<a v-for="(button, index) in buttons" :key="index" v-bind="linkAttrs(button.link)"
					:class="index === 0 ? 'cta-button cta-button-primary' : 'cta-button cta-button-secondary'">
					{{ button.label }}
				</a>
			</div>
		</div>
	</section>
</template>

<script lang="ts" setup>
const modelValue = defineModel<Cta>();
const { linkAttrs } = usePageLinks();

const hasHeading = computed(
	() =>
		!!modelValue.value?.heading ||
		!!modelValue.value?.preHeading ||
		!!modelValue.value?.preHeadingLink ||
		!!modelValue.value?.description,
);

const theme = computed(() => modelValue.value?.theme ?? "dark");
const buttons = computed(() => modelValue.value?.buttons ?? []);
</script>

<style scoped>
.cta-band {
	padding-block: 4.5rem;
	padding-inline: 1rem;
}

.cta-container {
	max-width: 52rem;
	margin-inline: auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
}

.cta-band-dark {
	background: radial-gradient(120% 160% at 50% 0%, #16203a 0%, #0b0f19 72%);
}

.cta-buttons {
	margin-top: 2.25rem;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 1rem;
}

.cta-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.8125rem 2rem;
	font-size: 0.9375rem;
	font-weight: 700;
	border-radius: 9999px;
	text-decoration: none;
	transition: opacity 200ms ease-in-out, background-color 200ms ease-in-out,
		border-color 200ms ease-in-out, color 200ms ease-in-out;
}

.cta-button-primary {
	color: #ffffff;
	background-color: rgb(var(--primaryColor));
}

.cta-button-primary:hover {
	opacity: 0.9;
}

.cta-button-secondary {
	color: #1f2937;
	background-color: #ffffff;
	border: 1px solid #e5e7eb;
}

.cta-button-secondary:hover {
	border-color: #d1d5db;
}

.cta-band-dark .cta-button-secondary {
	color: #111827;
}

@media (min-width: 640px) {
	.cta-band {
		padding-block: 6rem;
	}
}
</style>