<template>
	<div class="domain-page">
		<NCard :title="t('domainUi.addDomain')" class="card">
			<NText depth="3">{{ t("domainUi.subtitle") }}</NText>
			<NText depth="3" class="hint">{{ t("domainUi.domainHint") }}</NText>
			<NForm ref="formRef" :model="formState" :rules="rules" @submit.prevent="addDomain">
				<NFormItem path="domainName" :label="t('domainUi.domainName')">
					<NInputGroup>
						<NInput
							v-model:value="formState.domainName"
							:placeholder="t('domainUi.domainPlaceholder')"
							:disabled="loading || !!removingDomain"
							@update:value="formState.acknowledged = false"
						/>
						<NButton
							type="primary"
							:disabled="!!removingDomain || (isBroadEntry && !formState.acknowledged)"
							:loading="loading"
							attr-type="submit"
						>
							{{ t('domainUi.add') }}
						</NButton>
					</NInputGroup>
				</NFormItem>
			</NForm>

			<NAlert v-if="isBroadEntry" type="warning" :title="t('domainUi.broadWarningTitle')" show-icon class="alert">
				{{ t("domainUi.broadWarning") }}
				<NCheckbox v-model:checked="formState.acknowledged" class="broad-ack">
					{{ t("domainUi.broadAck") }}
				</NCheckbox>
			</NAlert>

			<NAlert v-if="addError" type="error" :title="t('domainUi.addFailed')" show-icon class="alert">
				{{ addError }}
			</NAlert>
		</NCard>

		<NCard :title="t('domainUi.linkedDomains')" class="card">
			<NAlert v-if="removeError" type="error" class="alert">{{ removeError }}</NAlert>
			<NEmpty v-if="!domains.length" :description="t('domainUi.noDomains')" />

			<NList v-else bordered class="domain-list">
				<NListItem v-for="domain in domains" :key="domain" class="domain-item">
					<div class="domain-header">
						<div class="domain-identity">
							<NIcon size="22" class="domain-icon">
								<Icon name="tabler:world" />
							</NIcon>
							<div class="domain-summary">
								<NText strong class="domain-name">{{ domain }}</NText>
								<NTag v-if="isBroadDomain(domain)" type="warning" size="small" :bordered="false">
									{{ t("domainUi.broadBadge") }}
								</NTag>
								<NTag v-else-if="isWildcardDomain(domain)" type="info" size="small" :bordered="false">
									{{ t("domainUi.wildcardBadge") }}
								</NTag>
							</div>
						</div>

						<NFlex :wrap="false" class="domain-actions">
							<NButton
								size="small"
								type="error"
								secondary
								:disabled="loading || !!removingDomain"
								:loading="removingDomain === domain"
								@click="confirmRemove(domain)"
							>
								{{ t('domainUi.remove') }}
							</NButton>
						</NFlex>
					</div>
				</NListItem>
			</NList>
		</NCard>

		<NModal
			v-model:show="showConfirmModal"
			preset="dialog"
			type="error"
			:title="t('domainUi.confirmRemoveTitle')"
			:content="t('domainUi.confirmRemoveBody', { domain: domainToRemove })"
			:positive-text="t('domainUi.remove')"
			:negative-text="t('cancel')"
			@positive-click="removeDomain"
		/>
	</div>
</template>

<script setup lang="ts">
import type { FormInst, FormRules } from "naive-ui";

const database = useState<Database>("database");

const sessionID = useScopedCookie<string>("sid", database.value?.slug);
const sessionQuery = computed(() => ({
	[`${database.value.slug}_sid`]: sessionID.value,
}));

interface DomainResponse {
	result: { domains: string[] } | null;
	message?: string;
}

const domains = computed(() => database.value.domains ?? []);
const loading = ref(false);
const removeError = ref<string | null>(null);
const addError = ref<string | null>(null);
const removingDomain = ref<string | null>(null);
const showConfirmModal = ref(false);
const domainToRemove = ref("");

const formRef = ref<FormInst | null>(null);
const formState = reactive({ domainName: "", acknowledged: false });

const localhostPattern = /^localhost(?::(\*|\d{1,5}))?$/;
const hostnamePattern =
	/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/;

function validPort(value: string) {
	if (!/^\d{1,5}$/.test(value)) return false;
	const port = Number(value);
	return port >= 1 && port <= 65535;
}

function isValidEntry(input: string) {
	const value = input.trim().toLowerCase().replace(/\.$/, "");
	if (value === "*" || value === "*.*") return true;
	if (value.startsWith("*.")) {
		const suffix = value.slice(2);
		if (!suffix || suffix.includes("*")) return false;
		return suffix.split(".").every((label) => /^[a-z0-9-]+$/.test(label));
	}
	const localhost = localhostPattern.exec(value);
	if (localhost) {
		return (
			localhost[1] === undefined ||
			localhost[1] === "*" ||
			validPort(localhost[1])
		);
	}
	return hostnamePattern.test(value);
}

function isBroadEntryValue(input: string) {
	const value = input.trim().toLowerCase();
	return value === "*" || value === "*.*" || /^\*\.[a-z0-9-]+$/.test(value);
}

const isBroadEntry = computed(() => isBroadEntryValue(formState.domainName));
const isBroadDomain = (value: string) => isBroadEntryValue(value);
const isWildcardDomain = (value: string) => value.trim().startsWith("*");

const rules: FormRules = {
	domainName: [
		{
			required: true,
			validator: (_rule, value: string) => {
				if (!value) return new Error(t("domainUi.domainRequired"));
				if (!isValidEntry(value)) return new Error(t("domainUi.domainInvalid"));
				return true;
			},
			trigger: ["blur", "input"],
		},
	],
};

const apiBase = computed(
	() =>
		`${useApiBase()}inicontent/databases/${encodeURIComponent(database.value.slug)}`,
);

async function addDomain() {
	if (loading.value || removingDomain.value) return;
	addError.value = null;
	if (isBroadEntry.value && !formState.acknowledged) {
		addError.value = t("domainUi.broadAckRequired");
		return;
	}
	try {
		await formRef.value?.validate();
	} catch {
		return;
	}

	loading.value = true;
	try {
		const result = await $fetch<DomainResponse>(`${apiBase.value}/domains`, {
			method: "POST",
			credentials: "include",
			query: sessionQuery.value,
			body: { domainName: formState.domainName, originOnly: true },
		});
		if (!result.result)
			throw new Error(result.message ?? t("domainUi.addFailed"));
		database.value.domains = result.result.domains;
		formState.domainName = "";
		formState.acknowledged = false;
	} catch (err: unknown) {
		const message = err as {
			data?: { message?: string };
			message?: string;
		};
		addError.value =
			message.data?.message ?? message.message ?? t("domainUi.addFailed");
	} finally {
		loading.value = false;
	}
}

function confirmRemove(name: string) {
	domainToRemove.value = name;
	showConfirmModal.value = true;
}

async function removeDomain() {
	if (loading.value || removingDomain.value) return;
	removeError.value = null;
	const name = domainToRemove.value;
	removingDomain.value = name;
	try {
		const response = await $fetch<DomainResponse>(
			`${apiBase.value}/domains/${encodeURIComponent(name)}`,
			{
				method: "DELETE",
				credentials: "include",
				query: { ...sessionQuery.value, originOnly: "true" },
			},
		);
		if (!response.result)
			throw new Error(response.message ?? t("domainUi.removeFailed"));
		database.value.domains = response.result.domains;
	} catch (error) {
		removeError.value =
			error instanceof Error ? error.message : t("domainUi.removeFailed");
	} finally {
		removingDomain.value = null;
		domainToRemove.value = "";
	}
}
</script>

<style scoped>
.domain-page {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 24px;
}

.card {
	background: none;
}

.hint {
	display: block;
	margin-top: 4px;
	font-size: 12px;
	overflow-wrap: anywhere;
}

.alert {
	margin-top: 12px;
}

.broad-ack {
	margin-top: 10px;
}

.domain-list {
	overflow: hidden;
}

.domain-item {
	min-width: 0;
}

.domain-header,
.domain-identity,
.domain-summary {
	display: flex;
	align-items: center;
}

.domain-header {
	justify-content: space-between;
	gap: 16px;
}

.domain-identity {
	min-width: 0;
	gap: 10px;
}

.domain-icon {
	flex: 0 0 auto;
}

.domain-summary {
	min-width: 0;
	flex-wrap: wrap;
	gap: 8px;
}

.domain-name {
	overflow-wrap: anywhere;
}

.domain-actions {
	flex: 0 0 auto;
}

@media (max-width: 600px) {
	.domain-header {
		align-items: flex-start;
		flex-direction: column;
	}

	.domain-actions {
		align-self: stretch;
	}

	.domain-actions :deep(.n-button) {
		flex: 1;
	}
}
</style>
