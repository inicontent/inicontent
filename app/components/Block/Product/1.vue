<template>
	<section class="product-section">
		<div class="container">
			<LazyBlockHeading v-if="hasHeading" v-model="localModelValue" :design="1" />

			<div class="product-layout">
				<div class="gallery">
					<div class="gallery-main">
						<video v-if="activeImage?.video" :src="activeImage.url" class="gallery-image" controls muted
							loop playsinline preload="metadata"></video>
						<img v-else-if="activeImage" :src="activeImage.url" :alt="product.title ?? ''"
							class="gallery-image" loading="eager" />
						<div v-else class="gallery-placeholder">
							<Icon name="tabler:shopping-bag" :size="56" />
						</div>
						<span v-if="product.badge" class="product-badge">{{ product.badge }}</span>
					</div>
					<div v-if="product.gallery && product.gallery.length > 1" class="gallery-thumbs">
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

				<div class="details">
					<h1 v-if="product.title" class="product-title">{{ product.title }}</h1>
					<p v-if="product.tagline" class="product-tagline">{{ product.tagline }}</p>

					<div v-if="product.rating" class="product-rating" aria-label="Rating">
						<Icon name="tabler:star-filled" class="rating-star" :size="16" />
						<span class="rating-value">{{ formatRating(product.rating) }}</span>
						<span v-if="product.reviews" class="rating-reviews">
							({{ product.reviews }} {{ t('product.reviews') }})
						</span>
					</div>

					<div class="product-price">
						<span class="price-current">{{ localModelValue.currency }}{{ formatPrice(product.price) }}</span>
						<span v-if="product.oldPrice" class="price-old">{{ localModelValue.currency }}{{ formatPrice(product.oldPrice) }}</span>
						<span v-if="product.oldPrice" class="price-save">
							{{ t('product.youSave') }} {{ localModelValue.currency }}{{ formatPrice(savings) }}
						</span>
					</div>

					<p v-if="product.description" class="product-description">{{ product.description }}</p>

					<dl v-if="specs.length" class="product-specs">
						<div v-for="(spec, index) in specs" :key="index" class="spec-row">
							<dt>{{ spec.label }}</dt>
							<dd>{{ spec.value }}</dd>
						</div>
					</dl>

					<div class="product-actions">
						<BlockProductQuantity v-if="localModelValue.showQuantity" v-model="quantity" />
						<a v-bind="linkAttrs(localModelValue.link)" class="buy-button">
							<Icon name="tabler:shopping-cart" :size="18" />
							<span>{{ localModelValue.buttonLabel || t('product.addToCart') }}</span>
						</a>
					</div>
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

const activeIndex = ref(0);
const quantity = ref(1);

watch(
	() => product.value.gallery,
	() => {
		activeIndex.value = 0;
	},
);

const activeImage = computed(() => product.value.gallery?.[activeIndex.value]);

const specs = computed(() => localModelValue.value?.specs ?? []);

const savings = computed(() =>
	Math.max(0, (product.value.oldPrice ?? 0) - (product.value.price ?? 0)),
);

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

.product-layout {
	display: grid;
	gap: 2rem;
	grid-template-columns: 1fr;
	margin-top: 2rem;
	align-items: start;
}

@container (min-width: 1024px) {
	.product-layout {
		grid-template-columns: 1fr 1fr;
		gap: 3.5rem;
	}
}

.gallery-main {
	position: relative;
	aspect-ratio: 4 / 3;
	border-radius: 1rem;
	overflow: hidden;
	background-color: #f3f4f6;
}

.dark .gallery-main {
	background-color: #27272a;
}

.gallery-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
}

.gallery-placeholder {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #9ca3af;
}

.dark .gallery-placeholder {
	color: #52525b;
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

.gallery-thumbs {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(4.5rem, 1fr));
	gap: 0.75rem;
	margin-top: 0.75rem;
}

.thumb {
	padding: 0;
	border: 2px solid transparent;
	border-radius: 0.5rem;
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
	aspect-ratio: 4 / 3;
	object-fit: cover;
	display: block;
}

.thumb-video {
	width: 100%;
	aspect-ratio: 4 / 3;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #ffffff;
	background-color: #1f2937;
	background-image: linear-gradient(135deg, #374151, #111827);
}

.details {
	display: flex;
	flex-direction: column;
}

.product-title {
	margin: 0;
	font-size: 1.875rem;
	line-height: 2.25rem;
	font-weight: 700;
	color: #1f2937;
}

.dark .product-title {
	color: #e5e7eb;
}

@container (min-width: 1024px) {
	.product-title {
		font-size: 2.25rem;
		line-height: 2.5rem;
	}
}

.product-tagline {
	margin: 0.5rem 0 0;
	font-size: 1rem;
	color: #6b7280;
}

.dark .product-tagline {
	color: #9ca3af;
}

.product-rating {
	margin-top: 0.75rem;
	display: inline-flex;
	align-items: center;
	gap: 0.375rem;
	font-size: 0.9375rem;
	font-weight: 600;
	color: #6b7280;
}

.dark .product-rating {
	color: #a1a1aa;
}

.rating-star {
	color: #f59e0b;
}

.rating-value {
	color: #1f2937;
}

.dark .rating-value {
	color: #e5e7eb;
}

.rating-reviews {
	font-weight: 400;
	color: #9ca3af;
}

.dark .rating-reviews {
	color: #71717a;
}

.product-price {
	display: flex;
	align-items: baseline;
	gap: 0.75rem;
	flex-wrap: wrap;
	margin-top: 1rem;
}

.price-current {
	font-size: 1.75rem;
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

.price-save {
	font-size: 0.875rem;
	font-weight: 600;
	color: #047857;
	background-color: #ecfdf5;
	padding: 0.125rem 0.5rem;
	border-radius: 9999px;
}

.dark .price-save {
	color: #6ee7b7;
	background-color: rgba(6, 78, 59, 0.4);
}

.product-description {
	margin: 1.25rem 0 0;
	font-size: 1rem;
	line-height: 1.75;
	color: #4b5563;
}

.dark .product-description {
	color: #9ca3af;
}

.product-specs {
	margin: 1.5rem 0 0;
	border-block-start: 1px solid #e5e7eb;
}

.dark .product-specs {
	border-color: #374151;
}

.spec-row {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	gap: 1rem;
	padding: 0.75rem 0;
	border-block-end: 1px solid #e5e7eb;
}

.dark .spec-row {
	border-color: #374151;
}

.spec-row dt {
	font-size: 0.875rem;
	font-weight: 500;
	color: #9ca3af;
}

.dark .spec-row dt {
	color: #71717a;
}

.spec-row dd {
	margin: 0;
	font-size: 0.9375rem;
	font-weight: 600;
	color: #1f2937;
}

.dark .spec-row dd {
	color: #e5e7eb;
}

.product-actions {
	margin-top: 1.75rem;
	display: flex;
	align-items: center;
	gap: 1rem;
	flex-wrap: wrap;
}

.buy-button {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1.5rem;
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