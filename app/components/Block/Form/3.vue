<template>
	<section class="form-section">
		<div class="container">
			<div v-if="mediaUrl" class="media">
				<video v-if="isVideo" :src="mediaUrl" class="media-el" controls muted loop playsinline></video>
				<img v-else :src="mediaUrl" alt="" class="media-el" />
			</div>

			<LazyBlockHeading v-if="hasHeading" v-model="localModelValue" :design="1" />

			<div class="form-wrap">
				<template v-if="!submitted">
					<div v-if="stepCount > 1" class="steps-indicator">
						<button
							v-for="(step, index) in fieldsByStep"
							:key="index"
							type="button"
							class="step"
							:class="{ active: index === currentStep, done: index < currentStep }"
							:disabled="index >= currentStep"
							:aria-label="`${t('form.step')} ${index + 1}`"
							@click="goToStep(index)">
							<span class="step-dot">{{ index + 1 }}</span>
							<span v-if="stepTitles[index]" class="step-title">{{ stepTitles[index] }}</span>
						</button>
					</div>

					<form class="form" novalidate @submit.prevent="handleStepAction">
						<LazyBlockFormFields v-model="values" :fields="fieldsByStep[currentStep] || []" />
						<p v-if="error" class="feedback error">{{ error }}</p>

						<div class="actions">
							<button v-if="currentStep > 0" type="button" class="btn ghost" @click="goBack">
								{{ t('form.back') }}
							</button>
							<button
								v-if="currentStep < stepCount - 1"
								type="submit"
								class="btn primary">
								{{ t('form.next') }}
							</button>
							<button v-else type="submit" class="btn primary" :disabled="submitting">
								{{ submitting ? t('form.submitting') : (localModelValue?.submitLabel || t('form.submit')) }}
							</button>
						</div>
					</form>
				</template>
				<p v-else class="feedback success">
					{{ localModelValue?.successMessage || t('form.submitSuccess') }}
				</p>
			</div>
		</div>
	</section>
</template>

<script lang="ts" setup>
import { type FormField, isVideoMedia, useForm } from "~/composables/useForm";

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

const {
	formFields,
	fieldsByStep,
	stepCount,
	stepTitles,
	submitting,
	submit,
	demo,
} = useForm(localModelValue);

const values = ref<Record<string, any>>({});
const submitted = ref(false);
const error = ref("");
const currentStep = ref(0);

watch(
	stepCount,
	() => {
		if (currentStep.value > stepCount.value - 1)
			currentStep.value = Math.max(0, stepCount.value - 1);
	},
	{ immediate: true },
);

function validateStep(fields: FormField[]): boolean {
	for (const field of fields) {
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

function goNext() {
	if (validateStep(fieldsByStep.value[currentStep.value] || []))
		currentStep.value++;
}

function goBack() {
	error.value = "";
	currentStep.value--;
}

function goToStep(index: number) {
	if (index >= 0 && index < currentStep.value) {
		error.value = "";
		currentStep.value = index;
	}
}

function handleStepAction() {
	if (currentStep.value < stepCount.value - 1) goNext();
	else void onSubmit();
}

async function onSubmit() {
	if (!validateStep(fieldsByStep.value[currentStep.value] || [])) return;
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
}

.container {
	max-width: 44rem;
	margin-inline: auto;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.media {
	width: 100%;
	margin-block-end: 2rem;
}

.media-el {
	display: block;
	width: 100%;
	max-height: 18rem;
	object-fit: cover;
	border-radius: 1rem;
	overflow: hidden;
}

.form-wrap {
	width: 100%;
	margin-top: 2.5rem;
}

.form {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.steps-indicator {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	gap: 1rem;
	margin-block-end: 2rem;
}

.step {
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	gap: 0.375rem;
	min-width: 2.5rem;
	padding: 0;
	border: none;
	background: none;
	font-family: inherit;
	cursor: default;
}

.step-dot {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 2rem;
	height: 2rem;
	font-size: 0.875rem;
	font-weight: 600;
	color: #6b7280;
	background-color: #f3f4f6;
	border: 1px solid #d1d5db;
	border-radius: 9999px;
	transition: all 200ms ease-in-out;
}

.dark .step-dot {
	color: #a1a1aa;
	background-color: #27272a;
	border-color: #3f3f46;
}

.step.active .step-dot {
	color: #ffffff;
	background-color: rgb(var(--primaryColor));
	border-color: rgb(var(--primaryColor));
}

.step.done .step-dot {
	color: #ffffff;
	background-color: rgb(var(--primaryColor));
	border-color: rgb(var(--primaryColor));
	opacity: 0.7;
}

.step.done {
	cursor: pointer;
}

.step.done:hover .step-dot {
	opacity: 1;
	transform: scale(1.05);
}

.step:disabled {
	cursor: default;
}

.step-title {
	font-size: 0.75rem;
	font-weight: 500;
	color: #6b7280;
	white-space: nowrap;
}

.dark .step-title {
	color: #a1a1aa;
}

.actions {
	display: flex;
	justify-content: space-between;
	gap: 0.75rem;
}

.btn {
	padding: 0.625rem 1.5rem;
	font-size: 0.875rem;
	font-weight: 600;
	border: none;
	border-radius: 9999px;
	cursor: pointer;
	transition: opacity 200ms ease-in-out;
	font-family: inherit;
}

.btn.primary {
	color: #ffffff;
	background-color: rgb(var(--primaryColor));
}

.btn.ghost {
	color: #374151;
	background-color: transparent;
	border: 1px solid #d1d5db;
}

.dark .btn.ghost {
	color: #d1d5db;
	border-color: #3f3f46;
}

.btn:hover:not(:disabled) {
	opacity: 0.9;
}

.btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.feedback {
	margin: 0;
	font-size: 0.875rem;
	font-weight: 500;
	text-align: center;
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