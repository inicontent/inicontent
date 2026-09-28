import type { LanguagesType } from "#imports";

export default {
	en: {
		button: {
			label: "Shop now",
			link: "#",
		},
		text: "Shop for everyone on your list with the Preline Guide.",
	},
	ar: {
		button: {
			label: "تسوّق الآن",
			link: "#",
		},
		text: "تسوّق لكل من في قائمتك مع دليل Preline.",
	},
	fr: {
		button: {
			label: "Acheter maintenant",
			link: "#",
		},
		text: "Faites vos achats pour tous ceux de votre liste avec le guide Preline.",
	},
	es: {
		button: {
			label: "Comprar ahora",
			link: "#",
		},
		text: "Compra para todos en tu lista con la guía Preline.",
	},
} satisfies Record<LanguagesType, HeaderAnnouncement>;
