import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'zh-HK'],
  defaultLocale: 'en',
  localePrefix: {
    mode: 'always',
    prefixes: {
      'zh-HK': '/zh',
    },
  },
});
