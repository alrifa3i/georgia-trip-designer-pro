
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
