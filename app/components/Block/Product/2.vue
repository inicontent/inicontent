<template>
	<section class="product-section">
		<div class="container">
			<LazyBlockHeading v-if="hasHeading" v-model="localModelValue" :design="1" />

			<div class="showcase">
				<div class="showcase-media">
					<video v-if="activeImage?.video" :src="activeImage.url" class="showcase-image" controls muted
						loop playsinline preload="metadata"></video>
					<img v-else-if="activeImage" :src="activeImage.url" :alt="product.title ?? ''" class="showcase-image"
						loading="eager" />
					<div v-else class="showcase-placeholder">
						<Icon name="tabler:shopping-bag" :size="56" />
					</div>
					<span v-if="product.badge" class="product-badge">{{ product.badge }}</span>
				</div>
				<div v-if="product.gallery && product.gallery.length > 1" class="showcase-thumbs">
					<button v-for="(img, index) in product.gallery" :key="index" type="button"
						class="thumb" :class="{ 'thumb-active': index === activeIndex }"
						@click="activeIndex = index">
						<span v-if="img.video" class="thumb-video">
							<Icon name="tabler:player-play" :size="18" />
						</span>
						<img v-else :src="img.url" :alt="`${product.title ?? ''} ${index + 1}`" class="thumb-image" />
					</button>
				</div>
			</div>

				<div class="showcase-body">
					<h1 v-if="product.title" class="product-title">{{ product.title }}</h1>
					<p v-if="product.tagline" class="product-tagline">{{ product.tagline }}</p>

					<div v-if="product.rating || product.reviews" class="product-rating" aria-label="Rating">
						<span v-if="product.rating" class="rating-badge">
							{{ formatRating(product.rating) }}
							<Icon name="tabler:star-filled" class="rating-star" :size="14" />
						</span>
						<span v-if="product.reviews" class="rating-reviews">
							{{ product.reviews }} {{ t('product.reviews') }}
						</span>
					</div>

					<div class="product-price">
						<span class="price-current">{{ localModelValue.currency }}{{ formatPrice(product.price) }}</span>
						<span v-if="product.oldPrice" class="price-old">{{ localModelValue.currency }}{{ formatPrice(product.oldPrice) }}</span>
					</div>

					<p v-if="product.description" class="product-description">{{ product.description }}</p>

					<ul v-if="specs.length" class="product-chips">
						<li v-for="(spec, index) in specs" :key="index" class="chip">
							<span class="chip-label">{{ spec.label }}</span>
							<span class="chip-value">{{ spec.value }}</span>
						</li>
					</ul>

					<div class="product-actions">
						<BlockProductQuantity v-if="localModelValue.showQuantity" v-model="quantity" />
						<a v-bind="linkAttrs(localModelValue.link)" class="buy-button">
							<Icon name="tabler:shopping-cart" :size="18" />
							<span>{{ localModelValue.buttonLabel || t('product.addToCart') }}</span>
						</a>
					</div>
				</div>
			</div>
		</section>
</template>

<script setup lang="ts">
import { useProduct } from "~/composables/useProduct";

const localModelValue = defineModel<Product>();
const database = useState<Database>("database");
const Language = useScopedCookie<LanguagesType>("language", database.value?.slug);
const { linkAttrs } = usePageLinks();

const hasHeading = computed(
	() =>
		!!localModelValue.value?.preHeading ||
		!!localModelValue.value?.preHeadingLink ||
		!!localModelValue.value?.heading ||
		!!localModelValue.value?.description,
);

const { product } = useProduct(localModelValue as Ref<Product>);

const quantity = ref(1);
const activeIndex = ref(0);
const specs = computed(() => localModelValue.value?.specs ?? []);

watch(
	() => product.value.gallery,
	() => {
		activeIndex.value = 0;
	},
);

const activeImage = computed(() => product.value.gallery?.[activeIndex.value]);

function formatPrice(value?: number): string {
	if (value === undefined || value === null) return "0";
	return new Intl.NumberFormat(Language.value ?? "en").format(value);
}

function formatRating(value?: number): string {
	if (value === undefined || value === null) return "";
	return new Intl.NumberFormat(Language.value ?? "en", {
		maximumFractionDigits: 1,
	}).format(value);
}
</script>

<style scoped>
.product-section {
	padding-block: 3rem;
	padding-inline: 1rem;
}

.container {
	max-width: 80rem;
	margin-inline: auto;
}

@container (min-width: 640px) {
	.product-section {
		padding-inline: 1.5rem;
	}
}

@container (min-width: 1024px) {
	.product-section {
		padding-inline: 2rem;
	}
}

.showcase {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	margin-top: 2rem;
}

.showcase-media {
	position: relative;
	width: 100%;
	max-width: 42rem;
	aspect-ratio: 16 / 10;
	border-radius: 1.25rem;
	overflow: hidden;
	background-color: #f3f4f6;
}

.dark .showcase-media {
	background-color: #27272a;
}

.showcase-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
}

.showcase-placeholder {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #9ca3af;
}

.dark .showcase-placeholder {
	color: #52525b;
}

.showcase-thumbs {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(5rem, 1fr));
	gap: 0.75rem;
	width: 100%;
	max-width: 42rem;
	margin-top: 0.75rem;
}

.thumb {
	padding: 0;
	border: 2px solid transparent;
	border-radius: 0.75rem;
	overflow: hidden;
	cursor: pointer;
	background: none;
	transition: border-color 150ms ease-in-out, opacity 150ms ease-in-out;
}

.thumb-active {
	border-color: rgb(var(--primaryColor));
}

.thumb:hover {
	opacity: 0.85;
}

.thumb-image {
	width: 100%;
	aspect-ratio: 16 / 10;
	object-fit: cover;
	display: block;
}

.thumb-video {
	width: 100%;
	aspect-ratio: 16 / 10;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #ffffff;
	background-color: #1f2937;
	background-image: linear-gradient(135deg, #374151, #111827);
}

.product-badge {
	position: absolute;
	top: 1rem;
	inset-inline-start: 1rem;
	padding: 0.375rem 0.75rem;
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	color: #ffffff;
	background-color: rgb(var(--primaryColor));
	border-radius: 9999px;
}

.showcase-body {
	max-width: 44rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 2rem;
}

.product-title {
	margin: 0;
	font-size: 2.25rem;
	line-height: 2.5rem;
	font-weight: 700;
	color: #1f2937;
}

.dark .product-title {
	color: #e5e7eb;
}

@container (min-width: 640px) {
	.product-title {
		font-size: 2.75rem;
		line-height: 3rem;
	}
}

.product-tagline {
	margin: 0.75rem 0 0;
	font-size: 1.125rem;
	color: #6b7280;
}

.dark .product-tagline {
	color: #9ca3af;
}

.product-rating {
	margin-top: 1rem;
	display: inline-flex;
	align-items: center;
	gap: 0.625rem;
	font-size: 0.9375rem;
}

.rating-badge {
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	padding: 0.25rem 0.625rem;
	font-weight: 700;
	color: #1f2937;
	background-color: #fef3c7;
	border-radius: 9999px;
}

.dark .rating-badge {
	color: #fde68a;
	background-color: rgba(180, 83, 9, 0.35);
}

.rating-star {
	color: #f59e0b;
}

.rating-reviews {
	font-weight: 500;
	color: #9ca3af;
}

.dark .rating-reviews {
	color: #71717a;
}

.product-price {
	display: flex;
	align-items: baseline;
	gap: 0.75rem;
	margin-top: 1rem;
}

.price-current {
	font-size: 1.875rem;
	font-weight: 700;
	color: #1f2937;
}

.dark .price-current {
	color: #e5e7eb;
}

.price-old {
	font-size: 1.125rem;
	font-weight: 500;
	text-decoration: line-through;
	color: #9ca3af;
}

.dark .price-old {
	color: #71717a;
}

.product-description {
	margin: 1.25rem 0 0;
	max-width: 40rem;
	font-size: 1.0625rem;
	line-height: 1.75;
	color: #4b5563;
}

.dark .product-description {
	color: #9ca3af;
}

.product-chips {
	margin: 1.5rem 0 0;
	padding: 0;
	list-style: none;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 0.625rem;
}

.chip {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 0.875rem;
	background-color: #ffffff;
	border: 1px solid #e5e7eb;
	border-radius: 9999px;
}

.dark .chip {
	background-color: #1f1f1f;
	border-color: #374151;
}

.chip-label {
	font-size: 0.8125rem;
	font-weight: 500;
	color: #9ca3af;
}

.dark .chip-label {
	color: #71717a;
}

.chip-value {
	font-size: 0.8125rem;
	font-weight: 700;
	color: #1f2937;
}

.dark .chip-value {
	color: #e5e7eb;
}

.product-actions {
	margin-top: 2rem;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	flex-wrap: wrap;
}

.buy-button {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1.75rem;
	font-size: 0.9375rem;
	font-weight: 600;
	color: #ffffff;
	background-color: rgb(var(--primaryColor));
	border-radius: 9999px;
	text-decoration: none;
	transition: opacity 200ms ease-in-out;
}

.buy-button:hover {
	opacity: 0.9;
}
</style>