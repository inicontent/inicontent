import type { LanguagesType } from "#imports";

export default {
	en: {
		icon: {
			publicURL: "/favicon.ico",
		},
		logoType: "Inicontent",
		description:
			"Global brands see measurable success when they collaborate with us.",
		menu: [
			{
				label: "Product",
				children: [
					{ label: "Pricing", link: "#" },
					{ label: "Changelog", link: "#" },
					{ label: "Docs", link: "#" },
					{ label: "Download", link: "#" },
				],
			},
			{
				label: "Company",
				children: [
					{ label: "About us", link: "#" },
					{ label: "Blog", link: "#" },
					{ label: "Careers", link: "#" },
					{ label: "Sitemap", link: "#" },
				],
			},
			{
				label: "Resources",
				children: [
					{ label: "Community", link: "#" },
					{ label: "Help & Support", link: "#" },
					{ label: "Status", link: "#" },
				],
			},
		],
		copyright: "All rights reserved.",
		social: [
			{ label: "brand-twitter", link: "#" },
			{ label: "brand-facebook", link: "#" },
			{ label: "brand-snapchat", link: "#" },
			{ label: "brand-instagram", link: "#" },
			{ label: "brand-youtube", link: "#" },
		],
		newsletter: {
			title: "Stay up to date",
			description: "Get all the latest updates and news.",
			button: "Subscribe",
			placeholder: "Your Email",
		},
	},
	ar: {
		icon: {
			publicURL: "/favicon.ico",
		},
		logoType: "Inicontent",
		description:
			"تحصل العلامات التجارية العالمية على نجاح قابل للقياس عندما تتعاون معنا.",
		menu: [
			{
				label: "المنتج",
				children: [
					{ label: "الأسعار", link: "#" },
					{ label: "سجل التغييرات", link: "#" },
					{ label: "التوثيق", link: "#" },
					{ label: "التحميل", link: "#" },
				],
			},
			{
				label: "الشركة",
				children: [
					{ label: "من نحن", link: "#" },
					{ label: "المدونة", link: "#" },
					{ label: "الوظائف", link: "#" },
					{ label: "خريطة الموقع", link: "#" },
				],
			},
			{
				label: "الموارد",
				children: [
					{ label: "المجتمع", link: "#" },
					{ label: "المساعدة والدعم", link: "#" },
					{ label: "الحالة", link: "#" },
				],
			},
		],
		copyright: "جميع الحقوق محفوظة.",
		social: [
			{ label: "brand-twitter", link: "#" },
			{ label: "brand-facebook", link: "#" },
			{ label: "brand-snapchat", link: "#" },
			{ label: "brand-instagram", link: "#" },
			{ label: "brand-youtube", link: "#" },
		],
		newsletter: {
			title: "ابقَ على اطلاع",
			description: "احصل على جميع آخر التحديثات والأخبار.",
			button: "اشترك",
			placeholder: "بريدك الإلكتروني",
		},
	},
	fr: {
		icon: {
			publicURL: "/favicon.ico",
		},
		logoType: "Inicontent",
		description:
			"Les marques mondiales constatent un succès mesurable lorsqu'elles collaborent avec nous.",
		menu: [
			{
				label: "Produit",
				children: [
					{ label: "Tarifs", link: "#" },
					{ label: "Journal des modifications", link: "#" },
					{ label: "Documentation", link: "#" },
					{ label: "Téléchargement", link: "#" },
				],
			},
			{
				label: "Entreprise",
				children: [
					{ label: "À propos", link: "#" },
					{ label: "Blog", link: "#" },
					{ label: "Carrières", link: "#" },
					{ label: "Plan du site", link: "#" },
				],
			},
			{
				label: "Ressources",
				children: [
					{ label: "Communauté", link: "#" },
					{ label: "Aide & Support", link: "#" },
					{ label: "Statut", link: "#" },
				],
			},
		],
		copyright: "Tous droits réservés.",
		social: [
			{ label: "brand-twitter", link: "#" },
			{ label: "brand-facebook", link: "#" },
			{ label: "brand-snapchat", link: "#" },
			{ label: "brand-instagram", link: "#" },
			{ label: "brand-youtube", link: "#" },
		],
		newsletter: {
			title: "Restez informé",
			description: "Recevez toutes les dernières mises à jour et actualités.",
			button: "S'abonner",
			placeholder: "Votre email",
		},
	},
	es: {
		icon: {
			publicURL: "/favicon.ico",
		},
		logoType: "Inicontent",
		description:
			"Las marcas globales ven un éxito medible cuando colaboran con nosotros.",
		menu: [
			{
				label: "Producto",
				children: [
					{ label: "Precios", link: "#" },
					{ label: "Registro de cambios", link: "#" },
					{ label: "Documentación", link: "#" },
					{ label: "Descarga", link: "#" },
				],
			},
			{
				label: "Empresa",
				children: [
					{ label: "Sobre nosotros", link: "#" },
					{ label: "Blog", link: "#" },
					{ label: "Empleo", link: "#" },
					{ label: "Mapa del sitio", link: "#" },
				],
			},
			{
				label: "Recursos",
				children: [
					{ label: "Comunidad", link: "#" },
					{ label: "Ayuda y Soporte", link: "#" },
					{ label: "Estado", link: "#" },
				],
			},
		],
		copyright: "Todos los derechos reservados.",
		social: [
			{ label: "brand-twitter", link: "#" },
			{ label: "brand-facebook", link: "#" },
			{ label: "brand-snapchat", link: "#" },
			{ label: "brand-instagram", link: "#" },
			{ label: "brand-youtube", link: "#" },
		],
		newsletter: {
			title: "Mantente actualizado",
			description: "Recibe todas las últimas actualizaciones y noticias.",
			button: "Suscribirse",
			placeholder: "Tu correo electrónico",
		},
	},
} satisfies Record<LanguagesType, Footer>;
