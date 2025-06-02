
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
      
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('خطأ في جلب بيانات المدن:', error);
        throw error;
      }

      console.log('تم جلب المدن بنجاح:', data);
      return data || [];
    }
  });
};
