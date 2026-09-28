<template>
    <div class="testimonials-container">
        <LazyBlockHeading v-if="hasHeading" v-model="modelValue" :design="1" />
        <div ref="wrapper" :class="['carousel-wrapper', { 'justify-center-lg': noScroll }]">
            <div v-for="(testimonial, index) in modelValue?.items" :key="index" class="testimonial-card">
                <div class="testimonial-content">
                    <p class="quote">{{ testimonial.quote }}</p>
                </div>
                <div class="testimonial-footer">
                    <div class="testimonial-info">
                        <video v-if="isVideoMediaValue(testimonial.avatar)" :src="testimonial.avatar?.publicURL"
                            class="avatar" muted loop playsinline></video>
                        <img v-else-if="testimonial.avatar?.publicURL" :src="testimonial.avatar.publicURL" alt="Avatar"
                            class="avatar" />
                        <div class="info-text">
                            <p class="name">{{ testimonial.name }}</p>
                            <p v-if="testimonial.position" class="position">
                                {{ testimonial.position }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { isVideoMediaValue } from "~/composables/useForm";

const modelValue = defineModel<Testimonials>();

const hasHeading = computed(
	() =>
		!!modelValue.value?.heading ||
		!!modelValue.value?.preHeading ||
		!!modelValue.value?.preHeadingLink ||
		!!modelValue.value?.description,
);

const wrapper = ref<HTMLDivElement | null>(null);
const noScroll = ref(false);

onMounted(() => {
	if (wrapper.value) {
		noScroll.value = wrapper.value.scrollWidth <= wrapper.value.clientWidth;
	}
});
</script>

<style scoped>
.testimonials-container {
    width: 100%;
    padding-inline: 1rem;
    padding-block: 2.5rem;
    margin-inline: auto;
    text-align: center;
}

.carousel-wrapper {
    display: flex;
    overflow-x: auto;
    justify-content: flex-start;
    gap: 1.5rem;
    padding-block-end: 1rem;
    margin-inline: -1rem;
    padding-inline: 1rem;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
}

.testimonial-card {
    display: flex;
    flex-direction: column;
    background-color: #f8fafc;
    border-radius: 0.75rem;
    flex-shrink: 0;
    width: 280px;
    scroll-snap-align: start;
    height: auto;
}

.dark .testimonial-card {
    background-color: #111827;
}

.testimonial-content {
    flex: 1 1 auto;
    padding: 1rem;
}

.quote {
    font-size: 1rem;
    font-style: italic;
    color: #1f2937;
}

.dark .quote {
    color: #e5e7eb;
}

.testimonial-footer {
    padding: 1rem;
    background-color: #f3f4f6;
    border-bottom-left-radius: 0.75rem;
    border-bottom-right-radius: 0.75rem;
}

.dark .testimonial-footer {
    background-color: #27272a;
}

.testimonial-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.avatar {
    width: 2rem;
    height: auto;
    border-radius: 9999px;
}

video.avatar {
    height: 2rem;
    object-fit: cover;
}

.info-text .name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1f2937;
}

.dark .info-text .name {
    color: #e5e7eb;
}

.info-text .position {
    font-size: 0.75rem;
    color: #6b7280;
}

.dark .info-text .position {
    color: #9ca3af;
}

@container (min-width: 640px) {
    .testimonials-container {
        padding-inline: 1.5rem;
    }

    .carousel-wrapper {
        margin-inline: 0;
        padding-inline: 0;
    }

    .testimonial-card {
        width: 300px;
    }

    .avatar {
        width: 2.875rem;
    }

    .info-text .name {
        font-size: 1rem;
    }
}

@container (min-width: 768px) {
    .testimonial-content {
        padding: 1.5rem;
    }

    .quote {
        font-size: 1.125rem;
    }

    .testimonial-footer {
        padding-inline: 1.75rem;
    }
}

@container (min-width: 1024px) {
    .testimonials-container {
        padding-inline: 2rem;
    }

    .justify-center-lg {
        justify-content: center;
    }
}
</style>