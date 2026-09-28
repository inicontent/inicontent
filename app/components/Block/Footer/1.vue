<template>
    <footer class="footer-section">
        <svg class="wave-bg" width="2745" height="488" viewBox="0 0 2745 488" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M0.5 330.864C232.505 403.801 853.749 527.683 1482.69 439.719C2111.63 351.756 2585.54 434.588 2743.87 487"
                class="wave-path" stroke="currentColor" />
            <path
                d="M0.5 308.873C232.505 381.81 853.749 505.692 1482.69 417.728C2111.63 329.765 2585.54 412.597 2743.87 465.009"
                class="wave-path" stroke="currentColor" />
            <path
                d="M0.5 286.882C232.505 359.819 853.749 483.701 1482.69 395.738C2111.63 307.774 2585.54 390.606 2743.87 443.018"
                class="wave-path" stroke="currentColor" />
            <path
                d="M0.5 264.891C232.505 337.828 853.749 461.71 1482.69 373.747C2111.63 285.783 2585.54 368.615 2743.87 421.027"
                class="wave-path" stroke="currentColor" />
            <path
                d="M0.5 242.9C232.505 315.837 853.749 439.719 1482.69 351.756C2111.63 263.792 2585.54 346.624 2743.87 399.036"
                class="wave-path" stroke="currentColor" />
            <path
                d="M0.5 220.909C232.505 293.846 853.749 417.728 1482.69 329.765C2111.63 241.801 2585.54 324.633 2743.87 377.045"
                class="wave-path" stroke="currentColor" />
            <path
                d="M0.5 198.918C232.505 271.855 853.749 395.737 1482.69 307.774C2111.63 219.81 2585.54 302.642 2743.87 355.054"
                class="wave-path" stroke="currentColor" />
            <path
                d="M0.5 176.927C232.505 249.864 853.749 373.746 1482.69 285.783C2111.63 197.819 2585.54 280.651 2743.87 333.063"
                class="wave-path" stroke="currentColor" />
            <path
                d="M0.5 154.937C232.505 227.873 853.749 351.756 1482.69 263.792C2111.63 175.828 2585.54 258.661 2743.87 311.072"
                class="wave-path" stroke="currentColor" />
            <path
                d="M0.5 132.946C232.505 205.882 853.749 329.765 1482.69 241.801C2111.63 153.837 2585.54 236.67 2743.87 289.082"
                class="wave-path" stroke="currentColor" />
            <path
                d="M0.5 110.955C232.505 183.891 853.749 307.774 1482.69 219.81C2111.63 131.846 2585.54 214.679 2743.87 267.091"
                class="wave-path" stroke="currentColor" />
            <path
                d="M0.5 88.9639C232.505 161.901 853.749 285.783 1482.69 197.819C2111.63 109.855 2585.54 192.688 2743.87 245.1"
                class="wave-path" stroke="currentColor" />
            <path
                d="M0.5 66.9729C232.505 139.91 853.749 263.792 1482.69 175.828C2111.63 87.8643 2585.54 170.697 2743.87 223.109"
                class="wave-path" stroke="currentColor" />
            <path
                d="M0.5 44.9819C232.505 117.919 853.749 241.801 1482.69 153.837C2111.63 65.8733 2585.54 148.706 2743.87 201.118"
                class="wave-path" stroke="currentColor" />
            <path
                d="M0.5 22.991C232.505 95.9276 853.749 219.81 1482.69 131.846C2111.63 43.8824 2585.54 126.715 2743.87 179.127"
                class="wave-path" stroke="currentColor" />
            <path
                d="M0.5 1C232.505 73.9367 853.749 197.819 1482.69 109.855C2111.63 21.8914 2585.54 104.724 2743.87 157.136"
                class="wave-path" stroke="currentColor" />
        </svg>

        <div class="links-grid">
            <div v-if="modelValue?.logo || modelValue?.icon || modelValue?.logoType" class="logo-col">
                <a href="/" class="logo-link">
                    <img v-if="modelValue?.icon || modelValue?.logo"
                        :src="modelValue.logo?.publicURL || modelValue.icon?.publicURL" alt="logo" class="logo-img" />
                    <span v-if="modelValue?.logoType" class="logo-text">{{ modelValue.logoType }}</span>
                </a>
                <p v-if="modelValue?.description" class="logo-desc"
                    v-html="modelValue.description.replaceAll('\n', '<br>')"></p>
            </div>

            <div v-for="({ label, link, children }) in modelValue?.menu" :key="label" class="menu-col">
                <h4 class="menu-title">
                    <a v-if="link" v-bind="linkAttrs(link)">{{ label }}</a>
                    <template v-else>{{ label }}</template>
                </h4>
                <ul v-if="children" class="submenu-list">
                    <li v-for="({ label, link }) in children" :key="label">
                        <a v-bind="linkAttrs(link)" class="submenu-link">{{ label }}</a>
                    </li>
                </ul>
            </div>

            <div v-if="modelValue?.newsletter" class="newsletter-col">
                <h4 class="newsletter-title">{{ modelValue?.newsletter.title }}</h4>
                <p v-if="modelValue.newsletter.description" class="newsletter-desc">{{ modelValue.newsletter.description
                }}</p>
                <form class="newsletter-form">
                    <input type="text" :placeholder="modelValue.newsletter.placeholder" class="newsletter-input" />
                    <button type="submit" class="newsletter-btn">
                        <Icon name="tabler:send-2" />
                    </button>
                </form>
            </div>
        </div>

        <div class="footer-bottom">
            <p v-if="modelValue?.copyright" class="copyright-text">© {{ new Date().getFullYear() }} {{
                modelValue.copyright }}
            </p>
            <div v-if="modelValue?.social" class="social-links">
                <a v-for="({ label, link }) in modelValue.social" :key="label" v-bind="linkAttrs(link)" class="social-btn">
                    <Icon v-if="label" :name="`tabler:brand-${label}`" />
                </a>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
const modelValue = defineModel<Footer>();
const { linkAttrs } = usePageLinks();
</script>

<style scoped>
.footer-section {
    position: relative;
    overflow: hidden;
    background-color: #f3f4f6;
    color: #1f2937;
    margin-top: auto;
    padding: 2.5rem 1rem;
}

.dark .footer-section {
    background-color: #1f1f1f;
}

@container (min-width: 640px) {
    .footer-section {
        padding-inline: 1.5rem;
    }
}

@container (min-width: 1024px) {
    .footer-section {
        padding-inline: 2rem;
        padding-block: 2.5rem;
    }
}

.wave-bg {
    position: absolute;
    bottom: -5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 1900px;
    pointer-events: none;
}

.wave-path {
    stroke: rgba(var(--primaryColor), 0.5);
}

.links-grid {
    position: relative;
    z-index: 10;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-block-end: 2.5rem;
}

@container (min-width: 1024px) {
    .links-grid {
    grid-template-columns: repeat(4, 1fr);
    }

    .links-grid:has(.newsletter-col) {
    grid-template-columns: repeat(5, 1fr);
    }

    .logo-col {
        grid-column: span 1 !important;
    }
}

.logo-col {
    grid-column: 1 / -1;
}

.logo-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    text-decoration: none;
}

.dark .logo-link {
    color: #ffffff;
}

.logo-img {
    height: 2rem;
}

.logo-text {
    font-size: 1.5rem;
}

.logo-desc {
    margin-block-start: 0.75rem;
    font-size: 0.875rem;
    color: #374151;
}

.dark .logo-desc {
    color: #9ca3af;
}

.menu-col {
    display: flex;
    flex-direction: column;
}

.menu-title {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #111827;
    margin: 0;
}

.dark .menu-title {
    color: #f3f4f6;
}

.submenu-list {
    margin: 0;
    padding: 0;
    list-style: none;
    margin-block-start: 0.75rem;
}

.submenu-link {
    display: inline-block;
    color: #6b7280;
    text-decoration: none;
    margin-block-end: 0.5rem;
}

.submenu-link:hover,
.submenu-link:focus {
    color: #1f2937;
}

.dark .submenu-link {
    color: #9ca3af;
}

.dark .submenu-link:hover,
.dark .submenu-link:focus {
    color: #f3f4f6;
}

.newsletter-col {
    grid-column: 1 / -1;
}

@container (min-width: 1024px) {
    .newsletter-col {
        grid-column: span 1;
    }
}

.newsletter-title {
    font-weight: 600;
    color: #1f2937;
    margin: 0;
}

.dark .newsletter-title {
    color: #f3f4f6;
}

.newsletter-desc {
    margin-block-start: 0.75rem;
    font-size: 0.875rem;
    color: #374151;
}

.dark .newsletter-desc {
    color: #9ca3af;
}

.newsletter-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-block-start: 1rem;
}

@container (min-width: 640px) {
    .newsletter-form {
        flex-direction: row;
        gap: 0.75rem;
    }
}

.newsletter-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 1px solid transparent;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    color: #1f2937;
    background-color: #ffffff;
}

.dark .newsletter-input {
    background-color: #161616;
    color: #e5e7eb;
}

.newsletter-btn {
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    background-color: rgb(var(--primaryColor));
    color: #ffffff;
    font-size: 0.875rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: background-color 200ms ease-in-out;
}

.rtl .newsletter-btn {
    transform: scaleX(-1);
}

.newsletter-btn:hover,
.newsletter-btn:focus {
    background-color: rgba(var(--primaryColor), 0.9);
}

.footer-bottom {
    position: relative;
    z-index: 10;
    display: grid;
    gap: 0.5rem;
    text-align: center;
    padding-top: 1.25rem;
    border-top: 1px solid #374151;
}

.dark .footer-bottom {
    border-top: 1px solid #fff;
}

@container (min-width: 768px) {
    .footer-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}

.copyright-text {
    font-size: 0.875rem;
    color: #374151;
    margin: 0;
}

.dark .copyright-text {
    color: #9ca3af;
}

.social-links {
    display: inline-flex;
    gap: 0.5rem;
    justify-content: center;
}

.social-btn {
    width: 2.5rem;
    height: 2.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    background: transparent;
    border: 1px solid transparent;
    color: #1f2937;
    transition: background-color 200ms ease-in-out;
}

.dark .social-btn {
    color: #ffffff;
}

.social-btn:hover,
.social-btn:focus {
    background-color: rgba(31, 41, 55, 0.1);
}

.dark .social-btn:hover,
.dark .social-btn:focus {
    background-color: rgba(255, 255, 255, 0.1);
}
</style>