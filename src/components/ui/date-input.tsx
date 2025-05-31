
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface DateInputProps {
  value: string;
  onChange: (date: string) => void;
  label: string;
  placeholder?: string;
  minDate?: Date;
  disabled?: (date: Date) => boolean;
  required?: boolean;
}

export const DateInput = ({ 
  value, 
  onChange, 
  label, 
  placeholder = "اختر التاريخ",
  minDate,
  disabled,
  required = false
}: DateInputProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onChange(format(date, 'yyyy-MM-dd'));
      setIsOpen(false);
    }
  };

  const handleInputChange = (inputValue: string) => {
    // تنسيق التاريخ تلقائياً أثناء الكتابة
    let formattedValue = inputValue.replace(/\D/g, ''); // إزالة كل شيء عدا الأرقام
    
    if (formattedValue.length >= 2) {
      formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2);
    }
    if (formattedValue.length >= 5) {
      formattedValue = formattedValue.substring(0, 5) + '/' + formattedValue.substring(5, 9);
    }
    
    // التحقق من صحة التاريخ عند الانتهاء من الكتابة
    if (formattedValue.length === 10) {
      const parts = formattedValue.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const year = parseInt(parts[2]);
        
        if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 2024) {
          const date = new Date(year, month - 1, day);
          if (date.getDate() === day && date.getMonth() === month - 1) {
            setSelectedDate(date);
            onChange(format(date, 'yyyy-MM-dd'));
            return;
          }
        }
      }
    }
  };

  const displayValue = selectedDate ? format(selectedDate, 'dd/MM/yyyy') : '';

  return (
    <div className="space-y-2">
      <Label>{label} {required && '*'}</Label>
      <div className="flex gap-2">
        <Input
          type="text"
          value={displayValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="يوم/شهر/سنة (مثل: 15/06/2024)"
          className="flex-1"
          maxLength={10}
        />
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="px-3"
              type="button"
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={disabled || ((date) => minDate ? date < minDate : date < new Date())}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      {selectedDate && (
        <p className="text-xs text-gray-500">
          {format(selectedDate, 'EEEE، d MMMM yyyy', { locale: ar })}
        </p>
      )}
    </div>
  );
};
