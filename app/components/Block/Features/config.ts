import type { LanguagesType } from "#imports";

export default {
	en: {
		preHeadingLink: { label: "Learn more", link: "#" },
		heading: "Robust Features",
		description:
			"With concepts in mind, we carefully design and perfect every detail to match your vision and goals.",
		preHeading: "Simplify operations for your business.",
		items: [
			{
				icon: "palette",
				title: "Build your portfolio",
				description:
					"The simplest way to keep your portfolio always up-to-date.",
				link: "#",
			},
			{
				icon: "messages",
				title: "Get freelance work",
				description:
					"New design projects delivered to your inbox each morning.",
				link: "#",
			},
			{
				icon: "building-store",
				title: "Sell your goods",
				description:
					"Get your goods in front of millions of potential customers with ease.",
				link: "#",
			},
		],
	},
	ar: {
		preHeadingLink: { label: "اعرف المزيد", link: "#" },
		heading: "ميزات قوية",
		description:
			"بفكرنا في الذهن، نصمم وننقي كل تفصيل بعناية لتتناسب مع رؤيتك وأهدافك.",
		preHeading: "بسّط العمليات لأعمالك.",
		items: [
			{
				icon: "palette",
				title: "أنشئ معرض أعمالك",
				description: "الطريقة الأبسط لإبقاء معرض أعمالك محدثًا دائمًا.",
				link: "#",
			},
			{
				icon: "messages",
				title: "احصل على عمل حر",
				description: "مشاريع تصميم جديدة تصل إلى صندوق بريدك كل صباح.",
				link: "#",
			},
			{
				icon: "building-store",
				title: "بيّع منتجاتك",
				description: "اعرض منتجاتك أمام ملايين العملاء المحتملين بسهولة.",
				link: "#",
			},
		],
	},
	fr: {
		preHeadingLink: { label: "En savoir plus", link: "#" },
		heading: "Fonctionnalités Robustes",
		description:
			"Avec des concepts à l'esprit, nous concevons et perfectionnons soigneusement chaque détail pour correspondre à votre vision et à vos objectifs.",
		preHeading: "Simplifiez les opérations pour votre entreprise.",
		items: [
			{
				icon: "palette",
				title: "Construisez votre portfolio",
				description:
					"Le moyen le plus simple de garder votre portfolio toujours à jour.",
				link: "#",
			},
			{
				icon: "messages",
				title: "Obtenez du travail freelance",
				description:
					"Nouveaux projets de design livrés dans votre boîte mail chaque matin.",
				link: "#",
			},
			{
				icon: "building-store",
				title: "Vendez vos produits",
				description:
					"Présentez vos produits à des millions de clients potentiels facilement.",
				link: "#",
			},
		],
	},
	es: {
		preHeadingLink: { label: "Más información", link: "#" },
		heading: "Funciones Robustas",
		description:
			"Conceptos en mente, diseñamos y perfeccionamos cuidadosamente cada detalle para coincidir con tu visión y objetivos.",
		preHeading: "Simplifica las operaciones de tu negocio.",
		items: [
			{
				icon: "palette",
				title: "Construye tu portafolio",
				description:
					"La forma más simple de mantener tu portafolio siempre actualizado.",
				link: "#",
			},
			{
				icon: "messages",
				title: "Obtén trabajo freelance",
				description:
					"Nuevos proyectos de diseño entregados en tu bandeja cada mañana.",
				link: "#",
			},
			{
				icon: "building-store",
				title: "Vende tus productos",
				description:
					"Lleva tus productos ante millones de clientes potenciales con facilidad.",
				link: "#",
			},
		],
	},
} satisfies Record<LanguagesType, Features>;
