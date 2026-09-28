import type { LanguagesType } from "#imports";

export default {
	en: {
		announcement: {
			button: {
				label: "Shop now",
				link: "#",
			},
			text: "Shop for everyone on your list.",
			design: 1,
		},
		icon: {
			publicURL: "/favicon.ico",
		},
		logoType: "Inicontent",
		menu: [
			{
				label: "Home",
				link: "#",
			},
			{
				label: "About us",
				link: "#",
			},
			{
				label: "Pricing",
				link: "#",
			},
		],
		buttons: [
			{
				label: "Contact us",
				link: "#",
			},
		],
		account: {
			label: "Account",
			link: "#",
		},
	},
	ar: {
		announcement: {
			button: {
				label: "تسوّق الآن",
				link: "#",
			},
			text: "تسوّق لكل من في قائمتك.",
			design: 1,
		},
		icon: {
			publicURL: "/favicon.ico",
		},
		logoType: "Inicontent",
		menu: [
			{
				label: "الرئيسية",
				link: "#",
			},
			{
				label: "من نحن",
				link: "#",
			},
			{
				label: "الأسعار",
				link: "#",
			},
		],
		buttons: [
			{
				label: "اتصل بنا",
				link: "#",
			},
		],
		account: {
			label: "الحساب",
			link: "#",
		},
	},
	fr: {
		announcement: {
			button: {
				label: "Acheter maintenant",
				link: "#",
			},
			text: "Faites vos achats pour tous ceux de votre liste.",
			design: 1,
		},
		icon: {
			publicURL: "/favicon.ico",
		},
		logoType: "Inicontent",
		menu: [
			{
				label: "Accueil",
				link: "#",
			},
			{
				label: "À propos",
				link: "#",
			},
			{
				label: "Tarifs",
				link: "#",
			},
		],
		buttons: [
			{
				label: "Contactez-nous",
				link: "#",
			},
		],
		account: {
			label: "Compte",
			link: "#",
		},
	},
	es: {
		announcement: {
			button: {
				label: "Comprar ahora",
				link: "#",
			},
			text: "Compra para todos en tu lista.",
			design: 1,
		},
		icon: {
			publicURL: "/favicon.ico",
		},
		logoType: "Inicontent",
		menu: [
			{
				label: "Inicio",
				link: "#",
			},
			{
				label: "Sobre nosotros",
				link: "#",
			},
			{
				label: "Precios",
				link: "#",
			},
		],
		buttons: [
			{
				label: "Contáctanos",
				link: "#",
			},
		],
		account: {
			label: "Cuenta",
			link: "#",
		},
	},
} satisfies Record<LanguagesType, Header>;
