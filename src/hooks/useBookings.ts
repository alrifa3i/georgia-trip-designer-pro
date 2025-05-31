
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BookingData } from '@/types/booking';
import { useToast } from '@/hooks/use-toast';

export const useBookings = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateReferenceNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `GEO${timestamp}${random}`;
  };

  const saveBooking = async (bookingData: BookingData) => {
    setLoading(true);
    try {
      const referenceNumber = generateReferenceNumber();
      
      const bookingToSave = {
        reference_number: referenceNumber,
        customer_name: bookingData.customerName,
        phone_number: bookingData.phoneNumber,
        adults: bookingData.adults,
        children: JSON.stringify(bookingData.children),
        arrival_date: bookingData.arrivalDate,
        departure_date: bookingData.departureDate,
        arrival_airport: bookingData.arrivalAirport,
        departure_airport: bookingData.departureAirport,
        rooms: bookingData.rooms,
        budget: bookingData.budget,
        currency: bookingData.currency,
        room_types: JSON.stringify(bookingData.roomTypes),
        car_type: bookingData.carType,
        selected_cities: JSON.stringify(bookingData.selectedCities),
        total_cost: bookingData.totalCost,
        additional_services: JSON.stringify(bookingData.additionalServices),
        discount_coupon: bookingData.discountCoupon,
        discount_amount: bookingData.discountAmount || 0,
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingToSave])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "تم حفظ الحجز بنجاح! ✅",
        description: `رقم الحجز المرجعي: ${referenceNumber}`,
      });

      console.log('Booking saved successfully:', data);
      return { success: true, referenceNumber, data };
    } catch (error) {
      console.error('Error saving booking:', error);
      toast({
        title: "خطأ في حفظ الحجز",
        description: "حدث خطأ أثناء حفظ الحجز. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const searchBooking = async (referenceNumber: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('reference_number', referenceNumber.toUpperCase())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          toast({
            title: "لم يتم العثور على الحجز",
            description: "الرقم المرجعي غير صحيح أو غير موجود",
            variant: "destructive",
          });
          return { success: false, data: null };
        }
        throw error;
      }

      const bookingData: BookingData = {
        id: data.id,
        referenceNumber: data.reference_number,
        customerName: data.customer_name,
        phoneNumber: data.phone_number,
        adults: data.adults,
        children: typeof data.children === 'string' ? JSON.parse(data.children) : data.children,
        arrivalDate: data.arrival_date,
        departureDate: data.departure_date,
        arrivalAirport: data.arrival_airport,
        departureAirport: data.departure_airport,
        rooms: data.rooms,
        budget: data.budget,
        currency: data.currency,
        roomTypes: typeof data.room_types === 'string' ? JSON.parse(data.room_types) : data.room_types,
        carType: data.car_type,
        selectedCities: typeof data.selected_cities === 'string' ? JSON.parse(data.selected_cities) : data.selected_cities,
        totalCost: data.total_cost,
        additionalServices: typeof data.additional_services === 'string' ? JSON.parse(data.additional_services) : data.additional_services,
        discountCoupon: data.discount_coupon,
        discountAmount: data.discount_amount,
        status: data.status
      };

      return { success: true, data: bookingData };
    } catch (error) {
      console.error('Error searching booking:', error);
      toast({
        title: "خطأ في البحث",
        description: "حدث خطأ أثناء البحث عن الحجز",
        variant: "destructive",
      });
      return { success: false, data: null };
    } finally {
      setLoading(false);
    }
  };

  const getAllBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const bookingsData = data.map(booking => ({
        id: booking.id,
        referenceNumber: booking.reference_number,
        customerName: booking.customer_name,
        phoneNumber: booking.phone_number,
        adults: booking.adults,
        children: typeof booking.children === 'string' ? JSON.parse(booking.children) : booking.children,
        arrivalDate: booking.arrival_date,
        departureDate: booking.departure_date,
        arrivalAirport: booking.arrival_airport,
        departureAirport: booking.departure_airport,
        rooms: booking.rooms,
        budget: booking.budget,
        currency: booking.currency,
        roomTypes: typeof booking.room_types === 'string' ? JSON.parse(booking.room_types) : booking.room_types,
        carType: booking.car_type,
        selectedCities: typeof booking.selected_cities === 'string' ? JSON.parse(booking.selected_cities) : booking.selected_cities,
        totalCost: booking.total_cost,
        additionalServices: typeof booking.additional_services === 'string' ? JSON.parse(booking.additional_services) : booking.additional_services,
        discountCoupon: booking.discount_coupon,
        discountAmount: booking.discount_amount,
        status: booking.status
      }));

      setBookings(bookingsData);
      return { success: true, data: bookingsData };
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "خطأ في جلب البيانات",
        description: "حدث خطأ أثناء جلب الحجوزات",
        variant: "destructive",
      });
      return { success: false, data: [] };
    } finally {
      setLoading(false);
    }
  };

  return {
    bookings,
    loading,
    saveBooking,
    searchBooking,
    getAllBookings
  };
};
