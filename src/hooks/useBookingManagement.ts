
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BookingData } from '@/types/booking';

interface BookingFile {
  id: string;
  booking_id: string;
  file_name: string;
  file_type: 'passport' | 'ticket';
  file_url: string;
  file_size?: number;
  mime_type?: string;
  uploaded_at: string;
}

interface BookingRecord {
  id: string;
  reference_number: string;
  customer_name: string;
  phone_number: string;
  adults: number;
  children: any;
  arrival_date: string;
  departure_date: string;
  arrival_airport?: string;
  departure_airport?: string;
  rooms: number;
  budget?: number;
  currency: string;
  car_type?: string;
  room_types?: any;
  selected_cities?: any;
  total_cost?: number;
  additional_services?: any;
  status: string;
  created_at: string;
  updated_at?: string;
  booking_files?: BookingFile[];
}

export const useBookingManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processBookingData = (data: any): BookingRecord => {
    return {
      ...data,
      booking_files: data.booking_files?.map((file: any) => ({
        ...file,
        file_type: file.file_type as 'passport' | 'ticket'
      })) || []
    };
  };

  const searchBookingByReference = async (referenceNumber: string): Promise<BookingRecord | null> => {
    setLoading(true);
    setError(null);
    
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
          setError('لم يتم العثور على حجز بهذا الرقم المرجعي');
          return null;
        }
        throw error;
      }

      return processBookingData(data);
    } catch (err) {
      setError('حدث خطأ أثناء البحث');
      console.error('Error searching booking:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getAllBookings = async (): Promise<BookingRecord[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          booking_files (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(processBookingData) || [];
    } catch (err) {
      setError('حدث خطأ أثناء تحميل الحجوزات');
      console.error('Error fetching bookings:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      return true;
    } catch (err) {
      setError('حدث خطأ أثناء تحديث الحالة');
      console.error('Error updating booking status:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (
    bookingId: string, 
    file: File, 
    fileType: 'passport' | 'ticket'
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${bookingId}/${fileType}/${Date.now()}.${fileExt}`;

      // رفع الملف إلى Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('booking-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // الحصول على URL الملف
      const { data: urlData } = supabase.storage
        .from('booking-files')
        .getPublicUrl(fileName);

      // حفظ معلومات الملف في قاعدة البيانات
      const { error: dbError } = await supabase
        .from('booking_files')
        .insert({
          booking_id: bookingId,
          file_name: file.name,
          file_type: fileType,
          file_url: urlData.publicUrl,
          file_size: file.size,
          mime_type: file.type
        });

      if (dbError) throw dbError;

      return urlData.publicUrl;
    } catch (err) {
      setError('حدث خطأ أثناء رفع الملف');
      console.error('Error uploading file:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileId: string, fileName: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // حذف الملف من Storage
      const { error: storageError } = await supabase.storage
        .from('booking-files')
        .remove([fileName]);

      if (storageError) {
        console.warn('Warning deleting from storage:', storageError);
      }

      // حذف سجل الملف من قاعدة البيانات
      const { error: dbError } = await supabase
        .from('booking_files')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;

      return true;
    } catch (err) {
      setError('حدث خطأ أثناء حذف الملف');
      console.error('Error deleting file:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    searchBookingByReference,
    getAllBookings,
    updateBookingStatus,
    uploadFile,
    deleteFile
  };
};
