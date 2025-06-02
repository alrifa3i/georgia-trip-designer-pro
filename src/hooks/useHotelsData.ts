
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Hotel {
  id: string;
  name: string;
  city: string;
  single_price: number | null;
  single_view_price: number | null;
  double_without_view_price: number | null;
  double_view_price: number | null;
  triple_without_view_price: number | null;
  triple_view_price: number | null;
  rating: number | null;
  distance_from_center: number | null;
  amenities: any;
  is_active: boolean | null;
  created_at: string | null;
}

export const useHotelsData = (cityName?: string) => {
  return useQuery({
    queryKey: ['hotels', cityName],
    queryFn: async (): Promise<Hotel[]> => {
      console.log('جلب بيانات الفنادق من قاعدة البيانات للمدينة:', cityName);
      
      let query = supabase
        .from('hotels')
        .select('*')
        .eq('is_active', true);

      if (cityName) {
        query = query.eq('city', cityName);
      }

      const { data, error } = await query.order('name');

      if (error) {
        console.error('خطأ في جلب بيانات الفنادق:', error);
        throw error;
      }

      console.log('تم جلب الفنادق بنجاح:', data);
      return data || [];
    },
    enabled: !!cityName
  });
};

export const useAllHotelsData = () => {
  return useQuery({
    queryKey: ['all-hotels'],
    queryFn: async (): Promise<Record<string, Hotel[]>> => {
      console.log('جلب جميع بيانات الفنادق من قاعدة البيانات...');
      
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('خطأ في جلب بيانات الفنادق:', error);
        throw error;
      }

      // تجميع الفنادق حسب المدينة
      const hotelsByCity: Record<string, Hotel[]> = {};
      data?.forEach(hotel => {
        if (!hotelsByCity[hotel.city]) {
          hotelsByCity[hotel.city] = [];
        }
        hotelsByCity[hotel.city].push(hotel);
      });

      console.log('تم جلب جميع الفنادق بنجاح:', hotelsByCity);
      return hotelsByCity;
    }
  });
};
