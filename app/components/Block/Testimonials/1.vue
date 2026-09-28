<template>
    <div class="testimonials-container">
        <LazyBlockHeading v-if="hasHeading" v-model="modelValue" :design="1" />
        <div ref="wrapper" class="carousel-wrapper" :class="{ 'justify-center-lg': noScroll }">
            <div v-for="(testimonial, index) in modelValue?.items" :key="index" class="testimonial-card">
                <div class="testimonial-content">
                    <video v-if="isVideoMediaValue(testimonial.avatar)" :src="testimonial.avatar?.publicURL"
                        class="avatar" muted loop playsinline></video>
                    <img v-else-if="testimonial.avatar?.publicURL" :src="testimonial.avatar.publicURL" alt="avatar"
                        class="avatar" />
                    <p class="quote">
                        <em>{{ testimonial.quote }}</em>
                    </p>
                </div>
                <div class="testimonial-footer">
                    <h3 class="name">{{ testimonial.name }}</h3>
                    <p v-if="testimonial.position" class="position">
                        {{ testimonial.position }}
                    </p>
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
	if (wrapper.value)
		noScroll.value = wrapper.value.scrollWidth <= wrapper.value.clientWidth;
});
</script>

<style scoped>
.testimonials-container {
    width: calc(100% - 2rem);
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
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    border-radius: 0.75rem;
    flex-shrink: 0;
    width: 280px;
    scroll-snap-align: start;
}

.dark .testimonial-card {
    background-color: #1f1f1f;
    border-color: #374151;
}

.testimonial-content {
    flex: 1 1 auto;
    padding: 1rem;
}

.avatar {
    width: 5rem;
    height: auto;
    margin-inline: auto;
    object-fit: contain;
    border-radius: 9999px;
    color: #374151;
}

video.avatar {
    height: 5rem;
    object-fit: cover;
}

.dark .avatar {
    color: #d1d5db;
}

.quote {
    margin-top: 0.75rem;
    font-size: 1rem;
    color: #1f2937;
}

.dark .quote {
    color: #ffffff;
}

.testimonial-footer {
    padding: 1rem;
    border-bottom-left-radius: 0.75rem;
    border-bottom-right-radius: 0.75rem;
}

.name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
}

.dark .name {
    color: #e5e7eb;
}

.position {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0;
}

.dark .position {
    color: #6b7280;
}

@container (min-width: 640px) {
    .testimonials-container {
        width: calc(100% - 3rem);
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
        width: 6rem;
    }

    .quote {
        margin-top: 1.5rem;
    }

    .name {
        font-size: 1rem;
    }
}

@container (min-width: 768px) {
    .testimonial-content {
        padding: 1.5rem;
    }

    .quote {
        font-size: 1.25rem;
    }

    .testimonial-footer {
        padding-inline: 1.5rem;
    }
}

@container (min-width: 1024px) {
    .testimonials-container {
        width: calc(100% - 4rem);
        padding-inline: 2rem;
    }

    .carousel-wrapper.justify-center-lg {
        justify-content: center;
    }
}
</style>