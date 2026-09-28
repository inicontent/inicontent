<template>
	<div ref="el" :style="elementStyle">
		<slot v-if="visible" />
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	rootMargin?: string;
	minHeight?: string;
}>();

const elementStyle = computed(() =>
	props.minHeight ? { minHeight: props.minHeight } : undefined,
);

const el = ref<HTMLElement>();
const visible = ref(false);
let observer: IntersectionObserver | undefined;

onMounted(() => {
	if (typeof IntersectionObserver === "undefined") {
		// Very old browsers — render everything upfront.
		visible.value = true;
		return;
	}
	observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				visible.value = true;
				observer?.disconnect();
			}
		},
		{ rootMargin: props.rootMargin ?? "600px 0px" },
	);
	if (el.value) observer.observe(el.value);
});

onBeforeUnmount(() => observer?.disconnect());
</script>