import config from 'config';
import i18next from 'i18next';
import i18nextBackend from 'i18next-node-fs-backend';
import { InternalError } from './errors';

const currenciesWithNoDecimals = ['JPY'];

i18nextInit();

function i18nextInit() {
  const errorCallback = (err) => {
    if (err) throw InternalError('Failed to load localization files');
  };

  i18next
    .use(i18nextBackend)
    .init({
      backend: {
        loadPath: config.i18next?.translationFilePath,
      },
      fallbackLng: config.i18next?.defaultLocale || 'en-US',
      lng: config.i18next?.defaultLocale || 'en-US',
      preload: [config.i18next?.defaultLocale || 'en-US'],
      whitelist: config.i18next?.allowedLocales || [config.i18next?.defaultLocale || 'en-US'],
    }, errorCallback);
}

function localize(key, locale) {
  return i18next.t(key, { lng: locale ?? (config.i18next?.defaultLocale || 'en-US') });
}

function isCurrencyWithNoDecimals(currency: string) {
  return currenciesWithNoDecimals.includes(`${currency}`.toUpperCase());
}

function normalizeAmount(amount: string|number): number {
  return parseFloat(parseFloat(amount.toString()).toFixed(2));
}

function toAmountInDollars(amount: string|number, currency?: string): number {
  const normalizedAmount = normalizeAmount(amount);
  return isCurrencyWithNoDecimals(currency) ? normalizedAmount : normalizeAmount(normalizedAmount / 100);
}

function toAmountInCents(amountInCents: string|number, currency?: string) {
  const normalizedAmount = normalizeAmount(amountInCents);
  return isCurrencyWithNoDecimals(currency) ? normalizedAmount : normalizeAmount(Math.floor(normalizedAmount * 100));
}

export const finances = {
  toAmountInCents,
  toAmountInDollars,
};

export const translation = {
  localize,
};
