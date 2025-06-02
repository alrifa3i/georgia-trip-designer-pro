
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface City {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean | null;
  available_tours: any;
  tour_prices: any;
  created_at: string | null;
}

export const useCitiesData = () => {
  return useQuery({
    queryKey: ['cities'],
    queryFn: async (): Promise<City[]> => {
      console.log('جلب بيانات المدن من قاعدة البيانات...');
      
      try {
        const { data, error } = await supabase
          .from('cities')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (error) {
          console.error('خطأ في جلب بيانات المدن:', error);
          throw new Error(`فشل في جلب المدن: ${error.message}`);
        }

        console.log('تم جلب المدن بنجاح:', data);
        return data || [];
      } catch (error) {
        console.error('خطأ عام في جلب المدن:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
