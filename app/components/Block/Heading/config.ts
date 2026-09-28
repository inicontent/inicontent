import type { LanguagesType } from "#imports";

export default {
	en: {
		preHeadingLink: {
			label: "Pre Heading Link",
			link: "#",
			design: 1,
		},
		preHeading: "pre Heading Text",
		heading: "Heading <span>Text</span>",
		description: "Description Text",
		tag: 1,
		align: "center",
	},
	ar: {
		preHeadingLink: {
			label: "رابط ما قبل العنوان",
			link: "#",
			design: 1,
		},
		preHeading: "نص ما قبل العنوان",
		heading: "نص <span>العنوان</span>",
		description: "نص الوصف",
		tag: 1,
		align: "center",
	},
	fr: {
		preHeadingLink: {
			label: "Lien précédant le titre",
			link: "#",
			design: 1,
		},
		preHeading: "Texte précédant le titre",
		heading: "Texte du <span>titre</span>",
		description: "Texte de description",
		tag: 1,
		align: "center",
	},
	es: {
		preHeadingLink: {
			label: "Enlace previo al título",
			link: "#",
			design: 1,
		},
		preHeading: "Texto previo al título",
		heading: "Texto del <span>título</span>",
		description: "Texto de descripción",
		tag: 1,
		align: "center",
	},
} satisfies Record<LanguagesType, Heading>;
