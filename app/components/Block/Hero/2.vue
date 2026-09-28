<template>
  <section class="hero-section">
    <div class="container">
      <div class="hero-row">
        <!-- text column -->
        <div class="hero-col">
          <div class="hero-content">
            <LazyBlockHeading
              v-if="modelValue?.preHeading || modelValue?.heading || modelValue?.description || modelValue?.preHeadingLink"
              v-model="modelValue" :design="2" />
          </div>

          <div v-if="modelValue?.buttons?.length" class="hero-actions">
            <a v-for="({ label, link }, i) in modelValue.buttons" :key="i" v-bind="linkAttrs(link)"
              :class="['action', i === 0 ? 'action-primary' : 'action-secondary']">
              {{ label }}
              <svg v-if="i === 0" class="action-arrow" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </a>
          </div>
        </div>

        <!-- image column -->
        <div v-if="modelValue?.images?.length" class="hero-col">
          <div class="hero-img-box">
            <video v-if="heroMediaIsVideo" :src="heroMediaUrl ?? ''" class="hero-img" autoplay muted loop
              playsinline></video>
            <img v-else :src="heroMediaUrl" alt="" class="hero-img" />
            <div class="hero-deco hero-deco-left">
              <svg width="134" height="106" viewBox="0 0 134 106" xmlns="http://www.w3.org/2000/svg">
                <circle cx="1.66667" cy="104" r="1.66667" transform="rotate(-90 1.66667 104)" />
                <circle cx="16.3333" cy="104" r="1.66667" transform="rotate(-90 16.3333 104)" />
                <circle cx="31" cy="104" r="1.66667" transform="rotate(-90 31 104)" />
                <circle cx="45.6667" cy="104" r="1.66667" transform="rotate(-90 45.6667 104)" />
                <circle cx="60.3333" cy="104" r="1.66667" transform="rotate(-90 60.3333 104)" />
                <circle cx="88.6667" cy="104" r="1.66667" transform="rotate(-90 88.6667 104)" />
                <circle cx="117.667" cy="104" r="1.66667" transform="rotate(-90 117.667 104)" />
                <circle cx="74.6667" cy="104" r="1.66667" transform="rotate(-90 74.6667 104)" />
                <circle cx="103" cy="104" r="1.66667" transform="rotate(-90 103 104)" />
                <circle cx="132" cy="104" r="1.66667" transform="rotate(-90 132 104)" />
                <circle cx="1.66667" cy="89.3333" r="1.66667" transform="rotate(-90 1.66667 89.3333)" />
                <circle cx="16.3333" cy="89.3333" r="1.66667" transform="rotate(-90 16.3333 89.3333)" />
                <circle cx="31" cy="89.3333" r="1.66667" transform="rotate(-90 31 89.3333)" />
                <circle cx="45.6667" cy="89.3333" r="1.66667" transform="rotate(-90 45.6667 89.3333)" />
                <circle cx="60.3333" cy="89.3338" r="1.66667" transform="rotate(-90 60.3333 89.3338)" />
                <circle cx="88.6667" cy="89.3338" r="1.66667" transform="rotate(-90 88.6667 89.3338)" />
                <circle cx="117.667" cy="89.3338" r="1.66667" transform="rotate(-90 117.667 89.3338)" />
                <circle cx="74.6667" cy="89.3338" r="1.66667" transform="rotate(-90 74.6667 89.3338)" />
                <circle cx="103" cy="89.3338" r="1.66667" transform="rotate(-90 103 89.3338)" />
                <circle cx="132" cy="89.3338" r="1.66667" transform="rotate(-90 132 89.3338)" />
                <circle cx="1.66667" cy="74.6673" r="1.66667" transform="rotate(-90 1.66667 74.6673)" />
                <circle cx="1.66667" cy="31.0003" r="1.66667" transform="rotate(-90 1.66667 31.0003)" />
                <circle cx="16.3333" cy="74.6668" r="1.66667" transform="rotate(-90 16.3333 74.6668)" />
                <circle cx="16.3333" cy="31.0003" r="1.66667" transform="rotate(-90 16.3333 31.0003)" />
                <circle cx="31" cy="74.6668" r="1.66667" transform="rotate(-90 31 74.6668)" />
                <circle cx="31" cy="31.0003" r="1.66667" transform="rotate(-90 31 31.0003)" />
                <circle cx="45.6667" cy="74.6668" r="1.66667" transform="rotate(-90 45.6667 74.6668)" />
                <circle cx="45.6667" cy="31.0003" r="1.66667" transform="rotate(-90 45.6667 31.0003)" />
                <circle cx="60.3333" cy="74.6668" r="1.66667" transform="rotate(-90 60.3333 74.6668)" />
                <circle cx="60.3333" cy="31.0001" r="1.66667" transform="rotate(-90 60.3333 31.0001)" />
                <circle cx="88.6667" cy="74.6668" r="1.66667" transform="rotate(-90 88.6667 74.6668)" />
                <circle cx="88.6667" cy="31.0001" r="1.66667" transform="rotate(-90 88.6667 31.0001)" />
                <circle cx="117.667" cy="74.6668" r="1.66667" transform="rotate(-90 117.667 74.6668)" />
                <circle cx="117.667" cy="31.0001" r="1.66667" transform="rotate(-90 117.667 31.0001)" />
                <circle cx="74.6667" cy="74.6668" r="1.66667" transform="rotate(-90 74.6667 74.6668)" />
                <circle cx="74.6667" cy="31.0001" r="1.66667" transform="rotate(-90 74.6667 31.0001)" />
                <circle cx="103" cy="74.6668" r="1.66667" transform="rotate(-90 103 74.6668)" />
                <circle cx="103" cy="31.0001" r="1.66667" transform="rotate(-90 103 31.0001)" />
                <circle cx="132" cy="74.6668" r="1.66667" transform="rotate(-90 132 74.6668)" />
                <circle cx="132" cy="31.0001" r="1.66667" transform="rotate(-90 132 31.0001)" />
                <circle cx="1.66667" cy="60.0003" r="1.66667" transform="rotate(-90 1.66667 60.0003)" />
                <circle cx="1.66667" cy="16.3336" r="1.66667" transform="rotate(-90 1.66667 16.3336)" />
                <circle cx="16.3333" cy="60.0003" r="1.66667" transform="rotate(-90 16.3333 60.0003)" />
                <circle cx="16.3333" cy="16.3336" r="1.66667" transform="rotate(-90 16.3333 16.3336)" />
                <circle cx="31" cy="60.0003" r="1.66667" transform="rotate(-90 31 60.0003)" />
                <circle cx="31" cy="16.3336" r="1.66667" transform="rotate(-90 31 16.3336)" />
                <circle cx="45.6667" cy="60.0003" r="1.66667" transform="rotate(-90 45.6667 60.0003)" />
                <circle cx="45.6667" cy="16.3336" r="1.66667" transform="rotate(-90 45.6667 16.3336)" />
                <circle cx="60.3333" cy="60.0003" r="1.66667" transform="rotate(-90 60.3333 60.0003)" />
                <circle cx="60.3333" cy="16.3336" r="1.66667" transform="rotate(-90 60.3333 16.3336)" />
                <circle cx="88.6667" cy="60.0003" r="1.66667" transform="rotate(-90 88.6667 60.0003)" />
                <circle cx="88.6667" cy="16.3336" r="1.66667" transform="rotate(-90 88.6667 16.3336)" />
                <circle cx="117.667" cy="60.0003" r="1.66667" transform="rotate(-90 117.667 60.0003)" />
                <circle cx="117.667" cy="16.3336" r="1.66667" transform="rotate(-90 117.667 16.3336)" />
                <circle cx="74.6667" cy="60.0003" r="1.66667" transform="rotate(-90 74.6667 60.0003)" />
                <circle cx="74.6667" cy="16.3336" r="1.66667" transform="rotate(-90 74.6667 16.3336)" />
                <circle cx="103" cy="60.0003" r="1.66667" transform="rotate(-90 103 60.0003)" />
                <circle cx="103" cy="16.3336" r="1.66667" transform="rotate(-90 103 16.3336)" />
                <circle cx="132" cy="60.0003" r="1.66667" transform="rotate(-90 132 60.0003)" />
                <circle cx="132" cy="16.3336" r="1.66667" transform="rotate(-90 132 16.3336)" />
                <circle cx="1.66667" cy="45.3336" r="1.66667" transform="rotate(-90 1.66667 45.3336)" />
                <circle cx="1.66667" cy="1.66683" r="1.66667" transform="rotate(-90 1.66667 1.66683)" />
                <circle cx="16.3333" cy="45.3336" r="1.66667" transform="rotate(-90 16.3333 45.3336)" />
                <circle cx="16.3333" cy="1.66683" r="1.66667" transform="rotate(-90 16.3333 1.66683)" />
                <circle cx="31" cy="45.3336" r="1.66667" transform="rotate(-90 31 45.3336)" />
                <circle cx="31" cy="1.66683" r="1.66667" transform="rotate(-90 31 1.66683)" />
                <circle cx="45.6667" cy="45.3336" r="1.66667" transform="rotate(-90 45.6667 45.3336)" />
                <circle cx="45.6667" cy="1.66683" r="1.66667" transform="rotate(-90 45.6667 1.66683)" />
                <circle cx="60.3333" cy="45.3338" r="1.66667" transform="rotate(-90 60.3333 45.3338)" />
                <circle cx="60.3333" cy="1.66707" r="1.66667" transform="rotate(-90 60.3333 1.66707)" />
                <circle cx="88.6667" cy="45.3338" r="1.66667" transform="rotate(-90 88.6667 45.3338)" />
                <circle cx="88.6667" cy="1.66707" r="1.66667" transform="rotate(-90 88.6667 1.66707)" />
                <circle cx="117.667" cy="45.3338" r="1.66667" transform="rotate(-90 117.667 45.3338)" />
                <circle cx="117.667" cy="1.66707" r="1.66667" transform="rotate(-90 117.667 1.66707)" />
                <circle cx="74.6667" cy="45.3338" r="1.66667" transform="rotate(-90 74.6667 45.3338)" />
                <circle cx="74.6667" cy="1.66707" r="1.66667" transform="rotate(-90 74.6667 1.66707)" />
                <circle cx="103" cy="45.3338" r="1.66667" transform="rotate(-90 103 45.3338)" />
                <circle cx="103" cy="1.66707" r="1.66667" transform="rotate(-90 103 1.66707)" />
                <circle cx="132" cy="45.3338" r="1.66667" transform="rotate(-90 132 45.3338)" />
                <circle cx="132" cy="1.66707" r="1.66667" transform="rotate(-90 132 1.66707)" />
              </svg>
            </div>
            <div class="hero-deco hero-deco-right">
              <svg width="134" height="106" viewBox="0 0 134 106" xmlns="http://www.w3.org/2000/svg">
                <circle cx="1.66667" cy="104" r="1.66667" transform="rotate(-90 1.66667 104)" />
                <circle cx="16.3333" cy="104" r="1.66667" transform="rotate(-90 16.3333 104)" />
                <circle cx="31" cy="104" r="1.66667" transform="rotate(-90 31 104)" />
                <circle cx="45.6667" cy="104" r="1.66667" transform="rotate(-90 45.6667 104)" />
                <circle cx="60.3333" cy="104" r="1.66667" transform="rotate(-90 60.3333 104)" />
                <circle cx="88.6667" cy="104" r="1.66667" transform="rotate(-90 88.6667 104)" />
                <circle cx="117.667" cy="104" r="1.66667" transform="rotate(-90 117.667 104)" />
                <circle cx="74.6667" cy="104" r="1.66667" transform="rotate(-90 74.6667 104)" />
                <circle cx="103" cy="104" r="1.66667" transform="rotate(-90 103 104)" />
                <circle cx="132" cy="104" r="1.66667" transform="rotate(-90 132 104)" />
                <circle cx="1.66667" cy="89.3333" r="1.66667" transform="rotate(-90 1.66667 89.3333)" />
                <circle cx="16.3333" cy="89.3333" r="1.66667" transform="rotate(-90 16.3333 89.3333)" />
                <circle cx="31" cy="89.3333" r="1.66667" transform="rotate(-90 31 89.3333)" />
                <circle cx="45.6667" cy="89.3333" r="1.66667" transform="rotate(-90 45.6667 89.3333)" />
                <circle cx="60.3333" cy="89.3338" r="1.66667" transform="rotate(-90 60.3333 89.3338)" />
                <circle cx="88.6667" cy="89.3338" r="1.66667" transform="rotate(-90 88.6667 89.3338)" />
                <circle cx="117.667" cy="89.3338" r="1.66667" transform="rotate(-90 117.667 89.3338)" />
                <circle cx="74.6667" cy="89.3338" r="1.66667" transform="rotate(-90 74.6667 89.3338)" />
                <circle cx="103" cy="89.3338" r="1.66667" transform="rotate(-90 103 89.3338)" />
                <circle cx="132" cy="89.3338" r="1.66667" transform="rotate(-90 132 89.3338)" />
                <circle cx="1.66667" cy="74.6673" r="1.66667" transform="rotate(-90 1.66667 74.6673)" />
                <circle cx="1.66667" cy="31.0003" r="1.66667" transform="rotate(-90 1.66667 31.0003)" />
                <circle cx="16.3333" cy="74.6668" r="1.66667" transform="rotate(-90 16.3333 74.6668)" />
                <circle cx="16.3333" cy="31.0003" r="1.66667" transform="rotate(-90 16.3333 31.0003)" />
                <circle cx="31" cy="74.6668" r="1.66667" transform="rotate(-90 31 74.6668)" />
                <circle cx="31" cy="31.0003" r="1.66667" transform="rotate(-90 31 31.0003)" />
                <circle cx="45.6667" cy="74.6668" r="1.66667" transform="rotate(-90 45.6667 74.6668)" />
                <circle cx="45.6667" cy="31.0003" r="1.66667" transform="rotate(-90 45.6667 31.0003)" />
                <circle cx="60.3333" cy="74.6668" r="1.66667" transform="rotate(-90 60.3333 74.6668)" />
                <circle cx="60.3333" cy="31.0001" r="1.66667" transform="rotate(-90 60.3333 31.0001)" />
                <circle cx="88.6667" cy="74.6668" r="1.66667" transform="rotate(-90 88.6667 74.6668)" />
                <circle cx="88.6667" cy="31.0001" r="1.66667" transform="rotate(-90 88.6667 31.0001)" />
                <circle cx="117.667" cy="74.6668" r="1.66667" transform="rotate(-90 117.667 74.6668)" />
                <circle cx="117.667" cy="31.0001" r="1.66667" transform="rotate(-90 117.667 31.0001)" />
                <circle cx="74.6667" cy="74.6668" r="1.66667" transform="rotate(-90 74.6667 74.6668)" />
                <circle cx="74.6667" cy="31.0001" r="1.66667" transform="rotate(-90 74.6667 31.0001)" />
                <circle cx="103" cy="74.6668" r="1.66667" transform="rotate(-90 103 74.6668)" />
                <circle cx="103" cy="31.0001" r="1.66667" transform="rotate(-90 103 31.0001)" />
                <circle cx="132" cy="74.6668" r="1.66667" transform="rotate(-90 132 74.6668)" />
                <circle cx="132" cy="31.0001" r="1.66667" transform="rotate(-90 132 31.0001)" />
                <circle cx="1.66667" cy="60.0003" r="1.66667" transform="rotate(-90 1.66667 60.0003)" />
                <circle cx="1.66667" cy="16.3336" r="1.66667" transform="rotate(-90 1.66667 16.3336)" />
                <circle cx="16.3333" cy="60.0003" r="1.66667" transform="rotate(-90 16.3333 60.0003)" />
                <circle cx="16.3333" cy="16.3336" r="1.66667" transform="rotate(-90 16.3333 16.3336)" />
                <circle cx="31" cy="60.0003" r="1.66667" transform="rotate(-90 31 60.0003)" />
                <circle cx="31" cy="16.3336" r="1.66667" transform="rotate(-90 31 16.3336)" />
                <circle cx="45.6667" cy="60.0003" r="1.66667" transform="rotate(-90 45.6667 60.0003)" />
                <circle cx="45.6667" cy="16.3336" r="1.66667" transform="rotate(-90 45.6667 16.3336)" />
                <circle cx="60.3333" cy="60.0003" r="1.66667" transform="rotate(-90 60.3333 60.0003)" />
                <circle cx="60.3333" cy="16.3336" r="1.66667" transform="rotate(-90 60.3333 16.3336)" />
                <circle cx="88.6667" cy="60.0003" r="1.66667" transform="rotate(-90 88.6667 60.0003)" />
                <circle cx="88.6667" cy="16.3336" r="1.66667" transform="rotate(-90 88.6667 16.3336)" />
                <circle cx="117.667" cy="60.0003" r="1.66667" transform="rotate(-90 117.667 60.0003)" />
                <circle cx="117.667" cy="16.3336" r="1.66667" transform="rotate(-90 117.667 16.3336)" />
                <circle cx="74.6667" cy="60.0003" r="1.66667" transform="rotate(-90 74.6667 60.0003)" />
                <circle cx="74.6667" cy="16.3336" r="1.66667" transform="rotate(-90 74.6667 16.3336)" />
                <circle cx="103" cy="60.0003" r="1.66667" transform="rotate(-90 103 60.0003)" />
                <circle cx="103" cy="16.3336" r="1.66667" transform="rotate(-90 103 16.3336)" />
                <circle cx="132" cy="60.0003" r="1.66667" transform="rotate(-90 132 60.0003)" />
                <circle cx="132" cy="16.3336" r="1.66667" transform="rotate(-90 132 16.3336)" />
                <circle cx="1.66667" cy="45.3336" r="1.66667" transform="rotate(-90 1.66667 45.3336)" />
                <circle cx="1.66667" cy="1.66683" r="1.66667" transform="rotate(-90 1.66667 1.66683)" />
                <circle cx="16.3333" cy="45.3336" r="1.66667" transform="rotate(-90 16.3333 45.3336)" />
                <circle cx="16.3333" cy="1.66683" r="1.66667" transform="rotate(-90 16.3333 1.66683)" />
                <circle cx="31" cy="45.3336" r="1.66667" transform="rotate(-90 31 45.3336)" />
                <circle cx="31" cy="1.66683" r="1.66667" transform="rotate(-90 31 1.66683)" />
                <circle cx="45.6667" cy="45.3336" r="1.66667" transform="rotate(-90 45.6667 45.3336)" />
                <circle cx="45.6667" cy="1.66683" r="1.66667" transform="rotate(-90 45.6667 1.66683)" />
                <circle cx="60.3333" cy="45.3338" r="1.66667" transform="rotate(-90 60.3333 45.3338)" />
                <circle cx="60.3333" cy="1.66707" r="1.66667" transform="rotate(-90 60.3333 1.66707)" />
                <circle cx="88.6667" cy="45.3338" r="1.66667" transform="rotate(-90 88.6667 45.3338)" />
                <circle cx="88.6667" cy="1.66707" r="1.66667" transform="rotate(-90 88.6667 1.66707)" />
                <circle cx="117.667" cy="45.3338" r="1.66667" transform="rotate(-90 117.667 45.3338)" />
                <circle cx="117.667" cy="1.66707" r="1.66667" transform="rotate(-90 117.667 1.66707)" />
                <circle cx="74.6667" cy="45.3338" r="1.66667" transform="rotate(-90 74.6667 45.3338)" />
                <circle cx="74.6667" cy="1.66707" r="1.66667" transform="rotate(-90 74.6667 1.66707)" />
                <circle cx="103" cy="45.3338" r="1.66667" transform="rotate(-90 103 45.3338)" />
                <circle cx="103" cy="1.66707" r="1.66667" transform="rotate(-90 103 1.66707)" />
                <circle cx="132" cy="45.3338" r="1.66667" transform="rotate(-90 132 45.3338)" />
                <circle cx="132" cy="1.66707" r="1.66667" transform="rotate(-90 132 1.66707)" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const modelValue = defineModel<Hero>();
const { linkAttrs } = usePageLinks();

const heroMediaUrl = computed(() => modelValue.value?.images?.[0]?.publicURL);
const heroMediaIsVideo = computed(() =>
	isVideoMediaValue(modelValue.value?.images),
);
</script>

<style scoped>
/* ---------- layout ---------- */
.hero-section {
  position: relative;
  overflow: hidden;
  background-image: linear-gradient(to bottom,
      rgb(var(--primaryColor)),
      rgba(var(--primaryColor), 0.9),
      #ffffff);
}

.dark .hero-section {
  background-image: linear-gradient(to bottom,
      rgb(var(--primaryColor)),
      rgba(var(--primaryColor), 0.9),
      #404040);
}

.container {
  max-width: 85rem;
  margin-inline: auto;
  padding-inline: 1rem;
}

@media(min-width:640px) {
  .container {
    padding-inline: 1.5rem;
  }
}

@media(min-width:1024px) {
  .container {
    padding-inline: 2rem;
  }
}

.hero-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-inline: -1rem;
}

.hero-col {
  width: 100%;
  padding-inline: 1rem;
}

.hero-content {
  max-width: 780px;
  margin-inline: auto;
  text-align: center;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.25rem;
  margin-block: 0 2.5rem;
}

/* ---------- buttons ---------- */
.action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 14px 1.75rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 0.375rem;
  text-align: center;
  border: 1px solid #0000;
  transition: background-color .3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .1), 0 1px 2px rgba(0, 0, 0, .06);
}

.action-primary {
  background: #ffffff;
  color: #000000;
}

.action-primary:hover,
.action-primary:focus {
  background: #e5e7eb;
}

.action-secondary {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

.action-secondary:hover,
.action-secondary:focus {
  background: #ffffff;
  color: #000000;
}

.dark .action-secondary {
  background: #111827;
  border-color: #374151;
  color: #ffffff;
}

.dark .action-secondary:hover,
.dark .action-secondary:focus {
  background: #27272a;
}

.action-arrow {
  flex-shrink: 0;
}

.rtl .action-arrow {
  transform: scaleX(-1);
}

/* ---------- image & decoration ---------- */
.hero-img-box {
  position: relative;
  z-index: 10;
  max-width: 845px;
  margin: 4rem auto 0;
}

.hero-img {
  display: block;
  margin-inline: auto;
  max-width: 100%;
  border-radius: .75rem .75rem 0 0;
}

.hero-deco {
  position: absolute;
  z-index: -1;
  width: 134px;
  height: 106px;
}

.hero-deco-left {
  left: -2.25rem;
  bottom: 0;
}

.hero-deco-right {
  right: -1.5rem;
  top: -1.5rem;
}

.rtl .hero-deco-left {
  left: auto;
  right: -2.25rem;
}

.rtl .hero-deco-right {
  right: auto;
  left: -1.5rem;
}

.hero-deco-left svg {
  fill: rgba(var(--primaryColor), 1);
}

.deco-right-fill {
  fill: #ffffff;
}

.dark .deco-right-fill {
  fill: #404040;
}


.hero-content :deep(.description) {
  color: white;
}

/* ---------- media‑grid tweaks ---------- */

@media(min-width:1536px) {
  .hero-row {
    flex-wrap: nowrap;
  }

  .hero-col:first-child {
    flex: 0 0 50%;
  }

  .hero-img-box {
    margin-top: 4rem;
  }
}
</style>
