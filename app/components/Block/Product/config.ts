import type { LanguagesType } from "#imports";

// Primary + secondary product images (first is the primary).
const images = [
	"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
	"https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=1200&q=80",
	"https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
].map((url) => ({ publicURL: url }));

export default {
	en: {
		heading: "Product Details",
		preHeading: "Aurora Wireless Headphones",
		description:
			"Studio-grade sound with adaptive noise cancelling, a 40-hour battery and plush memory-foam earcups for all-day comfort.",
		currency: "$",
		buttonLabel: "Add to cart",
		showQuantity: true,
		specs: [
			{ label: "Battery", value: "40 hours" },
			{ label: "Connectivity", value: "Bluetooth 5.3" },
			{ label: "Color", value: "Midnight Black" },
			{ label: "Warranty", value: "2 years" },
		],
		demo: {
			gallery: images,
			title: "Aurora Wireless Headphones",
			tagline: "Immersive sound, minus the noise",
			price: 199,
			oldPrice: 249,
			description:
				"Studio-grade sound with adaptive noise cancelling, a 40-hour battery and plush memory-foam earcups for all-day comfort.",
			rating: 4.8,
			reviews: 128,
			badge: "Bestseller",
		},
	},
	ar: {
		heading: "تفاصيل المنتج",
		preHeading: "سماعات أورورا اللاسلكية",
		description:
			"صوت بجودة الاستوديو مع عزل ضوضاء تكيفي وبطارية تدوم 40 ساعة ووسائد أذن مريحة من الإسفنج الذكي.",
		currency: "$",
		buttonLabel: "أضف إلى السلة",
		showQuantity: true,
		specs: [
			{ label: "البطارية", value: "40 ساعة" },
			{ label: "الاتصال", value: "بلوتوث 5.3" },
			{ label: "اللون", value: "أسود منتصف الليل" },
			{ label: "الضمان", value: "سنتان" },
		],
		demo: {
			gallery: images,
			title: "سماعات أورورا اللاسلكية",
			tagline: "صوت غامر بلا ضجيج",
			price: 199,
			oldPrice: 249,
			description:
				"صوت بجودة الاستوديو مع عزل ضوضاء تكيفي وبطارية تدوم 40 ساعة ووسائد أذن مريحة من الإسفنج الذكي.",
			rating: 4.8,
			reviews: 128,
			badge: "الأكثر مبيعًا",
		},
	},
	fr: {
		heading: "Détails du produit",
		preHeading: "Casque sans fil Aurora",
		description:
			"Un son de qualité studio avec réduction adaptative du bruit, une autonomie de 40 heures et des coussinets à mémoire de forme.",
		currency: "$",
		buttonLabel: "Ajouter au panier",
		showQuantity: true,
		specs: [
			{ label: "Batterie", value: "40 heures" },
			{ label: "Connectivité", value: "Bluetooth 5.3" },
			{ label: "Couleur", value: "Noir minuit" },
			{ label: "Garantie", value: "2 ans" },
		],
		demo: {
			gallery: images,
			title: "Casque sans fil Aurora",
			tagline: "Un son immersif, sans le bruit",
			price: 199,
			oldPrice: 249,
			description:
				"Un son de qualité studio avec réduction adaptative du bruit, une autonomie de 40 heures et des coussinets à mémoire de forme.",
			rating: 4.8,
			reviews: 128,
			badge: "Best-seller",
		},
	},
	es: {
		heading: "Detalles del producto",
		preHeading: "Auriculares inalámbricos Aurora",
		description:
			"Sonido de estudio con cancelación adaptativa de ruido, batería de 40 horas y almohadillas de espuma viscoelástica.",
		currency: "$",
		buttonLabel: "Añadir al carrito",
		showQuantity: true,
		specs: [
			{ label: "Batería", value: "40 horas" },
			{ label: "Conectividad", value: "Bluetooth 5.3" },
			{ label: "Color", value: "Negro medianoche" },
			{ label: "Garantía", value: "2 años" },
		],
		demo: {
			gallery: images,
			title: "Auriculares inalámbricos Aurora",
			tagline: "Sonido envolvente, sin el ruido",
			price: 199,
			oldPrice: 249,
			description:
				"Sonido de estudio con cancelación adaptativa de ruido, batería de 40 horas y almohadillas de espuma viscoelástica.",
			rating: 4.8,
			reviews: 128,
			badge: "Más vendido",
		},
	},
} satisfies Record<LanguagesType, Product>;
