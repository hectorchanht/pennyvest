import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

async function loadMessages(locale: string) {
  switch (locale) {
    case 'en':
      return (await import('../messages/en.json')).default;
    case 'zh-HK':
      return (await import('../messages/zh-HK.json')).default;
    default:
      return (await import('../messages/en.json')).default;
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
