import type { LanguagesType } from "#imports";

export default {
	en: {
		preHeadingLink: { label: "Learn More", link: "#" },
		preHeading: "Our Plans",
		heading: "Choose the Best Plan for <span>You</span>",
		description:
			"Explore our pricing options and find the perfect fit for your needs.",
		tag: 2,
		align: "center",
		currency: "$",
		items: [
			{
				name: "Free",
				price: 0,
				features: ["1 Project", "Community support", "Limited features"],
				button: { label: "Start for Free", link: "#" },
			},
			{
				name: "Pro",
				price: 10,
				yearlyPrice: 110,
				features: ["10 Projects", "Priority email support", "Analytics tools"],
				isFeatured: true,
				button: { label: "Upgrade to Pro", link: "#" },
			},
			{
				name: "Enterprise",
				price: 39,
				yearlyPrice: 390,
				features: [
					"Unlimited projects",
					"Dedicated support",
					"Custom integrations",
				],
				button: { label: "Contact Sales", link: "#" },
			},
		],
	},
	ar: {
		preHeadingLink: { label: "اعرف المزيد", link: "#" },
		preHeading: "خططنا",
		heading: "اختر أفضل خطة <span>لك</span>",
		description:
			"استكشف خيارات التسعير الخاصة بنا وابدأoplan المناسب لاحتياجاتك.",
		tag: 2,
		align: "center",
		currency: "$",
		items: [
			{
				name: "مجاني",
				price: 0,
				features: ["مشروع واحد", "دعم المجتمع", "ميزات محدودة"],
				button: { label: "ابدأ مجانًا", link: "#" },
			},
			{
				name: "احترافي",
				price: 10,
				yearlyPrice: 110,
				features: ["10 مشاريع", "دعم بريد إلكتروني أولوي", "أدوات التحليلات"],
				isFeatured: true,
				button: { label: "ترقية إلى احترافي", link: "#" },
			},
			{
				name: "المؤسسات",
				price: 39,
				yearlyPrice: 390,
				features: ["مشاريع غير محدودة", "دعم مخصص", "تكاملات مخصصة"],
				button: { label: "اتصل بالمبيعات", link: "#" },
			},
		],
	},
	fr: {
		preHeadingLink: { label: "En savoir plus", link: "#" },
		preHeading: "Nos forfaits",
		heading: "Choisissez le Meilleur Forfait pour <span>Vous</span>",
		description:
			"Explorez nos options de tarification et trouvez l'offre idéale pour vos besoins.",
		tag: 2,
		align: "center",
		currency: "$",
		items: [
			{
				name: "Gratuit",
				price: 0,
				features: [
					"1 Projet",
					"Support communautaire",
					"Fonctionnalités limitées",
				],
				button: { label: "Commencer gratuitement", link: "#" },
			},
			{
				name: "Pro",
				price: 10,
				yearlyPrice: 110,
				features: [
					"10 Projets",
					"Support email prioritaire",
					"Outils d'analyse",
				],
				isFeatured: true,
				button: { label: "Passer à Pro", link: "#" },
			},
			{
				name: "Entreprise",
				price: 39,
				yearlyPrice: 390,
				features: [
					"Projets illimités",
					"Dédié support",
					"Intégrations personnalisées",
				],
				button: { label: "Contacter les ventes", link: "#" },
			},
		],
	},
	es: {
		preHeadingLink: { label: "Más información", link: "#" },
		preHeading: "Nuestros planes",
		heading: "Elige el Mejor Plan para <span>Ti</span>",
		description:
			"Explora nuestras opciones de precios y encuentra la opción perfecta para tus necesidades.",
		tag: 2,
		align: "center",
		currency: "$",
		items: [
			{
				name: "Gratuito",
				price: 0,
				features: ["1 Proyecto", "Soporte comunitario", "Funciones limitadas"],
				button: { label: "Empezar gratis", link: "#" },
			},
			{
				name: "Pro",
				price: 10,
				yearlyPrice: 110,
				features: [
					"10 Proyectos",
					"Soporte prioritario por email",
					"Herramientas de análisis",
				],
				isFeatured: true,
				button: { label: "Actualizar a Pro", link: "#" },
			},
			{
				name: "Empresa",
				price: 39,
				yearlyPrice: 390,
				features: [
					"Proyectos ilimitados",
					"Soporte dedicado",
					"Integraciones personalizadas",
				],
				button: { label: "Contactar ventas", link: "#" },
			},
		],
	},
} satisfies Record<LanguagesType, Pricing>;
