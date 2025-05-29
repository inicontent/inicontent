<template>
	<div>
		<NButton class="flowSaveButton" round secondary :loading="Loading.updateTable" type="primary" size="large"
			@click="saveFlow">
			<template #icon>
				<NIcon>
					<Icon name="tabler:device-floppy" />
				</NIcon>
			</template>
		</NButton>
		<NTabs type="segment" animated v-model:value="currentFlow">
			<NTabPane v-for="flowName of flowNames" :name="flowName" :tab="t(flowName)">
				<Draggable v-model="tableCopy[flowName]" group="flows" itemKey="id" handle=".handle" class="masonry">
					<template #item="{ element, index }">
						<NCard class="flowCard" hoverable content-style="padding: 0">
							<NButton class="handle" secondary type="primary" size="small">
								{{ index + 1 }}
							</NButton>
							<NButtonGroup class="flowCardButtons" vertical size="small">
								<NButton secondary type="primary" @click="currentFlowCard =
									currentFlowCard ===
										`${currentFlow}-${index}`
										? undefined
										: `${currentFlow}-${index}`">
									<template #icon>
										<NIcon>
											<Icon name="tabler:eye"
												v-if="currentFlowCard === `${currentFlow}-${index}`" />
											<Icon name="tabler:pencil" v-else />
										</NIcon>
									</template>
								</NButton>
								<NButton secondary type="error"
									@click="() => { if (currentFlowCard === `${currentFlow}-${index}`) currentFlowCard = undefined; tableCopy[flowName]?.splice(index, 1) }">
									<template #icon>
										<NIcon>
											<Icon name="tabler:trash" />
										</NIcon>
									</template>
								</NButton>
							</NButtonGroup>
							<NScrollbar x-scrollable>
								<template v-if="currentFlowCard === `${currentFlow}-${index}`">
									<Draggable v-model="element.value" group="rules" itemKey="id" handle=".inputHandle"
										class="flowCardRulesEdit">
										<template #item="{ element: rule, index: ruleIndex }">
											<NInputGroup :key="rule.id" class="flowCardRulesGroupInput">
												<template v-if="rule.value[0] === 'set'">
													<NDropdown v-bind="ruleDropdownProps(element.value, ruleIndex)">
														<NButton class="inputHandle" size="small" type="success"
															:style="{ borderRadius: Language === 'ar' ? '0 50px 50px 0!important' : '50px 0 0 50px!important' }"
															secondary style="width: 47px;">
															{{ t('set') }}
														</NButton>
													</NDropdown>
													<NCascader size="small" style="height: fit-content;"
														:options="generateFlowCascaderOptions(true, true)"
														check-strategy="child" expand-trigger="click" show-path
														separator="." filterable v-model:value="rule.value[1]" />
													<NSelect size="small"
														:style="{ borderRadius: Language === 'ar' ? '50px 0 0 50px!important' : '0 50px 50px 0!important' }"
														style="overflow: hidden;" :consistent-menu-width="false"
														filterable tag
														:options="generateFlowSelectOptions(rule.value[1], false, true)"
														:value="String(rule.value[2])"
														@update:value="(value) => rule.value[2] = value === 'null' ? null : value" />
												</template>
												<template v-else-if="rule.value[0] === 'error'">
													<NDropdown v-bind="ruleDropdownProps(element.value, ruleIndex)">
														<NButton class="inputHandle" size="small" type="error" secondary
															:style="{ borderRadius: Language === 'ar' ? '0 50px 50px 0!important' : '50px 0 0 50px!important' }"
															style="width: 96px;">
															{{ t('throwError') }}
														</NButton>
													</NDropdown>
													<NSelect size="small"
														:style="{ borderRadius: Language === 'ar' ? '50px 0 0 50px!important' : '0 50px 50px 0!important' }"
														style="overflow: hidden;" :consistent-menu-width="false"
														filterable tag
														:options="[{ label: t('accessDenied'), value: 'accessDenied' }]"
														v-model:value="rule.value[1]" />
												</template>
												<template v-else-if="rule.value[0] === 'unset'">
													<NDropdown v-bind="ruleDropdownProps(element.value, ruleIndex)">
														<NButton class="inputHandle" size="small" type="warning"
															:style="{ borderRadius: Language === 'ar' ? '0 50px 50px 0!important' : '50px 0 0 50px!important' }"
															secondary style="width: 96px;">
															{{ t('unset') }}
														</NButton>
													</NDropdown>
													<NCascader size="small"
														:style="{ borderRadius: Language === 'ar' ? '50px 0 0 50px!important' : '0 50px 50px 0!important' }"
														style="overflow: hidden;height: fit-content;"
														:options="generateFlowCascaderOptions()" check-strategy="parent"
														expand-trigger="click" show-path separator="." filterable
														v-model:value="rule.value[1]" multiple :max-tag-count="1" />
												</template>
												<template v-else>
													<NDropdown v-bind="ruleDropdownProps(element.value, ruleIndex)">
														<NButton class="inputHandle" size="small" type="info" secondary
															style="width: 37px;"
															:style="{ borderRadius: Language === 'ar' ? '0 50px 50px 0!important' : '50px 0 0 50px!important' }">
															{{ t('if') }}
														</NButton>
													</NDropdown>
													<NCascader size="small"
														style="height: fit-content;max-width: 156px;"
														:options="[...generateFlowCascaderOptions(true, true, true), { label: '@method', value: '@method' }]"
														check-strategy="child" expand-trigger="click" show-path
														separator="." filterable v-model:value="rule.value[0]" />
													<NSelect size="small" style="width: 136px;"
														:consistent-menu-width="false" filterable
														:render-tag="({ option }) => option.value"
														:options="checkFieldType(formatValue(rule.value[0], undefined, 'type', 'string'), ['number', 'date']) ? comparisonOperatorOptions().filter(({ value }) => !['*', '!*'].includes(value)) : comparisonOperatorOptions().filter(({ value }) => !['>', '>=', '<', '<=', ...(rule[0] === '@method' ? ['*', '!*'] : [])].includes(value))"
														v-model:value="rule.value[1]" />
													<NSelect size="small" style="overflow: hidden;"
														:style="{ borderRadius: Language === 'ar' ? '50px 0 0 50px!important' : '0 50px 50px 0!important' }"
														:consistent-menu-width="false" filterable tag
														:options="generateFlowSelectOptions(rule.value[0], false, true)"
														:multiple="['[]', '![]'].includes(rule.value[1] ?? '')"
														max-tag-count="responsive"
														:value="((['[]', '![]'].includes(rule.value[1] ?? '') ? rule.value[2] : rule.value[2]) as string)"
														@update:value="(value) => rule.value[2] = value === 'null' ? null : value" />
												</template>
											</NInputGroup>
										</template>
										<template #footer>
											<NDropdown show-arrow :options="addRuleDropdownOptions"
												@select="(value) => pushRuleToFlow(element.value, value)">
												<NButton style="margin: auto" round dashed
													@click="pushRuleToFlow(element.value, 'if')">
													<template #icon>
														<NIcon>
															<Icon name="tabler:plus" />
														</NIcon>
													</template>
												</NButton>
											</NDropdown>
										</template>
									</Draggable>
								</template>
								<NEmpty v-else-if="!element.value.length" />
								<NFlex v-else vertical style="padding: 20px 22px;">
									<template v-for="{ value: [firstValue, secondValue, thirdValue] } of element.value">
										<template v-if="firstValue === 'set'">
											<NFlex align="center" :wrap="false">
												<NFlex :wrap="false" :size="0">
													<NTag type="success" :bordered="false" style="padding: 0 13px"
														:style="{ borderRadius: Language === 'ar' ? '0 50px 50px 0' : '50px 0 0 50px' }">
														{{ t('set') }}
													</NTag>
													<NTag type="primary" :bordered="false"
														:style="{ borderRadius: Language === 'ar' ? '50px 0 0 50px' : '0 50px 50px 0', padding: '0 10px 0' }">
														{{ formatValue(secondValue) }}
													</NTag>
												</NFlex>
												<NTag v-if="thirdValue === undefined" :bordered="false" round>--
												</NTag>
												<NFlex v-else :wrap="false" :size="[4, 8]">
													<NTag
														v-for="value of ([] as string[]).concat(thirdValue as string | string[])"
														:bordered="false" round>
														{{ formatValue(value, secondValue) }}
													</NTag>
												</NFlex>
											</NFlex>
										</template>
										<template v-else-if="firstValue === 'error'">
											<NFlex :wrap="false" :size="0">
												<NTag type="error" :bordered="false"
													:style="{ borderRadius: Language === 'ar' ? '0 50px 50px 0' : '50px 0 0 50px' }"
													style="padding: 0 13px;">
													{{ t('throwError') }}
												</NTag>
												<NTag :bordered="false"
													:style="{ borderRadius: Language === 'ar' ? '50px 0 0 50px' : '0 50px 50px 0', padding: '0 10px 0' }">
													{{ secondValue ? t(secondValue) : '--' }}
												</NTag>
											</NFlex>
										</template>
										<template v-else-if="firstValue === 'unset'">
											<NFlex :wrap="false" :size="0">
												<NTag type="warning" :bordered="false" round
													:style="{ margin: Language === 'ar' ? '0 0 0 10px' : '0 10px 0 0' }">
													{{ t('unset') }}
												</NTag>
												<NFlex
													v-if="(Array.isArray(secondValue) && secondValue.length) || secondValue"
													:size="[4, 8]">
													<NTag
														v-for="value of ([] as string[]).concat(secondValue as string | string[])"
														:bordered="false" round>
														{{ formatValue(value) }}
													</NTag>
												</NFlex>
												<NTag v-else :bordered="false" round>
													--
												</NTag>
											</NFlex>
										</template>
										<template v-else>
											<NFlex align="center" :wrap="false">
												<NFlex :wrap="false" :size="0">
													<NTag type="info" :bordered="false" style="padding: 0 13px;"
														:style="{ borderRadius: Language === 'ar' ? '0 50px 50px 0' : '50px 0 0 50px' }">
														{{ t('if') }}
													</NTag>
													<NTag type="primary" :bordered="false"
														:style="{ borderRadius: Language === 'ar' ? '50px 0 0 50px' : '0 50px 50px 0', padding: '0 10px 0' }">
														{{ formatValue(firstValue) }}
													</NTag>
												</NFlex>
												<NTooltip :delay="1500">
													<template #trigger>
														<NTag round :bordered="false" size="small">
															{{ secondValue }}
														</NTag>
													</template>
													{{comparisonOperatorOptions().find(
														({ value }) => value === (secondValue ?? '='),
													)?.label}}
												</NTooltip>
												<NTag v-if="thirdValue === undefined" :bordered="false" round>--
												</NTag>
												<NFlex v-else :wrap="false" :size="[4, 8]">
													<NTag
														v-for="value of ([] as string[]).concat(thirdValue as string | string[])"
														:bordered="false" round>
														{{ value === null ? '@null' : formatValue(value, firstValue) }}
													</NTag>
												</NFlex>
											</NFlex>
										</template>
									</template>
								</NFlex>
							</NScrollbar>
						</NCard>
					</template>
					<template #footer>
						<NPopover placement="bottom" :delay="1500">
							<template #trigger>
								<NCard style="cursor: pointer;" content-style="padding: 34px 0" hoverable @click="() => {
									if (tableCopy[flowName] && Array.isArray(tableCopy[flowName]))
										currentFlowCard = `${currentFlow}-${tableCopy[flowName].push({ id: randomID(), value: [] }) - 1}`;
									else {
										tableCopy[flowName] = [{ id: randomID(), value: [] }];
										currentFlowCard = `${currentFlow}-${0}`;
									}
								}">
									<NFlex justify="center" align="center">
										<NIcon :size="36">
											<Icon name="tabler:plus" />
										</NIcon>
									</NFlex>
								</NCard>
							</template>
							{{ t('newCard') }}
						</NPopover>
					</template>
				</Draggable>
			</NTabPane>
		</NTabs>
	</div>
</template>

<script lang="ts" setup>
import {
	flattenSchema,
	isArrayOfObjects,
	isObject,
	isValidID,
} from "inibase/utils"
import type { CascaderOption, SelectGroupOption, SelectOption } from "naive-ui"
import Draggable from "vuedraggable"
import { Icon, NIcon } from "#components"

onMounted(() => {
	document.onkeydown = (e) => {
		if (
			!(
				(e.ctrlKey || e.metaKey) &&
				(e.key.toLowerCase() === "s" || e.key === "س")
			)
		)
			return
		e.preventDefault()
		saveFlow()
	}
})

defineTranslation({
	ar: {
		accessDenied: "لا توجد صلاحيات كافية",
		delete: "حذف",
		throwError: "خطأ",
		set: "تعيين",
		unset: "إفراغ",
		if: "إذا",
		or: "أو",
		newCard: "بطاقة جديدة",
		onRequest: "عند الطلب",
		onResponse: "عند العرض",
		condition: "شرط",
	},
})

const Language = useCookie<LanguagesType>("language", { sameSite: true })

const appConfig = useAppConfig()
const Loading = useState<Record<string, boolean>>("Loading", () => ({}))
const database = useState<Database>("database")
const table = useState<Table>("table")
const tableCopy = ref<any>(toRaw(table.value))
const currentFlow = ref<string>("onRequest")
const currentFlowCard = ref<string>()

async function saveFlow() {
	Loading.value.updateTable = true
	const bodyContent = toRaw(tableCopy.value)

	// Remove id and replace with value property before sending
	for (const flowName of flowNames) {
		bodyContent[flowName] = bodyContent[flowName]?.map((item: any) =>
			item.value?.map((rule: any) => rule.value),
		)
	}

	const data = await $fetch<apiResponse>(
		`${appConfig.apiBase}inicontent/databases/${
			database.value.slug
		}/${table.value.slug}`,
		{
			method: "PUT",
			body: (({ onResponse, onRequest }) => ({
				onResponse,
				onRequest,
			}))(bodyContent),
			params: {
				locale: Language.value,
			},
			credentials: "include",
		},
	)

	if (data.result) {
		tableCopy.value = formatFlow(data.result)
		window.$message.success(data.message)
	} else window.$message.error(data.message)
	Loading.value.updateTable = false
}

const flowNames = ["onRequest", "onResponse"] as const
// Ensure each flow item has a unique id and a value property
function formatFlow(_table: Table) {
	for (const flowName of flowNames) {
		_table[flowName] = _table[flowName]?.map((item: any) => {
			if (!item.id) {
				return {
					id: randomID(),
					value: item.map((rule: any) => ({ id: randomID(), value: rule })),
				}
			}
			return item
		})
	}
	return _table
}

formatFlow(tableCopy.value)

function ruleDropdownProps(flow: FlowType, index: number) {
	return {
		options: [
			{
				label: t("delete"),
				key: "delete",
				icon: () => h(NIcon, () => h(Icon, { name: "tabler:trash" })),
			},
		],
		onSelect(key: string) {
			switch (key) {
				case "delete":
					flow.splice(index, 1)
					break
			}
		},
	}
}
function schemaToOptions(schema: Schema, prefix = "@data") {
	const options: CascaderOption[] = []
	for (const field of schema) {
		let option: CascaderOption = {
			label: field.key,
			value: `${prefix}.${field.id}`,
		}
		if (isArrayOfObjects(field.children))
			option.children = schemaToOptions(field.children, prefix)
		options.push(option)
	}
	return options
}
function generateFlowCascaderOptions(
	withWhere?: boolean,
	withWhereOr?: boolean,
	withUser?: boolean,
) {
	const result: CascaderOption[] = []
	if (withUser) {
		let userSchema = database.value.tables?.find(
			({ slug }) => slug === "users",
		)?.schema
		if (userSchema) {
			userSchema = flattenSchema(userSchema as any)
			result.push({
				label: "@user",
				value: "@user",
				children: userSchema.map(({ id, key }) => ({
					label: key,
					value: `@user.${id}`,
				})),
			})
		}
	}
	if (table.value.schema) {
		if (withWhere)
			result.push({
				label: "@where",
				value: "@where",
				children: [
					...(withWhereOr
						? [
								{
									label: t("or"),
									value: "@where.or",
									children: schemaToOptions(table.value.schema, "@where.or"),
								},
							]
						: []),
					...schemaToOptions(table.value.schema, "@where"),
				],
			})
		result.push({
			label: "@data",
			value: "@data",
			children: schemaToOptions(table.value.schema),
		})
	}
	return result
}
function generateFlowSelectOptions(
	value: string | null,
	withWhereOr = true,
	withUser?: boolean,
) {
	const result: (SelectOption | SelectGroupOption)[] = []
	if (value === "@method")
		return ["get", "post", "put", "delete"].map((method) => ({
			label: method.toUpperCase(),
			value: method.toUpperCase(),
		}))

	let schema: Schema = []
	if (table.value.schema) {
		schema = flattenSchema(table.value.schema as any) as Schema
		if (value) {
			let userSchema = database.value.tables?.find(
				({ slug }) => slug === "users",
			)?.schema
			if (userSchema) userSchema = flattenSchema(userSchema as any)
			const field = (value.startsWith("@user.") ? userSchema : schema)?.find(
				({ id }) => id === value.slice(6),
			)
			if (field?.options)
				field.options.map((_value) =>
					result.push(
						(isObject(_value)
							? _value
							: Array.isArray(_value)
								? { label: _value[0], value: _value[0] }
								: {
										label: _value,
										value: _value,
									}) as any,
					),
				)
		}
	}

	result.push({
		label: "@null",
		value: "undefined",
	})

	if (
		value &&
		(value === "@user.4" ||
			(table.value.slug === "users" && value.endsWith(".4")))
	)
		// @user.role
		result.push({
			key: "@role",
			label: "@role",
			type: "group",
			children: database.value.roles?.map(({ name, id }) => ({
				label: name,
				value: id,
			})),
		})
	if (withUser) {
		let userSchema = database.value.tables?.find(
			({ slug }) => slug === "users",
		)?.schema
		if (userSchema) {
			userSchema = flattenSchema(userSchema as any)
			result.push({
				key: "@user",
				label: "@user",
				type: "group",
				children: userSchema.map(({ id, key }) => ({
					label: `@user.${key}`,
					value: `@user.${id}`,
				})),
			})
		}
	}
	if (schema) {
		result.push({
			key: "@where",
			label: "@where",
			type: "group",
			children: [
				...(withWhereOr
					? [
							{
								key: "@where.or",
								label: "or",
								type: "group",
								children: schema.map(({ id, key }) => ({
									label: `@where.or.${key}`,
									value: `@where.or.${id}`,
								})),
							},
						]
					: []),
				...schema.map(({ id, key }) => ({
					label: `@where.${key}`,
					value: `@where.${id}`,
				})),
			],
		})
		result.push({
			key: "@data",
			label: "@data",
			type: "group",
			children: schema.map(({ id, key }) => ({
				label: `@data.${key}`,
				value: `@data.${id}`,
			})),
		})
	}
	return result
}

function formatValue(
	value?: string | number | boolean | null,
	parentKey?: string,
	property: keyof Field = "key",
	defaultValue?: string,
) {
	if (
		parentKey &&
		(parentKey === "@user.4" ||
			(table.value.slug === "users" && parentKey.endsWith(".4"))) &&
		isValidID(value)
	)
		return (
			database.value.roles?.find(({ id }) => id === value)?.name ?? "@undefined"
		)

	if (
		value &&
		typeof value === "string" &&
		(value.startsWith("@user.") ||
			value.startsWith("@data.") ||
			value.startsWith("@where."))
	) {
		const splitedValue = value.split("."),
			lastItem = splitedValue.pop()
		let schema =
			splitedValue[0] === "@user"
				? database.value?.tables?.find(({ slug }) => slug === "users")?.schema
				: table.value.schema
		if (schema) {
			schema = flattenSchema(schema as any, true)
			const item = schema.find(({ id }) => id === lastItem)

			if (!item) return undefined

			if (property === "key") return `${splitedValue.join(".")}.${item?.key}`

			return (item as any)[property] ?? defaultValue
		}
	}
	return value || defaultValue
}

const addRuleDropdownOptions = [
	{
		key: "if",
		label: t("condition"),
	},
	{
		key: "set",
		label: t("set"),
		show: table.value.slug !== "assets",
	},
	{
		key: "unset",
		label: t("unset"),
		show: table.value.slug !== "assets",
	},
	{
		key: "error",
		label: t("throwError"),
	},
]

function pushRuleToFlow(flow: any, value: "if" | "set" | "unset" | "error") {
	switch (value) {
		case "if":
			flow.push({ id: randomID(), value: [null, null, null] })
			break
		case "set":
			flow.push({ id: randomID(), value: ["set", null, null] })
			break
		default:
			flow.push({ id: randomID(), value: [value, null] })
			break
	}
}

useHead({
	title: `${t(database.value.slug)} | ${t(table.value.slug)} : ${t("flows")}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
})
</script>

<style scoped>
.handle,
.inputHandle {
	cursor: move;
}

.rtl .handle {
	left: auto;
	right: 0;
	border-radius: 0 0 0 50px;
}

.handle {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 9;
	border-radius: 0 0 50px 0;
}

.masonry {
	column-count: 1;
	column-gap: 1rem;
	width: 100%;
}

.masonry>* {
	break-inside: avoid;
	margin-bottom: 1rem;
	position: relative;
}

@media only screen and (min-width: 869px) and (max-width: 1200px) {
	.masonry {
		columns: 2;
	}
}

@media only screen and (min-width: 1201px) {
	.masonry {
		columns: 3;
	}
}

.flowCard:hover .flowCardButtons {
	visibility: visible;
}

.rtl .flowCardButtons {
	left: 0;
	right: auto;
}

.flowCardButtons {
	position: absolute;
	top: 0;
	right: 0;
	z-index: 9;
	visibility: hidden;
}

.rtl .flowSaveButton {
	left: 20px;
	right: auto;
}

.flowSaveButton {
	position: fixed;
	bottom: 20px;
	right: 20px;
	z-index: 9999;
}

.flowCardRulesEdit {
	display: flex;
	flex-flow: column;
	justify-content: start;
	gap: 8px 12px;
	padding: 20px 22px;
}

.rtl .flowCardRulesGroupInput {
	flex-direction: row !important;
}
</style>