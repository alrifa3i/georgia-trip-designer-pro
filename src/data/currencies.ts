
export interface Currency {
  code: string;
  symbol: string;
  name: string;
  nameAr: string;
  exchangeRate: number; // Rate to USD (1 USD = X local currency)
}

export const currencies: Currency[] = [
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    nameAr: 'دولار أمريكي',
    exchangeRate: 1
  },
  {
    code: 'SAR',
    symbol: 'ريال',
    name: 'Saudi Riyal',
    nameAr: 'ريال سعودي',
    exchangeRate: 3.75
  },
  {
    code: 'QAR',
    symbol: 'ريال',
    name: 'Qatari Riyal',
    nameAr: 'ريال قطري',
    exchangeRate: 3.64
  },
  {
    code: 'AED',
    symbol: 'درهم',
    name: 'UAE Dirham',
    nameAr: 'درهم إماراتي',
    exchangeRate: 3.67
  },
  {
    code: 'KWD',
    symbol: 'د.ك',
    name: 'Kuwaiti Dinar',
    nameAr: 'دينار كويتي',
    exchangeRate: 0.31
  },
  {
    code: 'BHD',
    symbol: 'د.ب',
    name: 'Bahraini Dinar',
    nameAr: 'دينار بحريني',
    exchangeRate: 0.38
  }
];

export const convertFromUSD = (usdAmount: number, targetCurrency: string): number => {
  const currency = currencies.find(c => c.code === targetCurrency);
  if (!currency) return usdAmount;
  return usdAmount * currency.exchangeRate;
};

export const convertToUSD = (amount: number, fromCurrency: string): number => {
  const currency = currencies.find(c => c.code === fromCurrency);
  if (!currency) return amount;
  return amount / currency.exchangeRate;
};

export const formatCurrency = (amount: number, currencyCode: string): string => {
  const currency = currencies.find(c => c.code === currencyCode);
  if (!currency) return `${amount} USD`;
  
  const formatted = new Intl.NumberFormat('ar-SA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(Math.round(amount));
  
  return `${formatted} ${currency.symbol}`;
};
