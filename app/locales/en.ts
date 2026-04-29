export default {
	en: {
		optional: "Optional",
		rightClickToEdit: "Right click to edit",
		pressAndHoldToEdit: "Press and hold to edit",

		// Field types that differ from default
		fields: {
			html: "Rich Editor",
			json: "JSON",
			dateTime: "Date & time",
			dateRange: "Date range",
			dateTimeRange: "Date & time range",
			month: "Month",
			monthRange: "Month range",
			year: "Year",
			yearRange: "Year range",
			quarter: "Quarter",
			quarterRange: "Quarter range",
			week: "Week",
		},

		apiDocs: {
			availableMethods: "Available methods",
			sessionNoticeTitle: "Session authentication",
			sessionNoticeDescription:
				"Provide your session id via the {param} parameter either as a query string value or a cookie.",
			sessionAsQuery: "Send it as a query parameter:",
			sessionAsCookie: "Or attach it as a cookie on every request.",
			sessionAuthLinkPrefix: "Need a session id? Read",
			viewAuthDocs: "the auth docs",
			schemaTitle: "Schema fields",
			assetsUploadTitle: "Uploading assets",
			assetsUploadIntro:
				"Send a POST request to /assets or /assets/<folder> with one or more objects that describe the files you plan to upload.",
			assetsUploadStep1:
				"Each object must contain name, size, type, and extension. Arrays are supported if you upload multiple files at once.",
			assetsUploadStep2:
				"The API responds with the same fields plus id, createdAt, publicURL, and uploadURL.",
			assetsUploadStep3:
				"Upload the binary file to the returned uploadURL using a standard POST request.",
			assetsUploadCustomEndpoint:
				"If you rely on a custom upload endpoint, include publicURL in the initial /assets request and the API will skip returning uploadURL.",
			noSchemaFields: "No schema fields were found for this table.",
			tableNotFoundTitle: "Table not found",
			tableNotFoundDescription:
				"Double-check the slug or pick another table from the list.",
			backToTables: "Back to API tables",
			auth: {
				title: "Authentication endpoints",
				description:
					"Use the following endpoints to create sessions and populate the {param} parameter.",
				signinDescription:
					"Authenticate an existing user. POST creates a new session, PUT refreshes the current one.",
				usernameField: "username — unique identifier for the account",
				passwordField:
					"password — plain text password that will be hashed on the server",
				signupDescription:
					"Create a new user. The payload follows the users table schema shown below.",
				currentDescription:
					"Returns the full user object for the session associated with your {param} token.",
				signoutDescription:
					"Invalidates the active session and clears the related cookie.",
				signupSchemaTitle: "Users schema",
				cookieHint:
					"Successful signin stores the session id inside the {param} cookie. You can also send it manually if needed.",
			},
		},

		// Relative date terms
		relativeGroup: "Relative",
		relativePlaceholder: "e.g. 3 days ago",

		// Plural examples
		items: {
			zero: "No items",
			one: "{{count}} item",
			other: "{{count}} items",
		},

		compression: {
			label: "Compression",
			videoLarge:
				"Large video detected ({size}). We'll optimize it locally before uploading.",
			videoHuge:
				"Huge video detected ({size}). Compression happens locally and may take a while.",
			pdfLarge:
				"Large PDF detected ({size}). We'll rebuild it in your browser before upload.",
			pdfHuge:
				"Huge PDF detected ({size}). Rendering pages locally may take some time.",
		},

		// Schema fields - assets
		optimizeAssetsDescription:
			"Automatically compress and optimize uploaded files for better performance",

		// AI Chatbot
		chatbot: "AI Assistant",
		chatWelcomeDefault:
			"Hi! I can help you create new database tables or modify existing ones. Describe what you need and I'll generate the schemas for you.",
		chatWelcomeTables:
			"I'm ready to help you design and manage your database tables. You can ask me to create new tables or edit existing ones.",
		chatWelcomePages:
			"I can help you build website pages. Describe the page you'd like and I'll generate the structure.",
		chatPlaceholder: "Describe a database you'd like to build...",
		chatPlaceholderShort: "Type a message...",
		applyChanges: "Apply changes",
		applied: "Applied",
		schedules: "Schedules",
		tableSchedules: "Table schedules",
		addSchedule: "Add schedule",
		editSchedule: "Edit schedule",
		cronExpression: "Cron expression",
		payloadTemplate: "Payload template",
		nextRunAt: "Next run",
		lastRunAt: "Last run",
		lastError: "Last error",
		active: "Active",
		inactive: "Inactive",
		preset: "Preset",
		creationCronNotice:
			"Create rows automatically on a fixed schedule using a saved JSON or Inison payload.",
		friendlyScheduleHint: "Choose a simple preset, then optionally skip specific weekdays.",
		excludeDays: "Exclude days",
		excludeDaysHelp: "Checked days will be skipped even if the cron expression matches them.",
		excludedDays: "Excluded days",
		noExcludedDays: "None",
		payloadHelp: "Use a JSON object or an Inison-stringified object for the row you want to create.",
		payloadTemplateVariablesHelp:
			"Templates: {{ now }}, {{ now + 2h }}, {{ now|iso }}, {{ today|date }}, {{ schedule.id }}, {{ database.slug }}, {{ table.slug }}, {{ run.iso }}.",
		previewResolvedPayload: "Preview resolved payload",
		resolvedPayloadPreview: "Resolved payload preview",
		formatJSON: "Format as JSON",
		fillExample: "Fill example",
		customCronHint: "Use a standard 5-part cron expression in UTC.",
		presetDescriptionHourly: "Runs once every hour.",
		presetDescriptionDaily: "Runs once every day at midnight UTC.",
		presetDescriptionWeekly: "Runs every Monday at midnight UTC.",
		presetDescriptionMonthly: "Runs on the first day of each month at midnight UTC.",
		presetDescriptionCustom: "Use your own cron expression for advanced schedules.",
		scheduleSummaryNoExcluded: "This schedule will run on all matching days.",
		scheduleSummaryWithExcluded: "This schedule will skip: {days}.",
		sunday: "Sunday",
		monday: "Monday",
		tuesday: "Tuesday",
		wednesday: "Wednesday",
		thursday: "Thursday",
		friday: "Friday",
		saturday: "Saturday",
		hourly: "Hourly",
		daily: "Daily",
		weekly: "Weekly",
		monthly: "Monthly",
		custom: "Custom",
		tableDemo: "Table preview",
		close: "Close",
		billing: "Billing",

		billingUi: {
			title: "Billing & Subscription",
			subtitle: "Manage your plan, invoices, and payment settings.",
			tabs: {
				subscription: "Subscription",
				invoices: "Invoices",
				settings: "Settings",
			},
			noSubscriptionTitle: "No active subscription",
			noSubscriptionBody:
				"Choose a plan to enable billing and unlock storage features.",
			choosePlanTitle: "Choose your plan",
			currentPlanTitle: "Current plan",
			planType: "Plan Type",
			planTypes: {
				base: "Base",
				enterprise: "Enterprise",
			},
			status: "Status",
			statusLabels: {
				active: "Active",
				canceled: "Canceled",
				past_due: "Past due",
				paid: "Paid",
				open: "Open",
				void: "Void",
				uncollectible: "Uncollectible",
				unknown: "Unknown",
			},
			databaseStorage: "Database Storage",
			assetStorage: "Asset Storage",
			changePlan: "Change Plan",
			hidePlanPicker: "Hide Plan Picker",
			cancelSubscription: "Cancel Subscription",
			upgradePlanTitle: "Upgrade or change plan",
			storageUsageTitle: "Storage usage",
			storageLimitExceededTitle: "Storage limit exceeded",
			storageLimitExceededBody:
				"You are exceeding your storage quota. Consider upgrading your plan or removing unused data.",
			invoicesEmpty: "No invoices yet.",
			paymentSettingsTitle: "Payment settings",
			paymentMethodTitle: "Payment Method",
			paymentMethodSubtitle: "Manage your payment method on PayPal",
			managePayment: "Manage Payment",
			billingEmailTitle: "Billing Email",
			updateEmail: "Update Email",
			autoRenewalTitle: "Auto-renewal",
			autoRenewalMessage:
				"{{status}} - Your subscription will {{action}} at the end of the billing period.",
			autoRenew: {
				enabled: "Enabled",
				disabled: "Disabled",
				renew: "automatically renew",
				notRenew: "not renew",
				enable: "Enable Auto-renewal",
				disable: "Disable Auto-renewal",
			},
			cancelModalTitle: "Cancel Subscription",
			cancelModalBody:
				"Are you sure you want to cancel your subscription? You will lose access to paid features at the end of the current billing period.",
			cancelModalKeep: "Keep Subscription",
			cancelModalConfirm: "Yes, Cancel",
			invoiceId: "Transaction ID",
			period: "Period",
			description: "Description",
			date: "Date",
			amount: "Amount",
			invoice: "Invoice",
			downloadPdf: "Download PDF",
			checkoutSuccess: {
				processingPayment: "Processing your payment...",
				paymentFailed: "Payment Failed",
				returnToBilling: "Return to Billing",
				subscriptionActivated: "Subscription Activated!",
				thankYou: "Thank you for choosing Inicontent.",
				goToDashboard: "Go to Dashboard",
				viewBillingDetails: "View Billing Details",
				subscriptionStatus: "Subscription Status",
				active: "Active",
				orderId: "Order ID",
				databaseStorage: "Database Storage",
				assetStorage: "Asset Storage",
				validUntil: "Valid Until",
				nextSteps: "Next Steps",
				firstProject: "You can now create your first project.",
				confirmationEmail:
					"A confirmation email has been sent to your PayPal email address. To get started, head to your dashboard and create your first CMS database.",
				errors: {
					noPaymentToken: "No payment token found. Please try again.",
					failedToProcess: "Failed to process payment. Please contact support.",
					paymentProcessingFailed: "Payment processing failed",
				},
			},
			checkoutCanceled: {
				title: "Checkout Canceled",
				description:
					"Your subscription was not completed. No charges were made.",
				returnToBilling: "Return to Billing",
				backToHome: "Back to Home",
				supportMessage:
					"If you encountered any issues during checkout, please contact our support team:",
			},
		},

		pricingUi: {
			title: "Choose Your Plan",
			subtitle: "Simple, transparent pricing with no hidden fees.",
			databaseStorageLabel: "Database Storage (GB)",
			assetStorageLabel: "Asset Storage (GB)",
			basePlan: "Base Plan",
			additionalStorage: "Additional Storage",
			totalMonthly: "Total Monthly",
			subscribeNow: "Subscribe Now",
			upgradePlan: "Upgrade Plan",
			requestQuote: "Request Quote",
			currentUsage: "Current Storage Usage",
			usageWarning:
				"You are exceeding your storage quota. Consider upgrading your plan.",
			faqTitle: "Frequently Asked Questions",
			faq: {
				changePlanTitle: "Can I change my storage plan anytime?",
				changePlanBody:
					"Yes. You can upgrade or downgrade your storage plan at any time. Changes take effect on your next billing cycle.",
				exceedQuotaTitle: "What happens if I exceed my storage quota?",
				exceedQuotaBody:
					"You will be notified when you approach your limit. If you exceed it, we will bill you for the additional storage at our stated rates.",
				contractTitle: "Is there a long-term contract?",
				contractBody:
					"No. All plans are month-to-month with no long-term commitment. You can cancel anytime.",
				annualDiscountTitle: "Do you offer annual discounts?",
				annualDiscountBody:
					"Contact our sales team for custom enterprise pricing and volume discounts.",
			},
		},

		pricingPageUi: {
			headerTitle: "Pricing Plans",
			headerSubtitle:
				"Simple, transparent pricing with no hidden fees. Pay only for what you use.",
			ctaTitle: "Ready to get started?",
			ctaSubtitle:
				"Join thousands of developers using Inicontent to manage their content.",
			viewSubscription: "View Your Subscription",
		},

		// JSON Field
		format: "Format",
		invalidJSON: "Invalid JSON",

		// Dashboards
		dashboards: "Dashboards",
		dashboard: "Dashboard",
		dashboardName: "Dashboard name",
		dashboardSettings: "Dashboard settings",
		editDashboard: "Edit dashboard",
		createDashboard: "Create dashboard",
		widgets: "Widgets",
		widget: "Widget",
		addWidget: "Add widget",
		editWidget: "Edit widget",
		widgetTitle: "Widget title",
		untitledWidget: "Untitled widget",
		noWidgets: "No widgets yet. Add one to get started.",
		widgetCount: {
			zero: "No widgets",
			one: "{count} widget",
			other: "{count} widgets",
		},
		counter: "Counter",
		line: "Line chart",
		bar: "Bar chart",
		pie: "Pie chart",
		recent: "Recent activity",
		lineChart: "Line chart",
		barChart: "Bar chart",
		pieChart: "Pie chart",
		recentActivity: "Recent activity",
		sourceTable: "Source table",
		selectTable: "Select table",
		selectField: "Select field",
		selectType: "Select type",
		operation: "Operation",
		count: "Count",
		sum: "Sum",
		max: "Max",
		min: "Min",
		groupBy: "Group by",
		dateField: "Date field",
		dateRange: "Date range",
		last7Days: "Last 7 days",
		last30Days: "Last 30 days",
		last90Days: "Last 90 days",
		lastYear: "Last year",
		allTime: "All time",
		limit: "Limit",
		size: "Size",
		small: "Small",
		medium: "Medium",
		large: "Large",
		noData: "No data",

		// Translation drawer
		translateItem: "Translate item",
		noSecondaryLanguages: "No secondary languages are configured for this database.",
		noTranslatableFields: "No translatable text fields found in this table.",
		translationPlaceholder: "Enter translation…",
		translationsSaved: "Translations saved",
		translated: "Translated",
	},
} as const;
