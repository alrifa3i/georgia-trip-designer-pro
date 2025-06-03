
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

// Default cities data in case database is empty or has issues
const defaultCities = [
  { id: '1', name: 'تبليسي', description: null, is_active: true, available_tours: [], tour_prices: {}, created_at: null },
  { id: '2', name: 'كاخيتي', description: null, is_active: true, available_tours: [], tour_prices: {}, created_at: null },
  { id: '3', name: 'داش باش', description: null, is_active: true, available_tours: [], tour_prices: {}, created_at: null },
  { id: '4', name: 'كوداوري', description: null, is_active: true, available_tours: [], tour_prices: {}, created_at: null },
  { id: '5', name: 'برجومي', description: null, is_active: true, available_tours: [], tour_prices: {}, created_at: null },
  { id: '6', name: 'باكورياني', description: null, is_active: true, available_tours: [], tour_prices: {}, created_at: null },
  { id: '7', name: 'باتومي', description: null, is_active: true, available_tours: [], tour_prices: {}, created_at: null },
  { id: '8', name: 'كوتايسي', description: null, is_active: true, available_tours: [], tour_prices: {}, created_at: null }
];

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
          console.log('استخدام البيانات الافتراضية للمدن');
          return defaultCities;
        }

        // If database has data, use it, otherwise use default cities
        if (data && data.length > 0) {
          console.log('تم جلب المدن بنجاح من قاعدة البيانات:', data);
          
          // Ensure all 8 cities are present, add missing ones
          const existingCityNames = data.map(city => city.name);
          const allCityNames = defaultCities.map(city => city.name);
          const missingCities = defaultCities.filter(city => !existingCityNames.includes(city.name));
          
          return [...data, ...missingCities];
        } else {
          console.log('قاعدة البيانات فارغة، استخدام البيانات الافتراضية');
          return defaultCities;
        }
      } catch (error) {
        console.error('خطأ في الاتصال بقاعدة البيانات:', error);
        console.log('استخدام البيانات الافتراضية للمدن');
        return defaultCities;
      }
    }
  });
};
