
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Country {
  code: string;
  name: string;
  nameAr: string;
  flag: string;
  dialCode: string;
}

const countries: Country[] = [
  // دول الخليج أولاً (ترتيب محدد)
  { code: 'SA', name: 'Saudi Arabia', nameAr: 'السعودية', flag: '🇸🇦', dialCode: '+966' },
  { code: 'QA', name: 'Qatar', nameAr: 'قطر', flag: '🇶🇦', dialCode: '+974' },
  { code: 'AE', name: 'UAE', nameAr: 'الإمارات', flag: '🇦🇪', dialCode: '+971' },
  { code: 'BH', name: 'Bahrain', nameAr: 'البحرين', flag: '🇧🇭', dialCode: '+973' },
  { code: 'OM', name: 'Oman', nameAr: 'عُمان', flag: '🇴🇲', dialCode: '+968' },
  { code: 'KW', name: 'Kuwait', nameAr: 'الكويت', flag: '🇰🇼', dialCode: '+965' },
  
  // باقي الدول
  { code: 'EG', name: 'Egypt', nameAr: 'مصر', flag: '🇪🇬', dialCode: '+20' },
  { code: 'JO', name: 'Jordan', nameAr: 'الأردن', flag: '🇯🇴', dialCode: '+962' },
  { code: 'LB', name: 'Lebanon', nameAr: 'لبنان', flag: '🇱🇧', dialCode: '+961' },
  { code: 'SY', name: 'Syria', nameAr: 'سوريا', flag: '🇸🇾', dialCode: '+963' },
  { code: 'IQ', name: 'Iraq', nameAr: 'العراق', flag: '🇮🇶', dialCode: '+964' },
  { code: 'YE', name: 'Yemen', nameAr: 'اليمن', flag: '🇾🇪', dialCode: '+967' },
  { code: 'MA', name: 'Morocco', nameAr: 'المغرب', flag: '🇲🇦', dialCode: '+212' },
  { code: 'DZ', name: 'Algeria', nameAr: 'الجزائر', flag: '🇩🇿', dialCode: '+213' },
  { code: 'TN', name: 'Tunisia', nameAr: 'تونس', flag: '🇹🇳', dialCode: '+216' },
  { code: 'LY', name: 'Libya', nameAr: 'ليبيا', flag: '🇱🇾', dialCode: '+218' },
  { code: 'SD', name: 'Sudan', nameAr: 'السودان', flag: '🇸🇩', dialCode: '+249' },
  { code: 'PS', name: 'Palestine', nameAr: 'فلسطين', flag: '🇵🇸', dialCode: '+970' },
  { code: 'TR', name: 'Turkey', nameAr: 'تركيا', flag: '🇹🇷', dialCode: '+90' },
  { code: 'US', name: 'United States', nameAr: 'أمريكا', flag: '🇺🇸', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', nameAr: 'بريطانيا', flag: '🇬🇧', dialCode: '+44' },
  { code: 'DE', name: 'Germany', nameAr: 'ألمانيا', flag: '🇩🇪', dialCode: '+49' },
  { code: 'FR', name: 'France', nameAr: 'فرنسا', flag: '🇫🇷', dialCode: '+33' },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  selectedCountry,
  onCountryChange,
  placeholder = "رقم الهاتف",
  disabled = false,
  className
}) => {
  const currentCountry = countries.find(c => c.code === selectedCountry) || countries[0];

  return (
    <div className={cn("flex gap-2", className)}>
      <Select value={selectedCountry} onValueChange={onCountryChange} disabled={disabled}>
        <SelectTrigger className="w-40">
          <SelectValue>
            <div className="flex items-center gap-2">
              <span>{currentCountry.flag}</span>
              <span className="text-sm">{currentCountry.dialCode}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {countries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <div className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span className="text-sm">{country.dialCode}</span>
                <span className="text-sm text-gray-600">{country.nameAr}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Input
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1"
        dir="ltr"
      />
    </div>
  );
};

export { countries };
