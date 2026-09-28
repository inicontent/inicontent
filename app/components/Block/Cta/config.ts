import type { LanguagesType } from "#imports";

export default {
	en: {
		preHeading: "Ready when you are",
		heading: "Ready to <span>create?</span>",
		description: "Book your space, or tell us about a bigger project.",
		buttons: [
			{ label: "Book Now", link: "#" },
			{ label: "Request a Quote", link: "#" },
		],
		theme: "light",
	},
	ar: {
		preHeading: "جاهز عندما تكون",
		heading: "جاهز <span>تبدأ؟</span>",
		description: "احجز مساحتك، أو خبّرنا عن مشروع أكبر.",
		buttons: [
			{ label: "احجز الآن", link: "#" },
			{ label: "اطلب عرض سعر", link: "#" },
		],
		theme: "light",
	},
	fr: {
		preHeading: "Prêt quand vous l'êtes",
		heading: "Prêt à <span>créer ?</span>",
		description:
			"Réservez votre espace, ou parlez-nous d'un projet plus ambitieux.",
		buttons: [
			{ label: "Réserver", link: "#" },
			{ label: "Demander un devis", link: "#" },
		],
		theme: "light",
	},
	es: {
		preHeading: "Listo cuando quieras",
		heading: "¿Listo para <span>crear?</span>",
		description: "Reserva tu espacio o cuéntanos sobre un proyecto más grande.",
		buttons: [
			{ label: "Reservar", link: "#" },
			{ label: "Solicitar presupuesto", link: "#" },
		],
		theme: "light",
	},
} satisfies Record<LanguagesType, Cta>;
