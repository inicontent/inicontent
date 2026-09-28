<template>
    <div>
        <template v-if="modelValue === 'desktop'">
            <div class="device-desktop-top">
                <slot></slot>
            </div>
            <div class="device-desktop-bottom">
                <div class="device-desktop-handle"></div>
            </div>
        </template>

        <template v-else-if="modelValue === 'tablet'">
            <div class="device-tablet">
                <div class="tablet-notches notch-1"></div>
                <div class="tablet-notches notch-2"></div>
                <div class="tablet-notches notch-3"></div>
                <div class="tablet-notches notch-4"></div>
                <div class="device-tablet-screen">
                    <slot></slot>
                </div>
            </div>
        </template>

        <template v-else-if="modelValue === 'mobile'">
            <div class="device-mobile">
                <div class="mobile-notches notch-1"></div>
                <div class="mobile-notches notch-2"></div>
                <div class="mobile-notches notch-3"></div>
                <div class="mobile-notches notch-4"></div>
                <div class="device-mobile-screen">
                    <slot></slot>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
defineModel({
	type: String as PropType<"desktop" | "mobile" | "tablet">,
	required: true,
});
</script>

<style scoped>
/* Desktop Frame */
.device-desktop-top {
    margin-inline: auto;
    border: 8px solid #d1d1d1;
    background-color: #d1d1d1;
    border-top-left-radius: 0.75rem;
    border-top-right-radius: 0.75rem;
    height: 172px;
    width: 91.666667%;
    overflow: auto;
}

.device-desktop-bottom {
    margin-inline: auto;
    background-color: #f4f4f5;
    border-bottom-left-radius: 0.75rem;
    border-bottom-right-radius: 0.75rem;
    border-top-left-radius: 0.125rem;
    border-top-right-radius: 0.125rem;
    height: 17px;
    width: 100%;
    position: relative;
}

.device-desktop-handle {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    border-bottom-left-radius: 0.75rem;
    border-bottom-right-radius: 0.75rem;
    width: 56px;
    height: 5px;
    background-color: #d1d1d1;
}

.dark .device-desktop-top {
    border-color: #1b1b1c;
    background-color: #1b1b1c;
}

.dark .device-desktop-bottom {
    background-color: #2a2a2e;
}

.dark .device-desktop-handle {
    background-color: #1b1b1c;
}

/* Tablet Frame */
.device-tablet {
    position: relative;
    margin-inline: auto;
    background-color: #f4f4f5;
    border-radius: 2.5rem;
    width: 300px;
    height: 354px;
}

.device-tablet-screen {
    position: absolute;
    inset: 14px;
    border-radius: 2rem;
    overflow: auto;
    background-color: #f4f4f5;
}

.tablet-notches {
    position: absolute;
    width: 3px;
    background-color: #f4f4f5;
}

.notch-1 {
    height: 32px;
    left: -3px;
    top: 72px;
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
}

.notch-2 {
    height: 46px;
    left: -3px;
    top: 124px;
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
}

.notch-3 {
    height: 46px;
    left: -3px;
    top: 178px;
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
}

.notch-4 {
    height: 64px;
    right: -3px;
    top: 142px;
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
}

.dark .device-tablet,
.dark .device-tablet-screen,
.dark .tablet-notches {
    border-color: #2a2a2e;
    background-color: #2a2a2e;
}

/* Mobile Frame */
.device-mobile {
    position: relative;
    margin-inline: auto;
    border: 14px solid #f4f4f5;
    background-color: #f4f4f5;
    border-radius: 2.5rem;
    width: 200px;
    height: 400px;
}

.device-mobile-screen {
    width: 100%;
    height: 100%;
    border-radius: 2rem;
    overflow: auto;
    background-color: #f4f4f5;
}

.mobile-notches {
    position: absolute;
    width: 3px;
    background-color: #f4f4f5;
}

.mobile-notches.notch-1 {
    height: 22px;
    left: -17px;
    top: 52px;
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
}

.mobile-notches.notch-2 {
    height: 36px;
    left: -17px;
    top: 90px;
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
}

.mobile-notches.notch-3 {
    height: 36px;
    left: -17px;
    top: 130px;
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
}

.mobile-notches.notch-4 {
    height: 54px;
    right: -17px;
    top: 102px;
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
}

.dark .device-mobile,
.dark .device-mobile-screen,
.dark .mobile-notches {
    border-color: #2a2a2e;
    background-color: #2a2a2e;
}
</style>