<template>
	<div class="quantity" role="group" aria-label="Quantity">
		<button type="button" class="quantity-btn" :disabled="disabled || value <= min"
			@click="value = Math.max(min, value - 1)">
			<Icon name="tabler:minus" :size="16" />
		</button>
		<span class="quantity-value">{{ value }}</span>
		<button type="button" class="quantity-btn" :disabled="disabled || (max !== undefined && value >= max)"
			@click="value = max !== undefined ? Math.min(max, value + 1) : value + 1">
			<Icon name="tabler:plus" :size="16" />
		</button>
	</div>
</template>

<script setup lang="ts">
const value = defineModel<number>({ default: 1 });

withDefaults(
	defineProps<{
		disabled?: boolean;
		min?: number;
		max?: number;
	}>(),
	{ disabled: false, min: 1, max: undefined },
);
</script>

<style scoped>
.quantity {
	display: inline-flex;
	align-items: center;
	gap: 0;
	border: 1px solid #d1d5db;
	border-radius: 9999px;
	background-color: #ffffff;
	overflow: hidden;
}

.dark .quantity {
	background-color: #1f1f1f;
	border-color: #3f3f46;
}

.quantity-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 2.5rem;
	height: 2.5rem;
	padding: 0;
	border: none;
	background-color: transparent;
	color: #1f2937;
	cursor: pointer;
	transition: background-color 150ms ease-in-out, opacity 150ms ease-in-out;
}

.dark .quantity-btn {
	color: #e5e7eb;
}

.quantity-btn:hover:not(:disabled) {
	background-color: rgba(128, 128, 128, 0.12);
}

.quantity-btn:disabled {
	opacity: 0.4;
	cursor: not-allowed;
}

.quantity-value {
	min-width: 2rem;
	text-align: center;
	font-size: 0.9375rem;
	font-weight: 600;
	color: #1f2937;
}

.dark .quantity-value {
	color: #e5e7eb;
}
</style>