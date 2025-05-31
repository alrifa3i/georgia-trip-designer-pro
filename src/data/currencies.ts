
import { currencies } from './hotels';

export { currencies };

export const convertFromUSD = (amountUSD: number, targetCurrency: string): number => {
  const currency = currencies.find(c => c.code === targetCurrency);
  if (!currency) return amountUSD;
  
  return amountUSD * currency.exchangeRate;
};

export const formatCurrency = (amount: number, currencyCode: string): string => {
  const currency = currencies.find(c => c.code === currencyCode);
  if (!currency) return `$${amount.toFixed(2)}`;
  
  return `${amount.toFixed(2)} ${currency.symbol}`;
};

// إضافة العملات الخليجية الجديدة
export const additionalCurrencies = [
  { code: 'BHD', name: 'Bahraini Dinar', nameAr: 'دينار بحريني', symbol: 'د.ب', exchangeRate: 0.376 },
  { code: 'QAR', name: 'Qatari Riyal', nameAr: 'ريال قطري', symbol: 'ر.ق', exchangeRate: 3.64 },
  { code: 'OMR', name: 'Omani Rial', nameAr: 'ريال عماني', symbol: 'ر.ع', exchangeRate: 0.385 }
];
