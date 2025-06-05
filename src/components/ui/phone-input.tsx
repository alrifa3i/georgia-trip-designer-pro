
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
  digitCount: number; // عدد الأرقام المتوقع بدون كود الدولة
}

const countries: Country[] = [
  // دول الخليج أولاً (ترتيب محدد)
  { code: 'SA', name: 'Saudi Arabia', nameAr: 'السعودية', flag: '🇸🇦', dialCode: '+966', digitCount: 9 },
  { code: 'QA', name: 'Qatar', nameAr: 'قطر', flag: '🇶🇦', dialCode: '+974', digitCount: 8 },
  { code: 'AE', name: 'UAE', nameAr: 'الإمارات', flag: '🇦🇪', dialCode: '+971', digitCount: 9 },
  { code: 'BH', name: 'Bahrain', nameAr: 'البحرين', flag: '🇧🇭', dialCode: '+973', digitCount: 8 },
  { code: 'OM', name: 'Oman', nameAr: 'عُمان', flag: '🇴🇲', dialCode: '+968', digitCount: 8 },
  { code: 'KW', name: 'Kuwait', nameAr: 'الكويت', flag: '🇰🇼', dialCode: '+965', digitCount: 8 },
  
  // باقي الدول
  { code: 'EG', name: 'Egypt', nameAr: 'مصر', flag: '🇪🇬', dialCode: '+20', digitCount: 10 },
  { code: 'JO', name: 'Jordan', nameAr: 'الأردن', flag: '🇯🇴', dialCode: '+962', digitCount: 9 },
  { code: 'LB', name: 'Lebanon', nameAr: 'لبنان', flag: '🇱🇧', dialCode: '+961', digitCount: 8 },
  { code: 'SY', name: 'Syria', nameAr: 'سوريا', flag: '🇸🇾', dialCode: '+963', digitCount: 9 },
  { code: 'IQ', name: 'Iraq', nameAr: 'العراق', flag: '🇮🇶', dialCode: '+964', digitCount: 10 },
  { code: 'YE', name: 'Yemen', nameAr: 'اليمن', flag: '🇾🇪', dialCode: '+967', digitCount: 9 },
  { code: 'MA', name: 'Morocco', nameAr: 'المغرب', flag: '🇲🇦', dialCode: '+212', digitCount: 9 },
  { code: 'DZ', name: 'Algeria', nameAr: 'الجزائر', flag: '🇩🇿', dialCode: '+213', digitCount: 9 },
  { code: 'TN', name: 'Tunisia', nameAr: 'تونس', flag: '🇹🇳', dialCode: '+216', digitCount: 8 },
  { code: 'LY', name: 'Libya', nameAr: 'ليبيا', flag: '🇱🇾', dialCode: '+218', digitCount: 9 },
  { code: 'SD', name: 'Sudan', nameAr: 'السودان', flag: '🇸🇩', dialCode: '+249', digitCount: 9 },
  { code: 'PS', name: 'Palestine', nameAr: 'فلسطين', flag: '🇵🇸', dialCode: '+970', digitCount: 9 },
  { code: 'TR', name: 'Turkey', nameAr: 'تركيا', flag: '🇹🇷', dialCode: '+90', digitCount: 10 },
  { code: 'US', name: 'United States', nameAr: 'أمريكا', flag: '🇺🇸', dialCode: '+1', digitCount: 10 },
  { code: 'GB', name: 'United Kingdom', nameAr: 'بريطانيا', flag: '🇬🇧', dialCode: '+44', digitCount: 10 },
  { code: 'DE', name: 'Germany', nameAr: 'ألمانيا', flag: '🇩🇪', dialCode: '+49', digitCount: 11 },
  { code: 'FR', name: 'France', nameAr: 'فرنسا', flag: '🇫🇷', dialCode: '+33', digitCount: 9 },
  { code: 'GE', name: 'Georgia', nameAr: 'جورجيا', flag: '🇬🇪', dialCode: '+995', digitCount: 9 },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  selectedCountry,
  onCountryChange,
  placeholder = "رقم الهاتف",
  disabled = false,
  className,
  error
}) => {
  const currentCountry = countries.find(c => c.code === selectedCountry) || countries[0];

  // تنظيف الرقم وإزالة الصفر من البداية
  const formatPhoneNumber = (phoneValue: string): string => {
    // إزالة كل شيء عدا الأرقام
    let cleaned = phoneValue.replace(/\D/g, '');
    
    // إذا بدأ بصفر، أزله
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    
    return cleaned;
  };

  // التحقق من صحة الرقم
  const isValidPhoneNumber = (phoneValue: string): boolean => {
    const cleaned = formatPhoneNumber(phoneValue);
    return cleaned.length === currentCountry.digitCount;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formattedValue = formatPhoneNumber(inputValue);
    
    // تحديد الحد الأقصى للأرقام
    if (formattedValue.length <= currentCountry.digitCount) {
      // حفظ الرقم مع كود الدولة
      const fullPhoneNumber = formattedValue ? `${currentCountry.dialCode}${formattedValue}` : '';
      onChange(fullPhoneNumber);
    }
  };

  // استخراج الرقم بدون كود الدولة للعرض
  const getDisplayPhoneNumber = (): string => {
    if (!value) return '';
    
    // إذا كان الرقم يحتوي على كود الدولة، أزله للعرض
    const dialCode = currentCountry.dialCode;
    if (value.startsWith(dialCode)) {
      return value.substring(dialCode.length);
    }
    
    return value;
  };

  // الحصول على الرقم الكامل للعرض
  const getFullPhoneNumber = (): string => {
    const displayNumber = getDisplayPhoneNumber();
    if (!displayNumber) return '';
    return `${currentCountry.dialCode}${displayNumber}`;
  };

  const displayNumber = getDisplayPhoneNumber();
  const isValid = displayNumber ? isValidPhoneNumber(displayNumber) : true;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex gap-2">
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
          value={displayNumber}
          onChange={handlePhoneChange}
          placeholder={`${currentCountry.digitCount} أرقام`}
          disabled={disabled}
          className={cn(
            "flex-1",
            !isValid && displayNumber && "border-red-500 focus:border-red-500"
          )}
          dir="ltr"
        />
      </div>

      {/* معلومات إضافية */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>الرقم الكامل: {getFullPhoneNumber() || `${currentCountry.dialCode}xxxxxxxxx`}</span>
        <span>
          {displayNumber ? `${displayNumber.length}/${currentCountry.digitCount}` : `0/${currentCountry.digitCount}`}
        </span>
      </div>

      {/* رسائل التحقق */}
      {displayNumber && !isValid && (
        <p className="text-red-500 text-xs">
          يجب أن يكون الرقم {currentCountry.digitCount} أرقام لدولة {currentCountry.nameAr}
        </p>
      )}
      
      {displayNumber && isValid && (
        <p className="text-green-600 text-xs">
          ✅ رقم صحيح
        </p>
      )}

      {error && (
        <p className="text-red-500 text-xs">{error}</p>
      )}
    </div>
  );
};

export { countries };
