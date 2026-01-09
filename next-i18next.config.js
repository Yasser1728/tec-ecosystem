// next-i18next.config.js
export default {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ar"],
    localeDetection: false,
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
