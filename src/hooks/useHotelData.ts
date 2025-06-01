
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Hotel } from '@/types/booking';

interface DatabaseHotel {
  id: string;
  name: string;
  city: string;
  single_price?: number;
  single_view_price?: number;
  double_without_view_price?: number;
  double_view_price?: number;
  triple_without_view_price?: number;
  triple_view_price?: number;
  rating?: number;
  distance_from_center?: number;
  amenities?: string[];
  is_active?: boolean;
}

export const useHotelData = () => {
  const [hotels, setHotels] = useState<Record<string, Hotel[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const { data, error } = await supabase
          .from('hotels')
          .select('*')
          .eq('is_active', true);

        if (error) throw error;

        // تجميع الفنادق حسب المدينة
        const hotelsByCity: Record<string, Hotel[]> = {};
        
        data?.forEach((dbHotel: DatabaseHotel) => {
          const hotel: Hotel = {
            id: dbHotel.id,
            name: dbHotel.name,
            city: dbHotel.city,
            single_price: dbHotel.single_price || 0,
            single_view_price: dbHotel.single_view_price || 0,
            double_without_view_price: dbHotel.double_without_view_price || 0,
            double_view_price: dbHotel.double_view_price || 0,
            triple_without_view_price: dbHotel.triple_without_view_price || 0,
            triple_view_price: dbHotel.triple_view_price || 0,
            rating: dbHotel.rating || 5,
            distance_from_center: dbHotel.distance_from_center || 0,
            amenities: dbHotel.amenities || [],
            is_active: dbHotel.is_active !== false,
            // إضافة الحقول المختصرة للتوافق
            single: dbHotel.single_price || 0,
            single_v: dbHotel.single_view_price || 0,
            dbl_wv: dbHotel.double_without_view_price || 0,
            dbl_v: dbHotel.double_view_price || 0,
            trbl_wv: dbHotel.triple_without_view_price || 0,
            trbl_v: dbHotel.triple_view_price || 0
          };

          if (!hotelsByCity[dbHotel.city]) {
            hotelsByCity[dbHotel.city] = [];
          }
          hotelsByCity[dbHotel.city].push(hotel);
        });

        setHotels(hotelsByCity);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطأ في تحميل الفنادق');
        console.error('Error fetching hotels:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  return { hotels, loading, error, refetch: () => fetchHotels() };
};
