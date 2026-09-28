<template>
    <section class="features-section">
        <div class="container">
            <div class="content">
                <div class="grid">
                    <div class="text-block">
                        <LazyBlockHeading v-if="hasHeading" v-model="modelValue" />
                    </div>

                    <div class="features">
                        <div class="blur-backgrounds">
                            <div class="blur-circle"></div>
                            <div class="blur-circle second"></div>
                            <div class="blur-circle third"></div>
                        </div>
                        <div class="feature-wrapper">
                            <div class="feature-row">
                                <div v-for="(item, index) in modelValue?.items" :key="index" class="feature">
                                    <video v-if="isVideoMediaValue(item.image)" :src="item.image?.publicURL"
                                        class="icon" muted loop playsinline></video>
                                    <img v-else-if="item.image?.publicURL" :src="item.image.publicURL"
                                        alt="Feature image" class="icon" />
                                    <Icon v-else-if="item.icon" :name="`tabler:${item.icon}`" class="icon" :size="50" />
                                    <h3>{{ item.title }}</h3>
                                    <p>{{ item.description }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { isVideoMediaValue } from "~/composables/useForm";

const hasHeading = computed(
	() =>
		!!modelValue.value?.heading ||
		!!modelValue.value?.preHeading ||
		!!modelValue.value?.preHeadingLink ||
		!!modelValue.value?.description,
);

const modelValue = defineModel<Features>();
</script>

<style scoped>
.features-section {
    position: relative;
    overflow-x: hidden;
}

.content {
    position: relative;
    z-index: 10;
    padding: 2rem 1rem;
}

.grid {
    display: grid;
    grid-template-columns: 1fr;
}

@media(min-width: 768px) {
    .grid {
        grid-template-columns: repeat(12, 1fr);
    }

    .text-block {
        grid-column: span 5;
        padding-right: 1.25rem;
    }

    .rtl .text-block {
        padding-right: 0;
        padding-left: 1.25rem;
    }

    .features {
        grid-column: span 7;
        position: relative;
        z-index: 10;
    }
}

.text-block {
    margin-bottom: 3rem;
    align-content: center;
}

.blur-backgrounds {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: none;
}

@media(min-width: 768px) {
    .blur-backgrounds {
        display: flex;
    }
}

.blur-circle {
    width: 335px;
    height: 335px;
    border-radius: 50%;
    background: rgba(var(--primaryColor), 0.2);
    filter: blur(145px);
}

.blur-circle.second {
    margin-left: -170px;
    background: rgba(var(--primaryColor), 0.25);
}

.blur-circle.third {
    margin-left: -170px;
}

.feature-wrapper {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.feature-row {
    display: grid;
    grid-template-columns: 1fr;
    position: relative;
    gap: 2rem;
}

@media(min-width: 768px) {
    .feature-row {
        grid-template-columns: repeat(2, 1fr);
    }
}

.feature {
    position: relative;
    padding: 3rem 0;
    padding-left: 1rem;
    padding-right: 1rem;
}

.feature h3 {
    margin-bottom: 0.75rem;
}

.icon {
    display: block;
    margin-bottom: 1rem;
}

video.icon {
    width: 4rem;
    height: 4rem;
    object-fit: cover;
    border-radius: 0.75rem;
}

.rtl .text-block,
.rtl .feature {
    text-align: right;
}

.rtl .feature {
    padding-left: 0;
    padding-right: 1rem;
}
</style>