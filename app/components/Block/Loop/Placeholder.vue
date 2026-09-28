<template>
	<div class="loop-placeholder">
		<Icon name="tabler:repeat" class="loop-placeholder-icon" :size="32" />
		<p class="loop-placeholder-text">{{ t('loop.setupHint') }}</p>
	</div>
</template>

<style scoped>
.loop-placeholder {
	min-height: 12rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.75rem;
	margin-inline: auto;
	padding: 2rem 1rem;
	border: 2px dashed #d1d5db;
	border-radius: 0.75rem;
	text-align: center;
	background-color: rgba(243, 244, 246, 0.4);
}

.dark .loop-placeholder {
	border-color: #3f3f46;
	background-color: rgba(39, 39, 42, 0.35);
}

.loop-placeholder-icon {
	color: #9ca3af;
}

.dark .loop-placeholder-icon {
	color: #71717a;
}

.loop-placeholder-text {
	margin: 0;
	font-size: 0.875rem;
	font-weight: 500;
	color: #6b7280;
}

.dark .loop-placeholder-text {
	color: #a1a1aa;
}
</style>