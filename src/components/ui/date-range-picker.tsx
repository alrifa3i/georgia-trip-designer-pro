
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  arrivalDate: string;
  departureDate: string;
  onDateChange: (arrivalDate: string, departureDate: string) => void;
  label?: string;
  required?: boolean;
}

export const DateRangePicker = ({ 
  arrivalDate, 
  departureDate, 
  onDateChange, 
  label = "تواريخ السفر",
  required = false 
}: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: arrivalDate ? new Date(arrivalDate) : undefined,
    to: departureDate ? new Date(departureDate) : undefined,
  });

  const handleDateSelect = (range: { from: Date | undefined; to: Date | undefined } | undefined) => {
    if (range) {
      setSelectedRange(range);
      
      if (range.from && range.to) {
        onDateChange(
          format(range.from, 'yyyy-MM-dd'),
          format(range.to, 'yyyy-MM-dd')
        );
        setIsOpen(false);
      } else if (range.from && !range.to) {
        // إذا تم اختيار تاريخ البداية فقط
        onDateChange(
          format(range.from, 'yyyy-MM-dd'),
          ''
        );
      }
    }
  };

  const formatDateRange = () => {
    if (selectedRange.from && selectedRange.to) {
      return `${format(selectedRange.from, 'dd/MM/yyyy')} - ${format(selectedRange.to, 'dd/MM/yyyy')}`;
    } else if (selectedRange.from) {
      return `${format(selectedRange.from, 'dd/MM/yyyy')} - اختر تاريخ المغادرة`;
    }
    return 'اختر تواريخ السفر';
  };

  const getDateRangeDescription = () => {
    if (selectedRange.from && selectedRange.to) {
      const nights = Math.ceil((selectedRange.to.getTime() - selectedRange.from.getTime()) / (1000 * 60 * 60 * 24));
      return `${nights} ${nights === 1 ? 'ليلة' : nights === 2 ? 'ليلتان' : 'ليال'}`;
    }
    return '';
  };

  // منع اختيار التواريخ الماضية
  const disablePastDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <CalendarIcon className="w-4 h-4" />
        {label} {required && '*'}
      </Label>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-right font-normal h-auto py-3",
              !selectedRange.from && "text-muted-foreground"
            )}
          >
            <div className="flex flex-col items-start w-full">
              <span className="text-sm">{formatDateRange()}</span>
              {getDateRangeDescription() && (
                <span className="text-xs text-gray-500 mt-1">
                  {getDateRangeDescription()}
                </span>
              )}
            </div>
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={selectedRange}
            onSelect={handleDateSelect}
            disabled={disablePastDates}
            numberOfMonths={2}
            initialFocus
            className="pointer-events-auto"
          />
          <div className="p-3 border-t bg-gray-50">
            <p className="text-xs text-gray-600 text-center">
              اختر تاريخ الوصول ثم تاريخ المغادرة
            </p>
          </div>
        </PopoverContent>
      </Popover>

      {selectedRange.from && selectedRange.to && (
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
          <div>
            <span className="font-medium">تاريخ الوصول:</span>
            <br />
            {format(selectedRange.from, 'EEEE، d MMMM yyyy', { locale: ar })}
          </div>
          <div>
            <span className="font-medium">تاريخ المغادرة:</span>
            <br />
            {format(selectedRange.to, 'EEEE، d MMMM yyyy', { locale: ar })}
          </div>
        </div>
      )}
    </div>
  );
};
