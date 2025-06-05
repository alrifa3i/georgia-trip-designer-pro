
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BookingData } from '@/types/booking';

interface BookingSearchResult {
  success: boolean;
  data?: any;
  error?: string;
}

interface SaveBookingResult {
  success: boolean;
  data?: { reference_number: string; id: string };
  error?: string;
  referenceNumber?: string;
}

export const useBookings = () => {
  const [loading, setLoading] = useState(false);

  const searchBooking = async (referenceNumber: string): Promise<BookingSearchResult> => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          booking_files (*)
        `)
        .eq('reference_number', referenceNumber)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return {
            success: false,
            error: 'لم يتم العثور على حجز بهذا الرقم المرجعي'
          };
        }
        throw error;
      }

      // تحويل البيانات إلى الشكل المتوقع
      const processedData = {
        reference_number: data.reference_number,
        customer_name: data.customer_name,
        phone_number: data.phone_number,
        arrival_date: data.arrival_date,
        departure_date: data.departure_date,
        arrival_airport: data.arrival_airport,
        departure_airport: data.departure_airport,
        adults: data.adults,
        children: Array.isArray(data.children) ? data.children : 
                 typeof data.children === 'string' ? JSON.parse(data.children || '[]') : [],
        rooms: data.rooms,
        budget: data.budget,
        total_cost: data.total_cost,
        currency: data.currency || 'USD',
        status: data.status,
        car_type: data.car_type,
        selected_cities: Array.isArray(data.selected_cities) ? data.selected_cities :
                        typeof data.selected_cities === 'string' ? JSON.parse(data.selected_cities || '[]') : [],
        additional_services: typeof data.additional_services === 'object' ? data.additional_services :
                           typeof data.additional_services === 'string' ? JSON.parse(data.additional_services || '{}') : {},
        discount_coupon: data.discount_coupon,
        discount_amount: data.discount_amount,
        booking_files: data.booking_files || []
      };

      return {
        success: true,
        data: processedData
      };
    } catch (error) {
      console.error('Error searching booking:', error);
      return {
        success: false,
        error: 'حدث خطأ أثناء البحث'
      };
    } finally {
      setLoading(false);
    }
  };

  const saveBooking = async (bookingData: BookingData): Promise<SaveBookingResult> => {
    setLoading(true);
    
    try {
      // إنشاء رقم مرجعي فريد
      const referenceNumber = bookingData.referenceNumber || `GEO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1).padStart(3, '0')}`;
      
      const bookingToSave = {
        reference_number: referenceNumber,
        customer_name: bookingData.customerName,
        phone_number: bookingData.phoneNumber,
        adults: bookingData.adults,
        children: JSON.stringify(bookingData.children || []),
        arrival_date: bookingData.arrivalDate,
        departure_date: bookingData.departureDate,
        arrival_airport: bookingData.arrivalAirport,
        departure_airport: bookingData.departureAirport,
        rooms: bookingData.rooms || 1,
        budget: bookingData.budget || 0,
        currency: bookingData.currency || 'USD',
        car_type: bookingData.carType,
        room_types: JSON.stringify(bookingData.roomTypes || []),
        selected_cities: JSON.stringify(bookingData.selectedCities || []),
        total_cost: bookingData.totalCost || 0,
        additional_services: JSON.stringify(bookingData.additionalServices || {}),
        discount_coupon: bookingData.discountCode || null,
        discount_amount: bookingData.discountAmount || 0,
        status: 'confirmed'
      };

      console.log('Saving booking to database:', bookingToSave);

      const { data: savedBooking, error } = await supabase
        .from('bookings')
        .insert(bookingToSave)
        .select()
        .single();

      if (error) {
        console.error('Error saving booking:', error);
        throw error;
      }

      console.log('Booking saved successfully:', savedBooking);

      return {
        success: true,
        data: {
          reference_number: referenceNumber,
          id: savedBooking.id
        },
        referenceNumber: referenceNumber
      };
    } catch (error) {
      console.error('Failed to save booking:', error);
      return {
        success: false,
        error: 'فشل في حفظ الحجز'
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    searchBooking,
    saveBooking,
    loading
  };
};
