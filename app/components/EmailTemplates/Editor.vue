<template>
	<EmailTemplatesMjmlBuilder
		v-model="draft.content"
		v-model:name="draft.name"
		v-model:subject="draft.subject"
		:existing="!!draft.id"
		:saving="saving"
		@save="save"
	/>
</template>

<script lang="ts" setup>
import Inison from "inison";

// `EmailTemplatesMjmlBuilder` comes from the layer's own components scan — no
// explicit `~/components/...` import, which would resolve against the consuming
// app's srcDir instead of this layer's.

interface EmailTemplate {
	id?: string;
	name?: string;
	subject?: string;
	content?: string;
}

const props = defineProps<{ template?: EmailTemplate | null }>();

const route = useRoute();
const database = useState<Database>("database");
const config = useRuntimeConfig();
const Language = useScopedCookie<LanguagesType>(
	"language",
	database.value?.slug,
);
const sessionID = useScopedCookie<string>("sid", database.value?.slug);

const originalName = computed(() => props.template?.name ?? "");
const draft = reactive<EmailTemplate>({
	id: props.template?.id,
	name: props.template?.name ?? "",
	subject: props.template?.subject ?? "",
	content: props.template?.content ?? "",
});

watch(
	() => props.template,
	(value) => {
		// Keep the draft in sync when the parent reloads the record. Never
		// clobber a fresh (unsaved) form with an empty template.
		if (value?.id) Object.assign(draft, value);
	},
);

const saving = ref(false);

function editPath(name: string) {
	return `${route.params.database ? `/${route.params.database}` : ""}/admin/tables/templates/${encodeURIComponent(name)}`;
}

async function save() {
	if (!draft.name?.trim()) {
		window.$message?.warning(t("emailTemplatesUi.nameRequired"));
		return;
	}

	saving.value = true;
	try {
		const url = `${config.public.apiBase}${database.value.slug}/templates${draft.id ? `/${draft.id}` : ""}`;
		const res = await $fetch<apiResponse<EmailTemplate>>(url, {
			method: draft.id ? "PUT" : "POST",
			body: {
				name: draft.name.trim(),
				subject: draft.subject ?? "",
				content: draft.content ?? "",
			},
			params: {
				locale: Language.value,
				[`${database.value.slug}_sid`]: sessionID.value,
				...(draft.id ? {} : { options: Inison.stringify({ columns: "id" }) }),
			},
			credentials: "include",
		});

		if (!res.result) {
			window.$message?.error(res.message);
			return;
		}

		window.$message?.success(res.message);

		if (!draft.id) {
			// Created — reopen the same template in edit mode
			await navigateTo(editPath(draft.name.trim()));
		} else if (res.result.name && res.result.name !== originalName.value) {
			// Renamed — follow the new URL
			await navigateTo(editPath(res.result.name), { replace: true });
		} else {
			Object.assign(draft, res.result);
		}
	} catch (error: unknown) {
		const message = (error as { data?: { message?: string } })?.data?.message;
		window.$message?.error(message ?? t("emailTemplatesUi.saveFailed"));
	} finally {
		saving.value = false;
	}
}
</script>

<style scoped>
.EmailEditor-card {
	border-radius: 12px;
}
</style>