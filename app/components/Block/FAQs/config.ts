import type { LanguagesType } from "#imports";

export default {
	en: {
		preHeadingLink: { label: "Learn more", link: "#" },
		heading: "Frequently asked questions",
		description:
			"Everything you need to know about orders, returns, and customer support.",
		preHeading: "FAQs",
		items: [
			{
				question: "What is your return policy?",
				answer: "We offer a 30-day return policy for all our products.",
			},
			{
				question: "How can I track my order?",
				answer:
					"You can track your order using the tracking link sent to your email.",
			},
			{
				question: "Do you offer customer support?",
				answer: "Yes, our customer support is available 24/7 to assist you.",
			},
		],
	},
	ar: {
		preHeadingLink: { label: "Learn more", link: "#" },
		heading: "الأسئلة الشائعة",
		description:
			"كل ما تحتاج معرفته عن الطلبات والإرجاع ودعم العملاء.",
		preHeading: "المساعدة والدعم",
		items: [
			{
				question: "ما هي سياسة الإرجاع الخاصة بكم؟",
				answer: "نقدم سياسة إرجاع لمدة 30 يومًا لجميع منتجاتنا.",
			},
			{
				question: "كيف يمكنني تتبع طلبي؟",
				answer:
					"يمكنك تتبع طلبك باستخدام رابط التتبع المرسل إلى بريدك الإلكتروني.",
			},
			{
				question: "هل تقدمون دعمًا للعملاء؟",
				answer: "نعم، دعم العملاء لدينا متاح على مدار الساعة لمساعدتك.",
			},
		],
	},
	fr: {
		preHeadingLink: { label: "Learn more", link: "#" },
		heading: "Questions fréquemment posées",
		description:
			"Tout ce que vous devez savoir sur les commandes, les retours et l'assistance client.",
		preHeading: "FAQ",
		items: [
			{
				question: "Quelle est votre politique de retour ?",
				answer:
					"Nous offrons une politique de retour de 30 jours pour tous nos produits.",
			},
			{
				question: "Comment puis-je suivre ma commande ?",
				answer:
					"Vous pouvez suivre votre commande en utilisant le lien de suivi envoyé à votre email.",
			},
			{
				question: "Offrez-vous un support client ?",
				answer:
					"Oui, notre support client est disponible 24h/24 et 7j/7 pour vous aider.",
			},
		],
	},
	es: {
		preHeadingLink: { label: "Learn more", link: "#" },
		heading: "Preguntas frecuentes",
		description:
			"Todo lo que necesitas saber sobre pedidos, devoluciones y soporte al cliente.",
		preHeading: "Ayuda y soporte",
		items: [
			{
				question: "¿Cuál es su política de devoluciones?",
				answer:
					"Ofrecemos una política de devolución de 30 días para todos nuestros productos.",
			},
			{
				question: "¿Cómo puedo rastrear mi pedido?",
				answer:
					"Puedes rastrear tu pedido usando el enlace de seguimiento enviado a tu correo electrónico.",
			},
			{
				question: "¿Ofrecen soporte al cliente?",
				answer:
					"Sí, nuestro soporte al cliente está disponible las 24 horas del día para ayudarte.",
			},
		],
	},
} satisfies Record<LanguagesType, FAQs>;
