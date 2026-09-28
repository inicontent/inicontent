import type { LanguagesType } from "#imports";

export default {
	en: {
		preHeadingLink: { label: "PRO release - Join to waitlist", link: "#" },
		preHeading: `A vision for ${new Date().getFullYear()}`,
		heading: "Open-Source Web Template for SaaS, Startup, Apps, and More",
		description:
			"Multidisciplinary Web Template Built with Your Favourite Technology - HTML Bootstrap, Tailwind and React NextJS.",
		images: [
			{
				publicURL:
					"https://demo.tailgrids.com/templates/startup/build/src/assets/images/videos/image-01.jpg",
			},
		],
		buttons: [
			{
				label: "Download now",
				link: "#",
			},
		],
	},
	ar: {
		preHeadingLink: { label: "إصدار PRO - انضم إلى قائمة الانتظار", link: "#" },
		preHeading: `رؤية لعام ${new Date().getFullYear()}`,
		heading: "قالب ويب مفتوح المصدر للSaaS والشركات الناشئة والتطبيقات والمزيد",
		description:
			"قالب ويب متعدد التخصصات مبني بتقنيتك المفضلة - HTML Bootstrap و Tailwind و React NextJS.",
		images: [
			{
				publicURL:
					"https://demo.tailgrids.com/templates/startup/build/src/assets/images/videos/image-01.jpg",
			},
		],
		buttons: [
			{
				label: "حمّل الآن",
				link: "#",
			},
		],
	},
	fr: {
		preHeadingLink: {
			label: "Version PRO - Rejoignez la liste d'attente",
			link: "#",
		},
		preHeading: `Une vision pour ${new Date().getFullYear()}`,
		heading: "Modèle Web Open-Source pour SaaS, Startups, Applications et Plus",
		description:
			"Modèle Web Multidisciplinaire Construit avec Votre Technologie Préférée - HTML Bootstrap, Tailwind et React NextJS.",
		images: [
			{
				publicURL:
					"https://demo.tailgrids.com/templates/startup/build/src/assets/images/videos/image-01.jpg",
			},
		],
		buttons: [
			{
				label: "Télécharger maintenant",
				link: "#",
			},
		],
	},
	es: {
		preHeadingLink: {
			label: "Versión PRO - Únete a la lista de espera",
			link: "#",
		},
		preHeading: `Una visión para ${new Date().getFullYear()}`,
		heading:
			"Plantilla Web de Código Abierto para SaaS, Startups, Aplicaciones y Más",
		description:
			"Plantilla Web Multidisciplinaria Construida con Tu Tecnología Favorita - HTML Bootstrap, Tailwind y React NextJS.",
		images: [
			{
				publicURL:
					"https://demo.tailgrids.com/templates/startup/build/src/assets/images/videos/image-01.jpg",
			},
		],
		buttons: [
			{
				label: "Descargar ahora",
				link: "#",
			},
		],
	},
} satisfies Record<LanguagesType, Hero>;
