import type { LanguagesType } from "#imports";

const images = {
	headphones:
		"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
	watch:
		"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
	camera:
		"https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
};

export default {
	en: {
		preHeadingLink: {
			label: "Browse catalog",
			link: "#",
			design: 1,
		},
		preHeading: "Explore our collection",
		heading: "Latest <span>Products</span>",
		description: "Hand-picked items served directly from your data table.",
		label: "Learn More",
		limit: 6,
		showTagFilter: true,
		logosFilter: "grayscale",
		logosMarquee: false,
		demo: [
			{
				id: "loop-demo-1",
				image: images.headphones,
				title: "Aurora Wireless Headphones",
				subtitle: "$199",
				tag: "Audio",
				meta: "40h battery · In stock",
				description:
					"Immersive over-ear sound with active noise cancellation and 40-hour battery life.",
				link: "#",
			},
			{
				id: "loop-demo-2",
				image: images.watch,
				title: "Nebula Smartwatch",
				subtitle: "$249",
				tag: "Wearables",
				meta: "Always-on display",
				description:
					"Track your fitness, sleep and notifications with a sleek titanium case and always-on display.",
				link: "#",
			},
			{
				id: "loop-demo-3",
				image: images.camera,
				title: "Orion Mirrorless Camera",
				subtitle: "$899",
				tag: "Camera",
				meta: "26MP · 4K video",
				description:
					"Capture stunning detail with a 26MP sensor, 4K video and fast hybrid autofocus.",
				link: "#",
			},
		],
	},
	ar: {
		preHeadingLink: {
			label: "تصفح الكتالوج",
			link: "#",
			design: 1,
		},
		preHeading: "استكشف مجموعتنا",
		heading: "أحدث <span>المنتجات</span>",
		description: "عناصر مختارة تُعرض مباشرة من جدول بياناتك.",
		label: "اعرف المزيد",
		limit: 6,
		logosFilter: "grayscale",
		logosMarquee: false,
		demo: [
			{
				id: "loop-demo-1",
				image: images.headphones,
				title: "سماعات أورورا اللاسلكية",
				subtitle: "١٩٩$",
				tag: "صوت",
				meta: "بطارية 40 ساعة · متوفر",
				description:
					"صوت غامر بتقنية إلغاء الضوضاء النشط وعمر بطارية يصل إلى 40 ساعة.",
				link: "#",
			},
			{
				id: "loop-demo-2",
				image: images.watch,
				title: "ساعة نيبولا الذكية",
				subtitle: "٢٤٩$",
				tag: "قابلة للارتداء",
				meta: "شاشة دائمة التشغيل",
				description:
					"تتبع لياقتك ونومك وإشعاراتك مع هيكل تيتانيوم أنيق وشاشة دائمة التشغيل.",
				link: "#",
			},
			{
				id: "loop-demo-3",
				image: images.camera,
				title: "كاميرا أوريون بدون مرآة",
				subtitle: "٨٩٩$",
				tag: "كاميرا",
				meta: "26 ميجابكسل · فيديو 4K",
				description:
					"التقط تفاصيل مذهلة بمستشعر 26 ميجابكسل وفيديو 4K وتركيز تلقائي هجين سريع.",
				link: "#",
			},
		],
	},
	fr: {
		preHeadingLink: {
			label: "Parcourir le catalogue",
			link: "#",
			design: 1,
		},
		preHeading: "Explorez notre collection",
		heading: "Derniers <span>produits</span>",
		description:
			"Des articles choisis servis directement depuis votre table de données.",
		label: "En savoir plus",
		limit: 6,
		logosFilter: "grayscale",
		logosMarquee: false,
		demo: [
			{
				id: "loop-demo-1",
				image: images.headphones,
				title: "Casque sans fil Aurora",
				subtitle: "199 $",
				tag: "Audio",
				meta: "40 h d'autonomie · En stock",
				description:
					"Un son immersif circum-aural avec réduction active du bruit et 40 heures d'autonomie.",
				link: "#",
			},
			{
				id: "loop-demo-2",
				image: images.watch,
				title: "Montre connectée Nebula",
				subtitle: "249 $",
				tag: "Portables",
				meta: "Affichage permanent",
				description:
					"Suivez votre forme, votre sommeil et vos notifications avec un boîtier en titane élégant et un affichage permanent.",
				link: "#",
			},
			{
				id: "loop-demo-3",
				image: images.camera,
				title: "Appareil hybride Orion",
				subtitle: "899 $",
				tag: "Caméra",
				meta: "26 MP · Vidéo 4K",
				description:
					"Capturez des détails époustouflants avec un capteur 26 MP, une vidéo 4K et un autofocus hybride rapide.",
				link: "#",
			},
		],
	},
	es: {
		preHeadingLink: {
			label: "Explorar catálogo",
			link: "#",
			design: 1,
		},
		preHeading: "Explora nuestra colección",
		heading: "Últimos <span>productos</span>",
		description:
			"Artículos seleccionados servidos directamente desde tu tabla de datos.",
		label: "Saber más",
		limit: 6,
		logosFilter: "grayscale",
		logosMarquee: false,
		demo: [
			{
				id: "loop-demo-1",
				image: images.headphones,
				title: "Auriculares inalámbricos Aurora",
				subtitle: "$199",
				tag: "Audio",
				meta: "40 h de batería · En stock",
				description:
					"Sonido envolvente over-ear con cancelación activa de ruido y 40 horas de batería.",
				link: "#",
			},
			{
				id: "loop-demo-2",
				image: images.watch,
				title: "Smartwatch Nebula",
				subtitle: "$249",
				tag: "Portátiles",
				meta: "Pantalla siempre activa",
				description:
					"Sigue tu estado físico, sueño y notificaciones con una elegante caja de titanio y pantalla siempre activa.",
				link: "#",
			},
			{
				id: "loop-demo-3",
				image: images.camera,
				title: "Cámara sin espejo Orion",
				subtitle: "$899",
				tag: "Cámara",
				meta: "26 MP · Vídeo 4K",
				description:
					"Captura detalles impresionantes con un sensor de 26 MP, vídeo 4K y enfoque automático híbrido rápido.",
				link: "#",
			},
		],
	},
} satisfies Record<LanguagesType, Loop>;
