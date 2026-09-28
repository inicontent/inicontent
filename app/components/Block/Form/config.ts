import type { LanguagesType } from "#imports";

const images = {
	contact:
		"https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
};

export default {
	en: {
		preHeading: "Quick response",
		heading: "Get in <span>touch</span>",
		description: "Fill out the form and we will get back to you shortly.",
		media: { publicURL: images.contact },
		fields: [],
		submitLabel: "Submit",
		successMessage: "Thanks! Your submission has been received.",
		stepSize: 2,
	},
	ar: {
		preHeading: "رد سريع",
		heading: "تواصل <span>معنا</span>",
		description: "املأ النموذج وسنعاود الاتصال بك قريبا.",
		media: { publicURL: images.contact },
		fields: [],
		submitLabel: "إرسال",
		successMessage: "شكرا لك! تم استلام إرسالك.",
		stepSize: 2,
	},
	fr: {
		preHeading: "Réponse rapide",
		heading: "Contactez-<span>nous</span>",
		description: "Remplissez le formulaire et nous vous répondrons rapidement.",
		media: { publicURL: images.contact },
		fields: [],
		submitLabel: "Envoyer",
		successMessage: "Merci ! Votre demande a bien été reçue.",
		stepSize: 2,
	},
	es: {
		preHeading: "Respuesta rápida",
		heading: "Ponte en <span>contacto</span>",
		description: "Completa el formulario y te responderemos pronto.",
		media: { publicURL: images.contact },
		fields: [],
		submitLabel: "Enviar",
		successMessage: "¡Gracias! Hemos recibido tu envío.",
		stepSize: 2,
	},
} satisfies Record<LanguagesType, Form>;
