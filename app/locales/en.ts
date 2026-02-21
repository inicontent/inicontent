export default {
	en: {
		optional: "Optional",

		// Field types that differ from default
		fields: {
			html: "Rich Editor",
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
			currentPeriod: "Current Period",
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
			invoiceId: "Invoice ID",
			period: "Period",
			amount: "Amount",
			invoice: "Invoice",
			downloadPdf: "Download PDF",
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
	},
} as const;
