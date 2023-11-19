const languages = ["en", "ar", "fr", "es"],
  translations = {
    login_success: {
      en: "Your login was successful",
      ar: "تم تسجيل الدخول بنجاح",
      fr: "Votre connexion a réussi",
      es: "Iniciar sesión correctamente",
    },
    login_unsuccess: {
      en: "The information is incorrect",
      ar: "المُدخلات غير صحيحة",
      fr: "Les informations sont incorrectes",
      es: "Entrada no válida",
    },
    signup_success: {
      en: "User created successfully",
      ar: "تم إنشاء حساب بنجاح",
      fr: "Compte créé avec succès",
      es: "Cuenta creada con éxito",
    },
    username_email_password_required: {
      en: "Username, Email and Password are required",
      ar: "إسم المستخدم, البريد وكلمة المرور حقول إجبارية",
      fr: "Nom d'utilisateur, Email et le mot de passe sont obligatoire",
      es: "Nombre de usuario, correo electrónico y contraseña son campos obligatorios",
    },
    user_exist: {
      en: "User Already Exist",
      ar: "المستخدم موجود بالفعل",
      fr: "l'utilisateur existe déja",
      es: "El usuario ya existe",
    },
    params_not_correct: {
      en: "The parameters sent was not correct",
      ar: "المُدخلات التي تم إرسالها غير صحيحة",
      fr: "Les paramètres envoyés n'étaient pas corrects",
      es: "La entrada que se envió no es válida",
    },
    too_few_arguments: {
      en: "Too few parameters",
      ar: "عدد المٌدخلات المُرسلة قليل",
      fr: "Trop peu de paramètres",
      es: "Muy pocas entradas enviadas",
    },
    no_password_found: {
      en: "Please fill the password field",
      ar: "المرجوا إدخال كلمة المرور",
      fr: "Veuillez remplir le champ du mot de passe",
      es: "Por favor ingrese la contraseña",
    },
    already_signed_in: {
      en: "You are already signed in",
      ar: "لقد سجلت الدخول بالفعل",
      fr: "Vous êtes déjà connecté",
      es: "Ya has iniciado sesión",
    },
    logout_success: {
      en: "You are now signed out",
      ar: "تم تسجيل الخروج بنجاح",
      fr: "Vous êtes maintenant déconnecté",
      es: "cierre de sesión exitoso",
    },
    login_first: {
      en: "Please login first",
      ar: "المرجو تسجيل الدخول اولاً",
      fr: "Veuillez d'abord vous connecter",
      es: "Inicie sesión primero",
    },
    logout_first: {
      en: "Please logout first",
      ar: "المرجو تسجيل الخروج اولاً",
      fr: "Veuillez d'abord vous déconnecter",
      es: "Cerrar sesión primero",
    },
    dont_have_access: {
      en: "You don't have access",
      ar: "ليس لديك الصلاحية",
      fr: "Vous n'avez pas accès",
      es: "No tienes permiso",
    },
    table_not_found: {
      en: "The requested table was not found",
      ar: "الجدول الذي تحاول الوصول له غير موجود",
      fr: "La table demandée n'a pas été trouvée",
      es: "La tabla a la que intenta acceder no existe",
    },
    domain_not_allowed: {
      en: "The domain is not allowed",
      ar: "الدومين غير موثوق",
      fr: "Le domaine n'est pas autorisé",
      es: "El dominio no es de confianza",
    },
    db_not_found: {
      en: "The database does not exist",
      ar: "قاعدة البيانات لا توجد",
      fr: "La base de données n'existe pas",
      es: "base de datos no encontrada",
    },
    unsupported_method: {
      en: "Unsupported Method",
      ar: "الطريقة غير مدعومة",
      fr: "Méthode non prise en charge",
      es: "método no compatible",
    },
    unsupported_browser: {
      en: "Unsupported Browser",
      ar: "المتصفح غير مدعوم",
      fr: "Navigateur non supporté",
      es: "Navegador no soportado",
    },
    internal_server_error: {
      en: "Internal Server Error",
      ar: "خطأ في الخادم الداخلي",
      fr: "Erreur Interne du Serveur",
      es: "error interno del servidor",
    },
    user_not_exist: {
      en: "User Does not Exist",
      ar: "هذا الحساب غير موجود",
      fr: "Ce compte n'existe pas",
      es: "Esta cuenta no existe",
    },
    no_data_found: {
      en: "No Data Found",
      ar: "لاتوجد اي بيانات في الطلب",
      fr: "Aucune data n'est trouvée",
      es: "No se encontraron datos en la solicitud",
    },
    database_slug_already_exists: {
      en: "Database Slug Already Exists",
      ar: "إسم قاعدة البيانات موجود بالفعل",
      fr: "Le slug de base de données existe déjà",
      es: "La babosa de base de datos ya existe",
    },
    no_database: {
      en: "no_database",
      ar: "no_database",
      fr: "no_database",
      es: "no_database",
    },
    200: {
      en: "Successfully updated",
      ar: "تم التحديث بنجاح",
      fr: "Mise à jour réussie",
      es: "Actualización completada con éxito",
    },
    201: {
      en: "Successfully created",
      ar: "تم الإنشاء بنجاح",
      fr: "Créé avec succès",
      es: "Creado correctamente",
    },
    202: {
      en: "Successfully displayed",
      ar: "تم العرض بنجاح",
      fr: "Affiché avec succès",
      es: "Reproducido con éxito",
    },
    204: {
      en: "Successfully deleted",
      ar: "تم الحذف بنجاح",
      fr: "Supprimé avec succès",
      es: "Borrar con éxito",
    },
    404: {
      en: "Content not found",
      ar: "المحتوى غير موجود",
      fr: "Contenu introuvable",
      es: "Contenido no encontrado",
    },
    500: {
      en: "Error while executing the query",
      ar: "حصل مشكل اثناء تطبيق الأمر",
      fr: "erreur lors de l'exécution de la requete",
      es: "Hubo un problema al aplicar el comando",
    },
  };
export const message = (
  code: keyof typeof translations,
  lang?: string | string[]
) =>
  translations[code] ??
  languages.reduce((acc, lang) => ({ ...acc, [lang]: code }), {});
