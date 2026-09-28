<template>
	<section class="form-section">
		<div class="split-layout">
			<div v-if="mediaUrl" class="media">
				<video v-if="isVideo" :src="mediaUrl" class="media-el" controls muted loop playsinline></video>
				<img v-else :src="mediaUrl" alt="" class="media-el" />
			</div>

			<div class="content">
				<LazyBlockHeading v-if="hasHeading" v-model="localModelValue" :design="1" />

				<div class="form-wrap">
					<form v-if="!submitted" class="form" novalidate @submit.prevent="onSubmit">
						<LazyBlockFormFields v-model="values" :fields="formFields" />
						<p v-if="error" class="feedback error">{{ error }}</p>
						<button type="submit" class="submit" :disabled="submitting">
							{{ submitting ? t('form.submitting') : (localModelValue?.submitLabel || t('form.submit')) }}
						</button>
					</form>
					<p v-else class="feedback success">
						{{ localModelValue?.successMessage || t('form.submitSuccess') }}
					</p>
				</div>
			</div>
		</div>
	</section>
</template>

<script lang="ts" setup>
import { isVideoMedia, useForm } from "~/composables/useForm";

const localModelValue = defineModel<Form>();

const hasHeading = computed(
	() =>
		!!localModelValue.value?.heading ||
		!!localModelValue.value?.preHeading ||
		!!localModelValue.value?.preHeadingLink ||
		!!localModelValue.value?.description,
);

const media = computed(() => localModelValue.value?.media);
const mediaUrl = computed(() => media.value?.publicURL);
const isVideo = computed(() => isVideoMedia(media.value));

const { formFields, submitting, submit, demo } = useForm(localModelValue);

const values = ref<Record<string, any>>({});
const submitted = ref(false);
const error = ref("");

function validate(): boolean {
	for (const field of formFields.value) {
		const value = values.value[field.key];
		if (
			field.required &&
			(value === undefined ||
				value === null ||
				value === "" ||
				(Array.isArray(value) && !value.length))
		) {
			error.value = `${field.label} ${t("form.requiredError")}`;
			return false;
		}
	}
	error.value = "";
	return true;
}

async function onSubmit() {
	if (!validate()) return;
	if (demo.value) {
		// No table mapped yet — simulate a successful submission for preview.
		submitted.value = true;
		return;
	}
	const result = await submit(values.value);
	if (result.ok) submitted.value = true;
	else error.value = result.message || t("form.submitFailed");
}
</script>

<style scoped>
.form-section {
	padding-block: 3.5rem;
	padding-inline: 1rem;
	display: grid;
	place-items: center;
}

.split-layout {
	width: 100%;
	max-width: 80rem;
	display: grid;
	grid-template-columns: 1fr;
	gap: 2rem;
	align-items: center;
}

@media (min-width: 1024px) {
	.form-section {
		padding-inline: 2rem;
	}

	.split-layout {
		grid-template-columns: 1fr 1fr;
		gap: 3rem;
	}
}

.media {
	min-height: 16rem;
	align-content: center;
}

@media (min-width: 1024px) {
	.media {
		min-height: 100%;
	}
}

.media-el {
	display: block;
	width: 100%;
	height: 100%;
	min-height: 16rem;
	object-fit: cover;
	border-radius: 1rem;
	overflow: hidden;
}

.content {
	display: flex;
	flex-direction: column;
	align-items: stretch;
}

.form-wrap {
	width: 100%;
	margin-top: 1.5rem;
}

.form {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.submit {
	align-self: flex-start;
	padding: 0.75rem 2rem;
	font-size: 0.9375rem;
	font-weight: 600;
	color: #ffffff;
	background-color: rgb(var(--primaryColor));
	border: none;
	border-radius: 9999px;
	cursor: pointer;
	transition: opacity 200ms ease-in-out;
	font-family: inherit;
}

.submit:hover:not(:disabled) {
	opacity: 0.9;
}

.submit:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.feedback {
	margin: 0;
	font-size: 0.875rem;
	font-weight: 500;
}

.feedback.error {
	color: #ef4444;
}

.feedback.success {
	padding: 1.25rem;
	font-size: 1rem;
	color: #047857;
	background-color: #ecfdf5;
	border-radius: 0.75rem;
}

.dark .feedback.success {
	color: #6ee7b7;
	background-color: rgba(6, 78, 59, 0.4);
}
</style>