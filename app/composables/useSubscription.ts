interface PricingData {
	plans: any[];
	additionalStorage: any;
	estimatedMonthly?: any;
}

interface SubscriptionData {
	status: string;
	plan: string;
	paypalSubscriptionId?: string;
	periodStart?: number;
	periodEnd?: number;
	database_storage_gb?: number;
	asset_storage_gb?: number;
	credit?: number;
	autoCharge?: boolean;
	autoRenew?: boolean;
	custom_monthly_amount_cents?: number;
	custom_usage_price_cents_per_gb?: number;
	emailsSent?: number;
	emailsLimit?: number;
	emailsExceeded?: number;
}

interface UsageData {
	database_storage_used_gb: number;
	asset_storage_used_gb: number;
	updated_at: number;
	emailsSent?: number;
	emailsLimit?: number;
	emailsExceeded?: number;
}

interface Database {
	id: string;
	slug: string;
	[key: string]: any;
}

// Shared in-flight promise so simultaneously mounted components don't trigger duplicate fetches
let loadSubscriptionDataPromise: Promise<void> | null = null;

export const useSubscription = () => {
	// useState keeps this reactive state shared across every component using the composable
	const pricing = useState<PricingData | null>(
		"subscription-pricing",
		() => null,
	);
	const subscription = useState<SubscriptionData | null>(
		"subscription-data",
		() => null,
	);
	const usage = useState<UsageData | null>("subscription-usage", () => null);
	const loading = useState("subscription-loading", () => false);
	const error = useState<string | null>("subscription-error", () => null);
	const config = useRuntimeConfig();
	const database = useState<Database>("database");
	const sessionID = useScopedCookie<string>("sid", database.value?.slug);

	// Storage configuration
	const selectedDatabaseStorage = useState(
		"subscription-selected-database-storage",
		() => 0.5,
	);
	const selectedAssetStorage = useState(
		"subscription-selected-asset-storage",
		() => 5,
	);

	// Computed properties
	const isDatabaseStorageExceeded = computed(() => {
		if (!subscription.value || !usage.value) return false;
		const limit = subscription.value.database_storage_gb || 0.5;
		return usage.value.database_storage_used_gb > limit;
	});

	const isAssetStorageExceeded = computed(() => {
		if (!subscription.value || !usage.value) return false;
		const limit = subscription.value.asset_storage_gb || 5;
		return usage.value.asset_storage_used_gb > limit;
	});

	const hasActiveSubscription = computed(
		() => subscription.value?.status === "active",
	);

	const storagePercentageDB = computed(() => {
		if (!usage.value || !subscription.value) return 0;
		const limit = subscription.value.database_storage_gb || 0.5;
		return Math.min(100, (usage.value.database_storage_used_gb / limit) * 100);
	});

	const storagePercentageAsset = computed(() => {
		if (!usage.value || !subscription.value) return 0;
		const limit = subscription.value.asset_storage_gb || 5;
		return Math.min(100, (usage.value.asset_storage_used_gb / limit) * 100);
	});

	const fetchPricing = async (databaseGb?: number, assetGb?: number) => {
		loading.value = true;
		error.value = null;

		try {
			const query: Record<string, any> = {};
			if (databaseGb) query.storageDB = databaseGb;
			if (assetGb) query.storageAsset = assetGb;

			const response = await $fetch<apiResponse<PricingData>>(
				`${config.public.apiBase}inicontent/billing/pricing`,
				{
					credentials: "include",
					params: {
						[`${database.value.slug}_sid`]: sessionID.value,
					},
					query,
				},
			);

			pricing.value = response.result;
		} catch (err) {
			error.value =
				err instanceof Error ? err.message : "Failed to load pricing";
			console.error("Error fetching pricing:", err);
		} finally {
			loading.value = false;
		}
	};

	const fetchSubscription = async () => {
		loading.value = true;
		error.value = null;

		try {
			const response = await $fetch<apiResponse<SubscriptionData>>(
				`${config.public.apiBase}inicontent/billing/subscription`,
				{
					credentials: "include",
					params: {
						[`${database.value.slug}_sid`]: sessionID.value,
					},
				},
			);
			const data = response.result;
			subscription.value = data;

			if (data.status === "active") {
				selectedDatabaseStorage.value = data.database_storage_gb || 0.5;
				selectedAssetStorage.value = data.asset_storage_gb || 5;
			}
		} catch (err) {
			console.error("Error fetching subscription:", err);
			subscription.value = {
				status: "free",
				plan: "base",
			};
		} finally {
			loading.value = false;
		}
	};

	const fetchUsage = async () => {
		loading.value = true;
		error.value = null;

		try {
			const response = await $fetch<apiResponse<UsageData>>(
				`${config.public.apiBase}inicontent/billing/usage`,
				{
					credentials: "include",
					params: {
						[`${database.value.slug}_sid`]: sessionID.value,
					},
				},
			);
			usage.value = response.result;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to load usage";
			console.error("Error fetching usage:", err);
		} finally {
			loading.value = false;
		}
	};

	const createCheckoutSession = async (
		databaseGb: number = selectedDatabaseStorage.value,
		assetGb: number = selectedAssetStorage.value,
	) => {
		loading.value = true;
		error.value = null;

		try {
			const response = await $fetch<
				apiResponse<{ url?: string; approval_url?: string }>
			>(`${config.public.apiBase}inicontent/billing/checkout`, {
				credentials: "include",
				params: {
					[`${database.value.slug}_sid`]: sessionID.value,
				},
				method: "POST",
				body: {
					database_storage_gb: databaseGb,
					asset_storage_gb: assetGb,
				},
			});

			if (response?.code === "loginFirst") {
				const authPath =
					database.value?.slug === "inicontent"
						? "/auth"
						: `/${database.value?.slug}/auth`;
				const redirectTo = `/pricing?checkout=1&databaseStorage=${encodeURIComponent(String(databaseGb))}&assetStorage=${encodeURIComponent(String(assetGb))}`;
				await navigateTo(
					`${authPath}?tab=signup&redirectTo=${encodeURIComponent(redirectTo)}`,
				);
				return;
			}

			const approvalUrl = response.result?.url || response.result?.approval_url;
			if (approvalUrl) window.location.href = approvalUrl;

			return response;
		} catch (err) {
			error.value =
				err instanceof Error
					? err.message
					: "Failed to create checkout session";
			console.error("Error creating checkout session:", err);
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const loadSubscriptionData = async () => {
		if (loadSubscriptionDataPromise) return loadSubscriptionDataPromise;

		loading.value = true;
		error.value = null;

		loadSubscriptionDataPromise = (async () => {
			try {
				await Promise.all([fetchPricing(), fetchSubscription(), fetchUsage()]);
			} catch (err) {
				error.value =
					err instanceof Error ? err.message : "Failed to load data";
				console.error("Error loading subscription data:", err);
			} finally {
				loading.value = false;
			}
		})().finally(() => {
			loadSubscriptionDataPromise = null;
		});

		return loadSubscriptionDataPromise;
	};

	const cancelSubscription = async () => {
		loading.value = true;
		error.value = null;

		try {
			const response = await $fetch<apiResponse>(
				`${config.public.apiBase}inicontent/billing/cancel`,
				{
					credentials: "include",
					params: {
						[`${database.value.slug}_sid`]: sessionID.value,
					},
					method: "POST",
				},
			);

			if (response?.code === "subscriptionCanceled") {
				subscription.value = { status: "canceled", plan: "base" };
				return response.result;
			}
			throw new Error(
				(response?.code as string) || "Failed to cancel subscription",
			);
		} catch (err) {
			error.value =
				err instanceof Error ? err.message : "Failed to cancel subscription";
			console.error("Error canceling subscription:", err);
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const upgradeSubscription = async (
		databaseGb: number = selectedDatabaseStorage.value,
		assetGb: number = selectedAssetStorage.value,
	) => {
		loading.value = true;
		error.value = null;

		try {
			const response = await $fetch<
				apiResponse<{ url?: string; approval_url?: string }>
			>(`${config.public.apiBase}inicontent/billing/upgrade`, {
				credentials: "include",
				params: {
					[`${database.value.slug}_sid`]: sessionID.value,
				},
				method: "POST",
				body: {
					database_storage_gb: databaseGb,
					asset_storage_gb: assetGb,
				},
			});

			const result = response.result;
			if (result?.url || result?.approval_url)
				window.location.href = (result.url || result.approval_url) as string;

			return result;
		} catch (err) {
			error.value =
				err instanceof Error ? err.message : "Failed to upgrade subscription";
			console.error("Error upgrading subscription:", err);
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const fetchTransactions = async () => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<
				apiResponse<
					| { transactions: unknown[]; total: number }[]
					| { transactions: unknown[]; total: number }
				>
			>(`${config.public.apiBase}inicontent/billing/transactions`, {
				credentials: "include",
				params: {
					[`${database.value.slug}_sid`]: sessionID.value,
					limit: 50,
				},
			});
			const result = response.result;
			if (Array.isArray(result)) {
				return { transactions: result, total: result.length };
			}

			return result || { transactions: [], total: 0 };
		} catch (err) {
			error.value =
				err instanceof Error ? err.message : "Failed to fetch transactions";
			console.error("Error fetching transactions:", err);
			return { transactions: [], total: 0, error: error.value };
		} finally {
			loading.value = false;
		}
	};

	const initiateCreditTopup = async (amountUsd: number) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<
				apiResponse<{ url?: string; approval_url?: string }>
			>(`${config.public.apiBase}inicontent/billing/credit/topup`, {
				credentials: "include",
				params: { [`${database.value.slug}_sid`]: sessionID.value },
				method: "POST",
				body: { amount_usd: amountUsd },
			});
			const result = response.result;
			if (result?.url || result?.approval_url)
				window.location.href = (result.url || result.approval_url) as string;

			return result;
		} catch (err) {
			error.value =
				err instanceof Error ? err.message : "Failed to initiate credit top-up";
			console.error("Error initiating credit top-up:", err);
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const submitCreditRequest = async (amountUsd: number, note: string) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<apiResponse>(
				`${config.public.apiBase}inicontent/billing/credit/request`,
				{
					credentials: "include",
					params: { [`${database.value.slug}_sid`]: sessionID.value },
					method: "POST",
					body: { amount_usd: amountUsd, note },
				},
			);
			return response.result;
		} catch (err) {
			error.value =
				err instanceof Error ? err.message : "Failed to submit credit request";
			console.error("Error submitting credit request:", err);
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const fetchCreditRequests = async (status = "pending") => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<
				apiResponse<{ requests: any[]; total: number }>
			>(`${config.public.apiBase}inicontent/billing/credit/requests`, {
				credentials: "include",
				params: { [`${database.value.slug}_sid`]: sessionID.value, status },
			});
			return response.result || { requests: [], total: 0 };
		} catch (err) {
			error.value =
				err instanceof Error ? err.message : "Failed to fetch credit requests";
			console.error("Error fetching credit requests:", err);
			return { requests: [], total: 0 };
		} finally {
			loading.value = false;
		}
	};

	const setupAutoCharge = async () => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<apiResponse<{ approval_url?: string }>>(
				`${config.public.apiBase}inicontent/billing/autocharge/setup`,
				{
					method: "POST",
					credentials: "include",
					params: { [`${database.value.slug}_sid`]: sessionID.value },
				},
			);
			if (response.result.approval_url)
				window.location.href = response.result.approval_url as string;
		} catch (err) {
			error.value =
				err instanceof Error ? err.message : "Failed to set up auto-charge";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const activateAutoCharge = async (approvalSessionId: string) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<apiResponse<{ approval_url?: string }>>(
				`${config.public.apiBase}inicontent/billing/autocharge/activate`,
				{
					method: "POST",
					credentials: "include",
					params: {
						[`${database.value.slug}_sid`]: sessionID.value,
						approval_session_id: approvalSessionId,
					},
				},
			);
			await fetchSubscription();
			return response.result;
		} catch (err) {
			error.value =
				err instanceof Error ? err.message : "Failed to activate auto-charge";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const disableAutoCharge = async () => {
		loading.value = true;
		error.value = null;
		try {
			await $fetch<apiResponse>(
				`${config.public.apiBase}inicontent/billing/autocharge/disable`,
				{
					method: "POST",
					credentials: "include",
					params: { [`${database.value.slug}_sid`]: sessionID.value },
				},
			);
			await fetchSubscription();
		} catch (err) {
			error.value =
				err instanceof Error ? err.message : "Failed to disable auto-charge";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const approveCreditRequest = async (id: string) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<apiResponse>(
				`${config.public.apiBase}inicontent/billing/credit/request/${id}/approve`,
				{
					credentials: "include",
					params: { [`${database.value.slug}_sid`]: sessionID.value },
					method: "POST",
				},
			);
			return response.result;
		} catch (err) {
			error.value =
				err instanceof Error ? err.message : "Failed to approve credit request";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const rejectCreditRequest = async (id: string, reason?: string) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<apiResponse>(
				`${config.public.apiBase}inicontent/billing/credit/request/${id}/reject`,
				{
					credentials: "include",
					params: { [`${database.value.slug}_sid`]: sessionID.value },
					method: "POST",
					body: { reason },
				},
			);
			return response.result;
		} catch (err) {
			error.value =
				err instanceof Error ? err.message : "Failed to reject credit request";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const adminAdjustCredit = async (
		userId: string,
		amountCents: number,
		note?: string,
	) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<apiResponse>(
				`${config.public.apiBase}inicontent/billing/credit/adjust`,
				{
					credentials: "include",
					params: { [`${database.value.slug}_sid`]: sessionID.value },
					method: "POST",
					body: { userId, amount_cents: amountCents, note },
				},
			);
			return response.result;
		} catch (err) {
			error.value =
				err instanceof Error ? err.message : "Failed to adjust credit";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const setCustomPlan = async (
		userId: string,
		monthlyAmountUsd: number,
		usagePriceUsdPerGb: number,
	) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<apiResponse>(
				`${config.public.apiBase}inicontent/billing/custom-plan`,
				{
					credentials: "include",
					params: { [`${database.value.slug}_sid`]: sessionID.value },
					method: "POST",
					body: {
						userId,
						monthly_amount_cents: Math.round(monthlyAmountUsd * 100),
						usage_price_cents_per_gb: Math.round(usagePriceUsdPerGb * 100),
					},
				},
			);

			if (response?.code === "customPlanUpdated") {
				await fetchSubscription();
				return response.result;
			}

			throw new Error(
				(response?.code as string) || "Failed to update custom plan",
			);
		} catch (err) {
			error.value =
				err instanceof Error ? err.message : "Failed to update custom plan";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	return {
		// State
		pricing,
		subscription,
		usage,
		loading,
		error,
		selectedDatabaseStorage,
		selectedAssetStorage,

		// Computed
		isDatabaseStorageExceeded,
		isAssetStorageExceeded,
		hasActiveSubscription,
		storagePercentageDB,
		storagePercentageAsset,

		// Methods
		fetchPricing,
		fetchSubscription,
		fetchUsage,
		createCheckoutSession,
		loadSubscriptionData,
		cancelSubscription,
		upgradeSubscription,
		fetchTransactions,
		initiateCreditTopup,
		submitCreditRequest,
		fetchCreditRequests,
		approveCreditRequest,
		rejectCreditRequest,
		adminAdjustCredit,
		setCustomPlan,
		setupAutoCharge,
		activateAutoCharge,
		disableAutoCharge,
	};
};
