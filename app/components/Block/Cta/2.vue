<template>
	<section class="cta-card-section">
		<div class="cta-card" :class="theme === 'light' ? 'cta-card-light' : 'cta-card-dark'">
			<div class="cta-card-content">
				<LazyBlockHeading v-if="hasHeading" v-model="modelValue" :design="1" />
			</div>
			<div v-if="buttons.length" class="cta-card-buttons">
				<a v-for="(button, index) in buttons" :key="index" v-bind="linkAttrs(button.link)"
					:class="index === 0 ? 'cta-button cta-button-primary' : 'cta-button cta-button-ghost'">
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
.cta-card-section {
	padding-block: 3.5rem;
	padding-inline: 1rem;
}

.cta-card {
	max-width: 78rem;
	margin-inline: auto;
	display: flex;
	flex-direction: column;
	gap: 2rem;
	align-items: flex-start;
	padding: 2.5rem;
	border-radius: 1.5rem;
	overflow: hidden;
}

@media (min-width: 820px) {
	.cta-card {
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		gap: 3rem;
		padding: 3.5rem;
	}

	.cta-card-content {
		max-width: 36rem;
	}

	.cta-card-buttons {
		flex-shrink: 0;
	}
}

.cta-card-dark {
	background: radial-gradient(130% 180% at 0% 0%, #16203a 0%, #0b0f19 75%);
	color: #ffffff;
}

.cta-card-light {
	background: rgba(255, 255, 255, 0.7);
	border: 1px solid #e5e7eb;
}

.dark .cta-card-light {
	background: rgba(255, 255, 255, 0.16);
	border: 1px solid #828282;
}

.cta-card-buttons {
	display: flex;
	flex-wrap: wrap;
	gap: 0.875rem;
}

.cta-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.75rem 1.75rem;
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

.cta-card-dark .cta-button-ghost {
	color: #e5e7eb;
	border: 1px solid rgba(255, 255, 255, 0.25);
}

.cta-card-dark .cta-button-ghost:hover {
	background-color: rgba(255, 255, 255, 0.08);
}

.dark .cta-card-light .cta-button-ghost {
	color: #ffffff;
	border: 1px solid #7e7e7e;
}

.dark .cta-card-light .cta-button-ghost:hover {
	color: #1f2937;
	background-color: #f9fafb;
}

.cta-card-light .cta-button-ghost {
	color: #1f2937;
	border: 1px solid #d1d5db;
}

.cta-card-light .cta-button-ghost:hover {
	background-color: #f9fafb;
}

.cta-card-light .cta-button-ghost {
	color: #1f2937;
	border: 1px solid #d1d5db;
}

.cta-card-light .cta-button-ghost:hover {
	background-color: #f9fafb;
}
</style>