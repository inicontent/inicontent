<template>
    <header :class="{ 'header--sticky': isSticky }" class="header">
        <nav class="nav">
            <div v-if="modelValue?.logo || modelValue?.icon || modelValue?.logoType" class="logo-col">
                <a :href="$route.params.database ? `/${$route.params.database}/` : '/'" class="logo-link">
                    <img v-if="modelValue?.icon || modelValue?.logo"
                        :src="modelValue?.logo ? modelValue?.logo?.publicURL : modelValue?.icon?.publicURL" alt="logo"
                        class="logo-img" />
                    <span v-if="modelValue?.logoType" class="logo-text">
                        {{ modelValue?.logoType }}
                    </span>
                </a>
            </div>

            <div class="actions-wrapper">
                <button class="theme-toggle" @click="Theme = Theme === 'dark' ? 'light' : 'dark'">
                    <span class="theme-icon-light">
                        <svg class="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M13.3125 1.50001C12.675 1.31251 12.0375 1.16251 11.3625 1.05001C10.875 0.975006 10.35 1.23751 10.1625 1.68751C9.93751 2.13751 10.05 2.70001 10.425 3.00001C13.0875 5.47501 14.0625 9.11251 12.975 12.525C11.775 16.3125 8.25001 18.975 4.16251 19.0875C3.63751 19.0875 3.22501 19.425 3.07501 19.9125C2.92501 20.4 3.15001 20.925 3.56251 21.1875C4.50001 21.75 5.43751 22.2 6.37501 22.5C7.46251 22.8375 8.58751 22.9875 9.71251 22.9875C11.625 22.9875 13.5 22.5 15.1875 21.5625C17.85 20.1 19.725 17.7375 20.55 14.8875C22.1625 9.26251 18.975 3.37501 13.3125 1.50001ZM18.9375 14.4C18.2625 16.8375 16.6125 18.825 14.4 20.0625C12.075 21.3375 9.41251 21.6 6.90001 20.85C6.63751 20.775 6.33751 20.6625 6.07501 20.55C10.05 19.7625 13.35 16.9125 14.5875 13.0125C15.675 9.56251 15 5.92501 12.7875 3.07501C17.5875 4.68751 20.2875 9.67501 18.9375 14.4Z" />
                        </svg>
                    </span>
                    <span class="theme-icon-dark">
                        <svg class="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_2172_3070)">
                                <path
                                    d="M12 6.89999C9.18752 6.89999 6.90002 9.18749 6.90002 12C6.90002 14.8125 9.18752 17.1 12 17.1C14.8125 17.1 17.1 14.8125 17.1 12C17.1 9.18749 14.8125 6.89999 12 6.89999ZM12 15.4125C10.125 15.4125 8.58752 13.875 8.58752 12C8.58752 10.125 10.125 8.58749 12 8.58749C13.875 8.58749 15.4125 10.125 15.4125 12C15.4125 13.875 13.875 15.4125 12 15.4125Z" />
                                <path
                                    d="M12 4.2375C12.45 4.2375 12.8625 3.8625 12.8625 3.375V1.5C12.8625 1.05 12.4875 0.637497 12 0.637497C11.55 0.637497 11.1375 1.0125 11.1375 1.5V3.4125C11.175 3.8625 11.55 4.2375 12 4.2375Z" />
                                <path
                                    d="M12 19.7625C11.55 19.7625 11.1375 20.1375 11.1375 20.625V22.5C11.1375 22.95 11.5125 23.3625 12 23.3625C12.45 23.3625 12.8625 22.9875 12.8625 22.5V20.5875C12.8625 20.1375 12.45 19.7625 12 19.7625Z" />
                                <path
                                    d="M18.1125 6.74999C18.3375 6.74999 18.5625 6.67499 18.7125 6.48749L19.9125 5.28749C20.25 4.94999 20.25 4.42499 19.9125 4.08749C19.575 3.74999 19.05 3.74999 18.7125 4.08749L17.5125 5.28749C17.175 5.62499 17.175 6.14999 17.5125 6.48749C17.6625 6.67499 17.8875 6.74999 18.1125 6.74999Z" />
                                <path
                                    d="M5.32501 17.5125L4.12501 18.675C3.78751 19.0125 3.78751 19.5375 4.12501 19.875C4.27501 20.025 4.50001 20.1375 4.72501 20.1375C4.95001 20.1375 5.17501 20.0625 5.32501 19.875L6.52501 18.675C6.86251 18.3375 6.86251 17.8125 6.52501 17.475C6.18751 17.175 5.62501 17.175 5.32501 17.5125Z" />
                                <path
                                    d="M22.5 11.175H20.5875C20.1375 11.175 19.725 11.55 19.725 12.0375C19.725 12.4875 20.1 12.9 20.5875 12.9H22.5C22.95 12.9 23.3625 12.525 23.3625 12.0375C23.3625 11.55 22.95 11.175 22.5 11.175Z" />
                                <path
                                    d="M4.23751 12C4.23751 11.55 3.86251 11.1375 3.37501 11.1375H1.50001C1.05001 11.1375 0.637512 11.5125 0.637512 12C0.637512 12.45 1.01251 12.8625 1.50001 12.8625H3.41251C3.86251 12.8625 4.23751 12.45 4.23751 12Z" />
                                <path
                                    d="M18.675 17.5125C18.3375 17.175 17.8125 17.175 17.475 17.5125C17.1375 17.85 17.1375 18.375 17.475 18.7125L18.675 19.9125C18.825 20.0625 19.05 20.175 19.275 20.175C19.5 20.175 19.725 20.1 19.875 19.9125C20.2125 19.575 20.2125 19.05 19.875 18.7125L18.675 17.5125Z" />
                                <path
                                    d="M5.32501 4.125C4.98751 3.7875 4.46251 3.7875 4.12501 4.125C3.78751 4.4625 3.78751 4.9875 4.12501 5.325L5.32501 6.525C5.47501 6.675 5.70001 6.7875 5.92501 6.7875C6.15001 6.7875 6.37501 6.7125 6.52501 6.525C6.86251 6.1875 6.86251 5.6625 6.52501 5.325L5.32501 4.125Z" />
                            </g>
                            <defs>
                                <clipPath id="clip0_2172_3070">
                                    <rect width="24" height="24" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </span>
                </button>

                <a v-if="modelValue?.account?.link" v-bind="linkAttrs(modelValue.account.link)" class="account-link"
                    :title="modelValue.account.label">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21a8 8 0 0 0-16 0" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                </a>

                <div v-if="availableLanguages.length > 1" class="language-switcher">
                    <button type="button" class="language-toggle" @click="showLanguageMenu = !showLanguageMenu">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M2 12h20" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
                        </svg>
                    </button>
                    <div v-if="showLanguageMenu" class="language-menu">
                        <button v-for="lang in availableLanguages" :key="lang" type="button"
                            :class="['language-menu__item', { 'language-menu__item--active': lang === Language }]"
                            @click="onSelectLanguage(lang)">
                            {{ languageLabel(lang) }}
                        </button>
                    </div>
                </div>

                <a v-if="modelValue?.buttons" v-for="({ label, link }, index) in modelValue?.buttons" :key="index"
                    v-bind="linkAttrs(link)" :class="modelValue?.buttons?.length === 1 || index === (modelValue?.buttons?.length ?? 0) - 1
                        ? 'action-primary action-link--desktop'
                        : 'action-secondary action-link--desktop'">
                    {{ label }}
                </a>

                <button type="button" class="mobile-menu-button" @click="showMenu = !showMenu">
                    <svg :class="{ 'is-hidden': showMenu }" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                    <svg :class="{ 'is-hidden': !showMenu }" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>
            </div>

            <div :class="{ 'is-hidden': !showMenu }" class="nav-menu">
                <div class="nav-menu__items">
                    <div v-for="({ label, link }, index) in modelValue?.menu" :key="index">
                        <a v-bind="linkAttrs(link)" :class="['nav-menu__link', { 'nav-menu__link--active': index === 0 }]">
                            {{ label }}
                        </a>
                    </div>
                    <div class="mobile-actions-container">
                        <a v-if="modelValue?.buttons" v-for="({ label, link }, index) in modelValue?.buttons"
                            :key="index" v-bind="linkAttrs(link)" :class="modelValue?.buttons?.length === 1 || index === (modelValue?.buttons?.length ?? 0) - 1
                                ? 'action-primary mobile-action-link'
                                : 'action-secondary mobile-action-link'">
                            {{ label }}
                        </a>
                        <a v-if="modelValue?.account?.link" v-bind="linkAttrs(modelValue.account.link)"
                            class="action-secondary mobile-action-link">
                            {{ modelValue.account.label }}
                        </a>
                        <button v-if="availableLanguages.length > 1" v-for="lang in availableLanguages" :key="lang"
                            type="button"
                            :class="['mobile-action-link', lang === Language ? 'action-primary' : 'action-secondary']"
                            @click="onSelectLanguage(lang)">
                            {{ languageLabel(lang) }}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    </header>
</template>

<script lang="ts" setup>
const modelValue = defineModel<Header>();
const { linkAttrs } = usePageLinks();
const { availableLanguages, switchLanguage } = usePageLanguages();

const database = useState<Database>("database");
const Language = useScopedCookie<LanguagesType>("language", database.value?.slug);

const showMenu = ref(false);
const isSticky = ref(false);
const showLanguageMenu = ref(false);

const Theme = useCookie<"light" | "dark">("theme", { sameSite: true });

function languageLabel(lang: LanguagesType) {
	try {
		return (
			new Intl.DisplayNames([Language.value ?? "en"], {
				type: "language",
			}).of(lang) ?? lang
		);
	} catch {
		return lang;
	}
}

function onSelectLanguage(lang: LanguagesType) {
	switchLanguage(lang);
	showLanguageMenu.value = false;
}

onMounted(() => {
	if (window.scrollY >= 15) isSticky.value = true;
	function handleScroll() {
		isSticky.value = window.scrollY >= 15;
	}
	window.addEventListener("scroll", handleScroll);
	onUnmounted(() => {
		window.removeEventListener("scroll", handleScroll);
	});
});
</script>

<style scoped>
.header {
    background-color: rgba(255, 255, 255, 0.8);
    position: sticky;
    top: 0;
    display: flex;
    flex-wrap: wrap;
    z-index: 50;
    width: 100%;
    padding: 1.75rem 0;
    transition: all 150ms ease-in-out;
}

.dark .header {
    background-color: rgba(17, 17, 17, 0.9);
}

.header--sticky {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -2px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(12px);
}

.nav {
    position: relative;
    max-width: 80rem;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 0 1rem;
    margin: 0 auto;
}

.logo-link {
    display: flex;
    align-items: center;
}

.logo-link>*+* {
    margin-left: 0.75rem;
}

.rtl .logo-link>*+* {
    margin-left: 0;
    margin-right: 0.75rem;
}

.logo-img {
    height: 2rem;
    width: auto !important;
}

.logo-text {
    align-self: center;
    font-size: 1.5rem;
    font-weight: 600;
    white-space: nowrap;
    color: #111827;
}

.dark .logo-text {
    color: #ffffff;
}

.actions-wrapper {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-inline-start: auto;
    padding: 0.25rem 0;
}

.theme-toggle {
    display: inline-flex;
    align-items: center;
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
}

.account-link {
    display: inline-flex;
    align-items: center;
    color: #000;
    outline: none;
}

.dark .account-link {
    color: #fff;
}

.account-link:hover,
.account-link:focus {
    color: rgb(var(--primaryColor));
}

.language-switcher {
    position: relative;
    display: inline-flex;
}

.language-toggle {
    display: inline-flex;
    align-items: center;
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
    color: #000;
}

.dark .language-toggle {
    color: #fff;
}

.language-toggle:hover,
.language-toggle:focus {
    color: rgb(var(--primaryColor));
}

.language-menu {
    position: absolute;
    top: calc(100% + 0.5rem);
    inset-inline-end: 0;
    display: flex;
    flex-direction: column;
    min-width: 8rem;
    padding: 0.375rem;
    border-radius: 0.5rem;
    background-color: #fff;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    z-index: 10;
}

.dark .language-menu {
    background-color: #111827;
}

.language-menu__item {
    display: block;
    width: 100%;
    padding: 0.375rem 0.625rem;
    border: none;
    background: none;
    text-align: start;
    font-size: 0.875rem;
    color: #000;
    border-radius: 0.375rem;
    cursor: pointer;
}

.dark .language-menu__item {
    color: #fff;
}

.language-menu__item:hover,
.language-menu__item:focus {
    background-color: #f3f4f6;
}

.dark .language-menu__item:hover,
.dark .language-menu__item:focus {
    background-color: rgba(255, 255, 255, 0.1);
}

.language-menu__item--active {
    font-weight: 700;
    color: rgb(var(--primaryColor));
}

.theme-icon-light {
    display: block;
    color: #000;
}

.dark .theme-icon-light {
    display: none;
}

.theme-icon-dark {
    display: none;
    color: #fff;
}

.dark .theme-icon-dark {
    display: block;
}

.theme-icon-light svg,
.theme-icon-dark svg {
    fill: currentColor;
}

.action-link--desktop {
    display: none;
    padding: 0.5rem 0.75rem;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.75rem;
    outline: none;
}

.mobile-menu-button {
    display: block;
    background: none;
    border: none;
    color: #000;
}

.dark .mobile-menu-button {
    color: #fff;
}

.is-hidden {
    display: none;
}

.nav-menu {
    overflow: hidden;
    transition: all 300ms ease-in-out;
    flex-basis: 100%;
    flex-grow: 1;
}

.nav-menu__items {
    display: flex;
    flex-direction: column;
    gap: 1rem 0;
    margin-top: 1.25rem;
}

.nav-menu__link {
    display: inline-block;
    color: #000;
    transition: color 150ms ease-in-out;
    outline: none;
}

.nav-menu__link:hover,
.nav-menu__link:focus {
    color: #4b5563;
}

.dark .nav-menu__link {
    color: #fff;
}

.dark .nav-menu__link:hover,
.dark .nav-menu__link:focus {
    color: #d1d5db;
}

.nav-menu__link--active {
    position: relative;
}

.nav-menu__link--active::before {
    content: "";
    position: absolute;
    bottom: 0.125rem;
    left: 0;
    width: 100%;
    height: 0.25rem;
    background-color: rgb(var(--primaryColor));
    z-index: 1;
}

.mobile-actions-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    border-top: 1px solid #e5e7eb;
    padding-top: 1rem;
}

.mobile-action-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.75rem;
    outline: none;
}

.action-primary {
    background-color: rgb(var(--primaryColor));
    color: #fff;
}

.action-primary:hover,
.action-primary:focus {
    filter: brightness(0.9);
}

.action-secondary {
    background-color: #fff;
    border: 1px solid #e5e7eb;
    color: #000;
}

.action-secondary:hover,
.action-secondary:focus {
    background-color: #f3f4f6;
}

.dark .action-secondary {
    background-color: #111827;
    border-color: #374151;
    color: #fff;
}

.dark .action-secondary:hover,
.dark .action-secondary:focus {
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
}

@container (min-width: 1024px) {
    .nav {
        padding: 0 1.5rem;
    }

    .header {
        justify-content: flex-start;
        flex-wrap: nowrap;
    }

    .nav {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
    }

    .logo-col {
        grid-column: span 3 / span 3;
    }

    .actions-wrapper {
        gap: 0.5rem;
        padding-inline-start: 1.5rem;
        order: 3;
        grid-column: span 3 / span 3;
    }

    .action-link--desktop {
        display: inline-flex;
    }

    .mobile-menu-button {
        display: none;
    }

    .nav-menu {
        display: block;
        width: auto;
        flex-basis: auto;
        order: 2;
        grid-column: span 6 / span 6;
    }

    .nav-menu__items {
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 0 1.75rem;
        margin-top: 0;
    }

    .mobile-actions-container {
        display: none;
    }
}
</style>