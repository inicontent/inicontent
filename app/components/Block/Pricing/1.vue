<template>
    <div class="pricing-container">
        <div class="gradient-wrapper" aria-hidden="true">
            <div class="gradient-bg1"></div>
            <div class="gradient-bg2"></div>
        </div>

        <div class="circle circle-small"></div>
        <div class="circle circle-mid"></div>
        <div class="circle circle-large"></div>
        <div class="circle circle-xlarge"></div>

        <LazyBlockHeading
            v-if="modelValue?.heading || modelValue?.preHeadingLink || modelValue?.preHeading || modelValue?.description"
            v-model="modelValue" :design="4" />

        <div v-if="hasYearlyPricing" class="billing-switch">
            <label class="switch-label"> {{ t('monthly') }}</label>
            <label class="switch">
                <input type="checkbox" v-model="billingToggle" class="switch-input" />
                <span class="switch-track"></span>
                <span class="switch-thumb"></span>
            </label>
            <label class="switch-label badge-container">
                {{ t('yearly') }}
                <span class="save-badge">
                    <svg class="save-icon" xmlns="http://www.w3.org/2000/svg" width="45" height="25" viewBox="0 0 45 25"
                        fill="none">
                        <path
                            d="M43.2951 3.47877C43.8357 3.59191 44.3656 3.24541 44.4788 2.70484C44.5919 2.16427 44.2454 1.63433 43.7049 1.52119L43.2951 3.47877ZM4.63031 24.4936C4.90293 24.9739 5.51329 25.1423 5.99361 24.8697L13.8208 20.4272C14.3011 20.1546 14.4695 19.5443 14.1969 19.0639C13.9242 18.5836 13.3139 18.4152 12.8336 18.6879L5.87608 22.6367L1.92723 15.6792C1.65462 15.1989 1.04426 15.0305 0.563943 15.3031C0.0836291 15.5757 -0.0847477 16.1861 0.187863 16.6664L4.63031 24.4936ZM43.7049 1.52119C32.7389 -0.77401 23.9595 0.99522 17.3905 5.28788C10.8356 9.57127 6.58742 16.2977 4.53601 23.7341L6.46399 24.2659C8.41258 17.2023 12.4144 10.9287 18.4845 6.96211C24.5405 3.00476 32.7611 1.27399 43.2951 3.47877L43.7049 1.52119Z"
                            class="save-path" />
                    </svg>
                    <span class="save-text">{{ t('saveUpTo') }} {{ SavePercentage }}%</span>
                </span>
            </label>
        </div>

        <div :class="[
            'plans-container',
            modelValue?.items && modelValue.items.length > 3 ? 'justify-start-md' : 'justify-center-md'
        ]">
            <div v-for="plan in modelValue?.items" :key="plan.name"
                :class="['plan-card', { 'plan-featured': plan.isFeatured }]">
                <span v-if="plan.isFeatured" class="plan-badge">{{ t('mostPopular') }}</span>
                <h4 class="plan-title">{{ plan.name }}</h4>
                <span v-if="getPrice(plan) !== null" class="plan-price">
                    {{ getPrice(plan) }}
                    <span class="plan-currency">{{ modelValue?.currency ?? '$' }}</span>
                </span>
                <p v-else-if="plan.price === 0" class="plan-price">{{ t('free') }}</p>
                <p v-if="plan.description" class="plan-description" v-html="plan.description.replace(/\n/g, '<br/>')">
                </p>
                <ul class="plan-features">
                    <li v-for="feature in plan.features" :key="feature" class="plan-feature">
                        <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span class="feature-text">{{ feature }}</span>
                    </li>
                </ul>
                <a v-if="plan.button" v-bind="linkAttrs(plan.button.link)"
                    :class="['plan-button', plan.isFeatured ? 'plan-button-featured' : 'plan-button-default']">
                    {{ plan.button.label }}
                </a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const modelValue = defineModel<Pricing>();
const { linkAttrs } = usePageLinks();

const billingToggle = ref(false);
const hasYearlyPricing = computed(
	() =>
		modelValue.value?.items &&
		modelValue.value.items.length > 0 &&
		modelValue.value.items.some((p) => p.yearlyPrice !== undefined),
);
function getPrice(plan: NonNullable<Pricing["items"]>[number]) {
	if (plan.price === 0) return null;
	return billingToggle.value && plan.yearlyPrice != null
		? plan.yearlyPrice
		: plan.price;
}
const SavePercentage = computed(() => {
	if (modelValue.value?.items && modelValue.value.items.length > 0) {
		const totalMonthlyPrice = modelValue.value.items.reduce(
			(sum, plan) => sum + (plan.price || 0),
			0,
		);
		const totalYearlyPrice = modelValue.value.items.reduce(
			(sum, plan) => sum + (plan.yearlyPrice || 0),
			0,
		);
		const averageMonthlyPrice =
			totalMonthlyPrice / modelValue.value.items.length;
		const averageYearlyPrice = totalYearlyPrice / modelValue.value.items.length;
		return Math.round(
			((averageMonthlyPrice * 12 - averageYearlyPrice) /
				(averageMonthlyPrice * 12)) *
				100,
		);
	}
	return 0;
});
</script>

<style scoped>
.pricing-container {
    position: relative;
    z-index: 0;
    width: calc(100% - 2rem);
    margin-inline: auto;
}

.gradient-wrapper {
    position: absolute;
    inset: 0;
    display: flex;
    z-index: -1;
}

.gradient-bg1 {
    flex: 1;
    height: 150px;
    background-color: rgba(var(--primaryColor), 0.3);
    filter: blur(3rem);
}

.gradient-bg2 {
    width: 25%;
    height: 75px;
    background-color: rgba(229, 231, 235, 0.9);
    filter: blur(3rem);
    transform: translateY(8rem);
}

.dark .gradient-bg1 {
    background-color: rgba(var(--primaryColor), 0.2);
}

.dark .gradient-bg2 {
    background-color: rgba(39, 39, 42, 0.6);
}

.circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px dashed rgba(var(--primaryColor), 1);
    border-radius: 50%;
    z-index: -1;
}

.rtl .circle {
    left: auto;
    right: 50%;
    transform: translate(50%, -50%);
}

.circle-small {
    width: 40vw;
    height: 40vw;
}

.circle-mid {
    width: 60vw;
    height: 60vw;
    opacity: 0.8;
}

.circle-large {
    width: 80vw;
    height: 80vw;
    opacity: 0.6;
}

.circle-xlarge {
    width: 100vw;
    height: 100vw;
    opacity: 0.4;
}

.billing-switch {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;
    margin-block-end: 1.5rem;
}

.switch-label {
    font-size: 0.875rem;
    color: #1f2937;
}

.rtl .switch-label {
    text-align: right;
}

.switch {
    position: relative;
    width: 2.75rem;
    height: 1.5rem;
    cursor: pointer;
}

.switch-input {
    display: none;
}

.switch-track {
    position: absolute;
    inset: 0;
    background-color: #aeb2bb;
    border-radius: 9999px;
    transition: background-color 200ms ease-in-out;
}

.switch-input:checked+.switch-track {
    background-color: rgba(var(--primaryColor), 1);
}

.dark .switch-track {
    background-color: #27272a;
}

.dark .switch-input:checked+.switch-track {
    background-color: rgba(var(--primaryColor), 1);
}

.switch-thumb {
    position: absolute;
    top: 50%;
    left: 0.125rem;
    width: 1.25rem;
    height: 1.25rem;
    background-color: #ffffff;
    border-radius: 9999px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    transform: translateY(-50%);
    transition: transform 200ms ease-in-out;
}

.switch-input:checked+.switch-track+.switch-thumb {
    transform: translateY(-50%) translateX(calc(100% - 0.25rem));
}

.rtl .switch-thumb {
    left: auto;
    right: 0.125rem;
}

.rtl .switch-input:checked+.switch-track+.switch-thumb {
    transform: translateY(-50%) translateX(-100%);
}

.badge-container {
    position: relative;
}

.save-badge {
    position: absolute;
    top: -2rem;
    right: -9rem;
    display: none;
}

.rtl .save-badge {
    right: auto;
    left: -7.6rem;
    top: -1rem
}

.save-icon {
    fill: currentColor;
    color: rgb(var(--primaryColor));
}

.rtl .save-icon {
    transform: scaleX(-1);
}

.save-text {
    display: inline-block;
    font-size: 0.6875rem;
    background-color: rgba(var(--primaryColor), 1);
    color: #ffffff;
    border-radius: 0.375rem;
    padding: 0.25rem 0.625rem;
    text-transform: uppercase;
    font-weight: 600;
}

.plans-container {
    display: flex;
    margin-block-start: 3rem;
    padding-block-end: 2.5rem;
    gap: 1.5rem;
    overflow: auto;
}

.plan-card {
    position: relative;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    text-align: center;
    border-radius: 0.75rem;
    padding: 2rem;
    background-color: #ffffff79;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    transition: all 300ms ease-in-out;
    backdrop-filter: blur(5px);
}

.plan-card:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dark .plan-card {
    background-color: #27272ad7;
}

.plan-featured {
    border: 2px solid rgba(var(--primaryColor), 1);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.plan-badge {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: 600;
    background-color: rgba(var(--primaryColor), 1);
    color: #ffffff;
}

.plan-title {
    font-size: 1.125rem;
    font-weight: 500;
    color: #1f2937;
    margin: 0;
}

.plan-price {
    margin-block-start: 1.25rem;
    font-size: 3rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
}

.plan-currency {
    font-size: 1.5rem;
    font-weight: 700;
    margin-inline-end: -0.5rem;
}

.plan-description {
    margin-block-start: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
}

.plan-features {
    margin-block-start: 1.75rem;
    list-style: none;
    padding: 0;
}

.plan-feature {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-block-end: 0.625rem;
}

.feature-icon {
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
    color: rgba(var(--primaryColor), 1);
}

.rtl .feature-icon {
    margin-inline-start: 0.5rem;
    margin-inline-end: 0;
}

.feature-text {
    color: #1f2937;
}

.dark .plan-title,
.dark .plan-description,
.dark .plan-price,
.dark .switch-label,
.dark .feature-text {
    color: #e5e7eb;
}

.plan-button {
    margin-block-start: 1.25rem;
    padding: 0.75rem 1rem;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    transition: all 300ms ease-in-out;
}

.plan-button-featured {
    background-color: rgba(var(--primaryColor), 1);
    color: #ffffff;
    border-color: transparent;
}

.plan-button-default:hover {
    background-color: #f3f4f6;
}

.dark .plan-button-default {
    background-color: #404040;
    border-color: #27272a;
    color: #e5e7eb;
}

.plan-button:hover {
    opacity: .8;
}

/* Responsive */
@container (min-width: 640px) {
    .circle-small {
        width: 15vw;
        height: 15vw;
    }

    .circle-mid {
        width: 25vw;
        height: 25vw;
    }

    .circle-large {
        width: 35vw;
        height: 35vw;
    }

    .circle-xlarge {
        width: 40vw;
        height: 40vw;
    }

    .plan-card {
        width: 280px;
    }

    .save-badge {
        display: flex;
    }
}

@container (min-width: 768px) {
    .gradient-bg2 {
        transform: translateY(8rem);
    }

    .plan-card {
        padding: 2.5rem;
    }

    .feature-icon {
        width: 1.25rem;
        height: 1.25rem;
    }
}

@container (min-width: 1024px) {
    .pricing-container {
        padding-inline: 0;
    }

    .justify-start-md {
        justify-content: flex-start;
    }

    .justify-center-md {
        justify-content: center;
    }
}
</style>