const d = {
  ar: { pick: 'اختر سيرفر أو أنشئ واحد', settings: 'الإعدادات', logout: 'تسجيل الخروج', send: 'صيفط', account: 'حسابي', appearance: 'المظهر', language: 'اللغة' },
  fr: { pick: 'Choisis un serveur ou crées-en un', settings: 'Paramètres', logout: 'Se déconnecter', send: 'Envoyer', account: 'Mon compte', appearance: 'Apparence', language: 'Langue' },
  en: { pick: 'Pick a server or create one', settings: 'Settings', logout: 'Log out', send: 'Send', account: 'My Account', appearance: 'Appearance', language: 'Language' } }
export const t = (lang: string, k: keyof typeof d.en) => (d as any)[lang]?.[k] ?? d.en[k]
