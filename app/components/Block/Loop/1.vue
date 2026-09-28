<template>
	<div class="loop-container">
		<LazyBlockHeading v-if="hasHeading" v-model="modelValue" :design="1" />
		<div v-if="showTagFilter && tags?.length > 1" class="tags-filter">
			<button @click="emit('update:activeTag', null)"
				:class="['tags-filter-btn', { active: !activeTag }]">
				{{ t("loop.allTags") }}
			</button>
			<button v-for="tag in tags" :key="tag"
				@click="emit('update:activeTag', activeTag === tag ? null : tag)"
				:class="['tags-filter-btn', { active: activeTag === tag }]">
				{{ tag }}
			</button>
		</div>
		<div v-if="cards?.length" class="cards-grid">
			<component v-for="(card, index) in cards" :key="card.id || index"
				:is="card.link && !modelValue?.label ? 'a' : 'div'"
				v-bind="card.link && !modelValue?.label ? linkAttrs(card.link) : {}"
				:class="['card', { 'is-clickable': card.link && !modelValue?.label }]">
				<div v-if="card.image" class="card-media">
					<video v-if="card.imageIsVideo" :src="card.image" class="card-image" muted loop playsinline
						preload="metadata"></video>
					<img v-else :src="card.image" :alt="card.title ?? ''" class="card-image" loading="lazy" />
				</div>
				<div class="card-body">
					<p v-if="card.cardHeader" class="card-header">{{ card.cardHeader }}</p>
					<p v-if="card.tag" class="card-tag">{{ card.tag }}</p>
					<h3 class="card-title">{{ card.title }}</h3>
					<p v-if="card.subtitle" class="card-subtitle">{{ card.subtitle }}</p>
					<p v-if="card.meta" class="card-meta">{{ card.meta }}</p>
					<p v-if="card.description" class="card-description">{{ card.description }}</p>
					<a v-if="modelValue?.label && card.link" v-bind="linkAttrs(card.link)" class="card-button"
						@click.stop>
						<span>{{ modelValue.label }}</span>
						<svg class="card-button-arrow" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
							viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
							stroke-linecap="round" stroke-linejoin="round">
							<path d="m9 18 6-6-6-6" />
						</svg>
					</a>
				</div>
			</component>
		</div>
	</div>
</template>

<script lang="ts" setup>
const modelValue = defineModel<Loop>();
const { linkAttrs } = usePageLinks();
const { cards, tags, activeTag, showTagFilter } = defineProps<{
	cards?: LoopCard[];
	tags?: string[];
	activeTag?: string | null;
	showTagFilter?: boolean;
}>();
const emit = defineEmits<{ "update:activeTag": [value: string | null] }>();

const hasHeading = computed(
	() =>
		!!modelValue.value?.heading ||
		!!modelValue.value?.preHeading ||
		!!modelValue.value?.preHeadingLink ||
		!!modelValue.value?.description,
);
</script>

<style scoped>
.loop-container {
	max-width: 85rem;
	margin-inline: auto;
	padding: 0 1rem 2.5rem;
}

@container (min-width: 640px) {
	.loop-container {
		padding-inline: 1.5rem;
	}
}

@container (min-width: 1024px) {
	.loop-container {
		padding-inline: 2rem;
	}
}

.cards-grid {
	display: grid;
	gap: 1.5rem;
	grid-template-columns: 1fr;
	margin-top: 2rem;
}

@container (min-width: 640px) {
	.cards-grid {
		grid-template-columns: repeat(2, 1fr);
	}
}

@container (min-width: 1024px) {
	.cards-grid {
		grid-template-columns: repeat(3, 1fr);
	}
}

.card {
	display: flex;
	flex-direction: column;
	background-color: #ffffff;
	border: 1px solid #e5e7eb;
	border-radius: 0.75rem;
	overflow: hidden;
	transition: transform 200ms ease-in-out, box-shadow 200ms ease-in-out;
}

.dark .card {
	background-color: #1f1f1f;
	border-color: #374151;
}

.card:hover {
	transform: translateY(-0.25rem);
	box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
		0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.card-media {
	aspect-ratio: 16 / 10;
	overflow: hidden;
	background-color: #f3f4f6;
}

.dark .card-media {
	background-color: #27272a;
}

.card-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
}

.card-body {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	padding: 1.25rem;
	flex: 1;
}

.card-title,
.card-subtitle,
.card-meta,
.card-description {
	margin: 0;
	color: #1f2937;
}

.dark .card-title,
.dark .card-subtitle,
.dark .card-meta,
.dark .card-description {
	color: #e5e7eb;
}

.card-tag {
	margin: 0 0 0.5rem;
	display: inline-block;
	padding: 0.25rem 0.625rem;
	font-size: 0.6875rem;
	font-weight: 700;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	color: rgb(var(--primaryColor));
	background-color: rgba(var(--primaryColor), 0.1);
	border-radius: 9999px;
}

.card-title {
	font-size: 1.125rem;
	font-weight: 700;
}

.card-subtitle {
	margin-top: 0.375rem;
	font-size: 0.875rem;
	font-weight: 600;
	color: rgb(var(--primaryColor));
}

.dark .card-subtitle {
	color: rgb(var(--primaryColor));
}

.card-meta {
	margin-top: 0.25rem;
	font-size: 0.8125rem;
	font-weight: 600;
	color: #6b7280;
}

.dark .card-meta {
	color: #9ca3af;
}

.card-description {
	margin-top: 0.5rem;
	font-size: 0.875rem;
	line-height: 1.5;
	color: #6b7280;
}

.dark .card-description {
	color: #9ca3af;
}

.card-button {
	margin-top: 1rem;
	display: inline-flex;
	align-items: center;
	gap: 0.375rem;
	padding: 0.5rem 1rem;
	font-size: 0.875rem;
	font-weight: 600;
	color: #ffffff;
	background-color: rgb(var(--primaryColor));
	border-radius: 9999px;
	text-decoration: none;
	transition: opacity 200ms ease-in-out;
}

.card-button:hover {
	opacity: 0.9;
}

.card.is-clickable {
	cursor: pointer;
	text-decoration: none;
	color: inherit;
}

.card.is-clickable:hover {
	text-decoration: none;
}

.card-header {
	margin: 0 0 0.5rem;
	font-size: 0.9375rem;
	font-weight: 600;
	color: rgb(var(--primaryColor));
}

.dark .card-header {
	color: rgb(var(--primaryColor));
}

.tags-filter {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin-top: 1.5rem;
	justify-content: center;
}

.tags-filter-btn {
	font-family: inherit;
	padding: 0.375rem 0.875rem;
	font-size: 0.8125rem;
	font-weight: 600;
	color: #6b7280;
	background-color: transparent;
	border: 1px solid #e5e7eb;
	border-radius: 9999px;
	cursor: pointer;
	transition: all 150ms ease-in-out;
}

.dark .tags-filter-btn {
	color: #9ca3af;
	border-color: #374151;
}

.tags-filter-btn:hover {
	color: rgb(var(--primaryColor));
	border-color: rgb(var(--primaryColor));
}

.tags-filter-btn.active {
	color: #ffffff;
	background-color: rgb(var(--primaryColor));
	border-color: rgb(var(--primaryColor));
}

.card-button-arrow {
	flex-shrink: 0;
	transition: transform 200ms ease-in-out;
}

.rtl .card-button-arrow {
	transform: scaleX(-1);
}

.card:hover .card-button-arrow,
.card:focus-within .card-button-arrow {
	transform: translateX(0.25rem);
}

.rtl .card:hover .card-button-arrow,
.rtl .card:focus-within .card-button-arrow {
	transform: scaleX(-1) translateX(-0.25rem);
}
</style>