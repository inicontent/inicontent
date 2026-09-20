<template>
    <template v-if="database?.slug">
        <Transition name="chatbot-panel">
            <div v-if="hasOpened" v-show="isOpen" class="floating-chatbot-panel">
                <NCard :bordered="true" class="chatbot-card" content-style="padding: 0;" :segmented="{ content: true }">
                    <template #header>
                        <NFlex align="center" :wrap="false">
                            <NButton type="primary" circle>
                                <Icon name="tabler:robot" />
                            </NButton>
                            <NText strong>{{ t("chatbot") }}</NText>
                        </NFlex>
                    </template>
                    <template #header-extra>
                        <NFlex align="center" :wrap="false" :size="4">
                            <NButton quaternary circle size="small" :title="t('newChat')" :aria-label="t('newChat')" @click="resetNonce++">
                                <template #icon>
                                    <NIcon>
                                        <Icon name="tabler:message-plus" />
                                    </NIcon>
                                </template>
                            </NButton>
                            <NButton quaternary circle size="small" :title="t('close')" :aria-label="t('close')" @click="isOpen = false">
                                <template #icon>
                                    <NIcon>
                                        <Icon name="tabler:x" />
                                    </NIcon>
                                </template>
                            </NButton>
                        </NFlex>
                    </template>
                    <div class="chatbot-body">
                        <LazyChatInterface :key="storageKey" :persist-key="storageKey" :reset-nonce="resetNonce" />
                    </div>
                </NCard>
            </div>
        </Transition>

        <NButton class="floating-chatbot-button" type="primary" circle @click="toggleChatbot">
            <template #icon>
                <NIcon size="24">
                    <Icon :name="isOpen ? 'tabler:x' : 'tabler:message-chatbot'" />
                </NIcon>
            </template>
        </NButton>
    </template>
</template>

<script setup lang="ts">
const database = useState<Database>("database");
const Language = useScopedCookie<LanguagesType>(
	"language",
	database.value?.slug,
);
const isOpen = ref(false);
const hasOpened = ref(false);
const resetNonce = ref(0);

const storageKey = computed(() =>
	database.value?.slug
		? `inicontent:floating-chat:${database.value.slug}:${Language.value}`
		: undefined,
);

const toggleChatbot = () => {
	if (isOpen.value) {
		isOpen.value = false;
		return;
	}
	hasOpened.value = true;
	isOpen.value = true;
};
</script>