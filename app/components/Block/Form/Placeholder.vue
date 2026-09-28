<template>
	<div class="form-placeholder">
		<Icon name="tabler:forms" class="form-placeholder-icon" :size="32" />
		<p class="form-placeholder-text">{{ t('form.setupHint') }}</p>
	</div>
</template>

<style scoped>
.form-placeholder {
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

.dark .form-placeholder {
	border-color: #3f3f46;
	background-color: rgba(39, 39, 42, 0.35);
}

.form-placeholder-icon {
	color: #9ca3af;
}

.dark .form-placeholder-icon {
	color: #71717a;
}

.form-placeholder-text {
	margin: 0;
	font-size: 0.875rem;
	font-weight: 500;
	color: #6b7280;
}

.dark .form-placeholder-text {
	color: #a1a1aa;
}
</style>