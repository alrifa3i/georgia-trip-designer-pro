
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Transport {
  id: string;
  type: string;
  daily_price: number;
  capacity: string | null;
  reception_same_city_price: number | null;
  reception_different_city_price: number | null;
  farewell_same_city_price: number | null;
  farewell_different_city_price: number | null;
  is_active: boolean | null;
  created_at: string | null;
}

export const useTransportData = () => {
  return useQuery({
    queryKey: ['transport'],
    queryFn: async (): Promise<Transport[]> => {
      console.log('جلب بيانات النقل من قاعدة البيانات...');
      
      try {
        const { data, error } = await supabase
          .from('transport')
          .select('*')
          .eq('is_active', true)
          .order('daily_price');

        if (error) {
          console.error('خطأ في جلب بيانات النقل:', error);
          throw new Error(`فشل في جلب بيانات النقل: ${error.message}`);
        }

        console.log('تم جلب بيانات النقل بنجاح:', data);
        return data || [];
      } catch (error) {
        console.error('خطأ عام في جلب بيانات النقل:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
