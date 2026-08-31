export default {
	en: {
		// Confirmation messages
		areYouSure: "Are you sure?",
		folderNameRequired: "Folder name is required",
		deleteSelectedAssetsConfirm:
			"Delete {count} selected item(s)? This action cannot be undone.",
		deleteAssetConfirm: "Delete this asset?",
		deleteFolderConfirm:
			'Delete folder "{name}" and everything inside it? This action cannot be undone.',
		theFollowingActionIsIrreversible: "The following action is irreversible",

		// HTTP Methods
		get: "Read",
		post: "Create",
		put: "Update",

		// API
		apiDocumentation: "API Documentation",

		// Admin
		auth: "Authentication",
		importedRows: "Imported {count} rows",
		forgotPassword: "Forgot password?",
		passwordMinimumLength: "Password must be at least 8 characters.",
		passwordsDoNotMatch: "Passwords do not match.",
		invalidResetLink: "This password reset link is invalid or expired.",
		backToSignIn: "Back to sign in",

		// Field types that differ from default
		fields: {
			html: "Rich Editor",
			json: "JSON",
			dateTime: "Date & time",
			dateRange: "Date range",
			dateTimeRange: "Date & time range",
			monthRange: "Month range",
			yearRange: "Year range",
			quarterRange: "Quarter range",
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
			endpointPath: "Endpoint",
			queryParams: "Query parameters",
			requestExample: "Request",
			responseExample: "Response",
			responseFormat: "Response format",
			statusCode: "Status code",
			localeParam: "locale — preferred language code (e.g. en, ar, fr, es)",
			pageParam: "page — page number for pagination (default: 1)",
			limitParam: "limit — number of items per page (default: 25)",
			isSignedInParam:
				"isSignedIn — set to true to check if the session is valid",
			searchParam: "search — search query encoded in Inison format",
			columnsParam: "columns — comma-separated list of fields to return",
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
			tableEndpoints: {
				title: "Table endpoints",
				listTitle: "List items",
				listDescription:
					"List all items in the {table} table with pagination and filtering.",
				singleTitle: "Get single item",
				singleDescription:
					"Get a single item by its ID from the {table} table.",
				createTitle: "Create item",
				createDescription: "Create a new item in the {table} table.",
				updateTitle: "Update item",
				updateDescription:
					"Update an existing item in the {table} table by its ID.",
				deleteTitle: "Delete item",
				deleteDescription: "Delete an item from the {table} table by its ID.",
				schemaTitle: "Get table schema",
				schemaDescription:
					"Returns the schema definition for the {table} table.",
				logsTitle: "Activity logs",
				logsDescription: "Returns recent activity logs for the {table} table.",
			},
			auth: {
				title: "Authentication endpoints",
				description:
					"Use the following endpoints to create sessions and populate the {param} parameter.",
				signinDescription:
					"Authenticate an existing user by providing username and password. Returns a session id that must be sent on subsequent requests.",
				signinEndpoint: "/auth/signin",
				usernameField: "username — unique identifier for the account",
				passwordField:
					"password — plain text password that will be hashed on the server",
				signupDescription:
					"Create a new user. The payload follows the users table schema shown below.",
				signupEndpoint: "/auth/signup",
				currentDescription:
					"Returns the full user object for the session associated with your {param} token.",
				currentEndpoint: "/auth/current",
				signoutDescription:
					"Invalidates the active session and clears the related cookie.",
				signoutEndpoint: "/auth/signout",
				resetRequestDescription:
					"Request a password reset email. Sends a token to the registered email address.",
				resetRequestEndpoint: "/auth/reset",
				resetRequestEmailField: "email — the registered email address",
				resetCompleteDescription:
					"Set a new password using the token received via the password reset email.",
				resetCompleteEndpoint: "/auth/reset",
				resetTokenField: "token — the reset token from the email link",
				resetPasswordField: "password — new password (minimum 8 characters)",
				signupSchemaTitle: "Users schema",
				cookieHint:
					"Successful signin stores the session id inside the {param} cookie. You can also send it manually if needed.",
			},
			publicApi: {
				title: "Public API",
				description:
					"Read-only access to tables that have been made publicly visible. No authentication required.",
				collectionEndpoint: "List items",
				singleEndpoint: "Get single item",
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
		chatWelcomeScopedDatabase:
			"Hi! I can help you create and update tables in this database. For creating a new database, use the Inicontent database workspace.",
		chatWelcomeTables:
			"I'm ready to help you design and manage your database tables. You can ask me to create new tables or edit existing ones.",
		chatWelcomePages:
			"I can help you build website pages. Describe the page you'd like and I'll generate the structure.",
		chatPlaceholder: "Describe a database you'd like to build...",
		chatPlaceholderScopedDatabase:
			"Describe the tables you want to create or update in this database...",
		chatPlaceholderShort: "Type a message...",
		applyChanges: "Apply changes",
		skipAiHelp: "Skip AI help",
		publishData: "Publish data",
		translateData: "Translate",
		tableSchedules: "Table schedules",
		addSchedule: "Add schedule",
		runNow: "Run now",
		runAllActive: "Run all active",
		noActiveSchedules: "No active schedules to run",
		allActiveSchedulesRan: "All active schedules executed successfully",
		someSchedulesFailed: "{count} schedule(s) failed to execute",
		editSchedule: "Edit schedule",
		cronExpression: "Cron expression",
		payloadTemplate: "Payload template",
		nextRunAt: "Next run",
		lastRunAt: "Last run",
		lastError: "Last error",
		excludeDays: "Exclude days",
		excludeDaysHelp:
			"Checked days will be skipped even if the cron expression matches them.",
		excludedDays: "Excluded days",
		noExcludedDays: "None",
		payloadHelp:
			"Use a JSON object or an Inison-stringified object for the row you want to create.",
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
		presetDescriptionMonthly:
			"Runs on the first day of each month at midnight UTC.",
		presetDescriptionCustom:
			"Use your own cron expression for advanced schedules.",
		scheduleSummaryNoExcluded: "This schedule will run on all matching days.",
		scheduleSummaryWithExcluded: "This schedule will skip: {days}.",
		tableDemo: "Table preview",

		billingUi: {
			title: "Billing & Subscription",
			subtitle: "Manage your plan, invoices, and payment settings.",
			noSubscriptionTitle: "No active subscription",
			noSubscriptionBody:
				"Choose a plan to enable billing and unlock storage features.",
			choosePlanTitle: "Choose your plan",
			currentPlanTitle: "Current plan",
			statusLabels: {
				past_due: "Past due",
			},
			upgradePlanTitle: "Upgrade or change plan",
			storageUsageTitle: "Storage usage",
			storageLimitExceededTitle: "Storage limit exceeded",
			storageLimitExceededBody:
				"You are exceeding your storage quota. Consider upgrading your plan or removing unused data.",
			invoicesEmpty: "No invoices yet.",
			paymentSettingsTitle: "Payment settings",
			paymentMethodTitle: "Payment Method",
			paymentMethodSubtitle: "Manage your payment method on PayPal",
			billingEmailTitle: "Billing Email",
			autoRenewalTitle: "Auto-renewal",
			autoRenewalMessage:
				"{{status}} - Your subscription will {{action}} at the end of the billing period.",
			autoRenew: {
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
			downloadPdf: "Download PDF",
			checkoutSuccess: {
				processingPayment: "Processing your payment...",
				subscriptionActivated: "Subscription Activated!",
				thankYou: "Thank you for choosing Inicontent.",
				orderId: "Order ID",
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
				supportMessage:
					"If you encountered any issues during checkout, please contact our support team:",
			},
			credit: {
				balance: "Credit Balance",
				balanceSubtitle: "Your account credit used for monthly charges.",
				topupTitle: "Add Account Credit",
				topupDescription:
					"Add credit via PayPal. Your credit will be used to pay monthly charges automatically.",
				amount: "Amount (USD)",
				amountPlaceholder: "Enter amount",
				youWillAdd: "You will add",
				payWithPayPal: "Pay with PayPal",
				amountTooLow: "Minimum amount is $1",
				amountTooHigh: "Maximum amount is $1,000",
				topupFailed: "Failed to initiate top-up. Please try again.",
				topupSuccess: "Credit Added Successfully",
				topupSuccessDescription: "Your account credit has been updated.",
				topupCanceled: "Top-up Canceled",
				topupCanceledDescription:
					"Your PayPal payment was canceled. No charges were made.",
				processingTopup: "Processing your payment…",
				orderId: "Order ID",
				requestTitle: "Request Bank Transfer Credit",
				requestDescription:
					"Submit a bank transfer request. An admin will verify and apply the credit to your account.",
				note: "Transfer Reference / Note",
				notePlaceholder: "Enter bank transfer reference or additional notes",
				noteRequired: "Please provide a transfer reference or note",
				requestSubmitted:
					"Your credit request has been submitted. An admin will review it shortly.",
				requestFailed: "Failed to submit credit request. Please try again.",
				pendingRequests: "Pending Credit Requests",
				noPendingRequests: "No pending credit requests",
				refreshRequests: "Refresh",
				requestUser: "User",
				requestAmount: "Amount",
				requestNote: "Note",
				requestStatus: "Status",
				graceWarning:
					"Your subscription is in a grace period. Please add credit before the grace period expires to avoid suspension.",
			},
			autoCharge: {
				title: "PayPal Auto-Charge",
				subtitle:
					"Automatically charge your PayPal account when credit is insufficient.",
				statusEnabled: "Enabled",
				enable: "Enable Auto-Charge",
				disable: "Disable Auto-Charge",
				activating: "Activating auto-charge…",
				activatedTitle: "Auto-Charge Enabled",
				activatedDescription:
					"Your PayPal account has been saved. Monthly charges will be collected automatically.",
				activationFailed: "Failed to activate auto-charge",
				missingApprovalSession: "Missing approval session. Please try again.",
				setupCanceled: "Auto-Charge Setup Canceled",
				setupCanceledDescription:
					"You canceled the PayPal authorization. Auto-charge was not enabled.",
			},
		},

		pricingUi: {
			title: "Choose Your Plan",
			subtitle: "Simple, transparent pricing with no hidden fees.",
			databaseStorageLabel: "Database Storage (GB)",
			assetStorageLabel: "Asset Storage (GB)",
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

		// Dashboards
		createDatabase: "Create database",
		basicInformation: "Basic information",
		basicInformationDescription: "Set database details and default locale.",
		buildTables: "Build tables",
		buildTablesDescription:
			"Describe your tables and we will generate a starter schema.",
		languages: {
			ar: "Arabic",
			en: "English",
			fr: "French",
			es: "Spanish",
		},
		dashboardName: "Dashboard name",
		dashboardSettings: "Dashboard settings",
		editDashboard: "Edit dashboard",
		createDashboard: "Create dashboard",
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
		groupBy: "Group by",
		dateField: "Date field",
		dateRange: "Date range",
		last7Days: "Last 7 days",
		last30Days: "Last 30 days",
		last90Days: "Last 90 days",
		lastYear: "Last year",
		allTime: "All time",
		noData: "No data",

		// Translation drawer
		translateItem: "Translate item",
		original: "Original",
		noSecondaryLanguages:
			"No secondary languages are configured for this database.",
		noTranslatableFields: "No translatable text fields found in this table.",
		translationPlaceholder: "Enter translation…",
		translationsSaved: "Translations saved",

		passkey: {
			securityTitle: "Passkey Security",
			description:
				"Register a passkey to sign in using your device verification.",
			register: "Register passkey",
			enrollmentTitle: "Set up a passkey",
			enrollmentPrompt:
				"Would you like to set up a passkey for faster, more secure sign-in on this device?",
			notNow: "Not now",
			notSupported: "This browser does not support passkeys.",
			hint: "You can use Face ID, Touch ID, or a security key after registration.",
			registeredSuccessfully: "Passkey registered successfully.",
			registrationFailed: "Passkey registration failed.",
			signin: "Sign in with passkey",
			signinHintUsername:
				"Enter your username or email, then continue with passkey.",
			signinHintDevice:
				"Use your device verification (Face ID, Touch ID, or security key).",
			signinFailed: "Passkey sign-in failed.",
		},

		// Email settings
		emailConfig: {
			use_custom_smtp: "Use Custom SMTP",
			from_name: "Sender Name",
			smtp_host: "SMTP Host",
			smtp_port: "SMTP Port",
			smtp_user: "SMTP Username",
			smtp_pass: "SMTP Password",
			smtp_secure: "Secure Connection (TLS)",
		},
		smtpPasswordUnchanged: "Leave blank to keep the current password",
		emailSendFailed: "The email could not be sent. Check the email settings.",
	},
} as const;
