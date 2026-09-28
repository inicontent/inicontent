<template>
	<div class="form-fields">
		<Field
			v-for="field in fields"
			:key="String(field.field)"
			:field="field.renderField"
			v-model="values[field.key]" />
	</div>
</template>

<script lang="ts" setup>
import type { FormField } from "~/composables/useForm";

defineProps<{ fields: FormField[] }>();
const values = defineModel<Record<string, any>>({ default: () => ({}) });
</script>

<style scoped>
.form-fields {
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
	width: 100%;
}
</style>