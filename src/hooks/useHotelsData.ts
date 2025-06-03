
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Hotel {
  id: string;
  name: string;
  city: string;
  rating: number;
  single_price: number | null;
  single_view_price: number | null;
  double_without_view_price: number | null;
  double_view_price: number | null;
  triple_without_view_price: number | null;
  triple_view_price: number | null;
  amenities: any;
  distance_from_center: number | null;
  is_active: boolean | null;
  created_at: string | null;
}

// Default hotels data for all cities
const defaultHotelsData: {[key: string]: Hotel[]} = {
  'تبليسي': [
    { id: '1', name: 'فندق تبليسي الكبير', city: 'تبليسي', rating: 5, single_price: 100, single_view_price: 120, double_without_view_price: 150, double_view_price: 180, triple_without_view_price: 200, triple_view_price: 230, amenities: [], distance_from_center: 1, is_active: true, created_at: null },
    { id: '2', name: 'فندق رمادا تبليسي', city: 'تبليسي', rating: 4, single_price: 80, single_view_price: 100, double_without_view_price: 120, double_view_price: 140, triple_without_view_price: 160, triple_view_price: 180, amenities: [], distance_from_center: 2, is_active: true, created_at: null },
    { id: '3', name: 'فندق كورت يارد تبليسي', city: 'تبليسي', rating: 4, single_price: 90, single_view_price: 110, double_without_view_price: 130, double_view_price: 150, triple_without_view_price: 170, triple_view_price: 190, amenities: [], distance_from_center: 1.5, is_active: true, created_at: null }
  ],
  'كاخيتي': [
    { id: '4', name: 'فندق كاخيتي مانور', city: 'كاخيتي', rating: 4, single_price: 70, single_view_price: 90, double_without_view_price: 100, double_view_price: 120, triple_without_view_price: 140, triple_view_price: 160, amenities: [], distance_from_center: 0.5, is_active: true, created_at: null },
    { id: '5', name: 'فندق وينري كاخيتي', city: 'كاخيتي', rating: 3, single_price: 60, single_view_price: 75, double_without_view_price: 90, double_view_price: 105, triple_without_view_price: 120, triple_view_price: 135, amenities: [], distance_from_center: 1, is_active: true, created_at: null }
  ],
  'داش باش': [
    { id: '6', name: 'فندق داش باش ريزورت', city: 'داش باش', rating: 3, single_price: 50, single_view_price: 65, double_without_view_price: 80, double_view_price: 95, triple_without_view_price: 110, triple_view_price: 125, amenities: [], distance_from_center: 2, is_active: true, created_at: null }
  ],
  'كوداوري': [
    { id: '7', name: 'فندق كوداوري إن', city: 'كوداوري', rating: 4, single_price: 80, single_view_price: 100, double_without_view_price: 120, double_view_price: 140, triple_without_view_price: 160, triple_view_price: 180, amenities: [], distance_from_center: 1, is_active: true, created_at: null },
    { id: '8', name: 'فندق ماركو بولو كوداوري', city: 'كوداوري', rating: 5, single_price: 120, single_view_price: 150, double_without_view_price: 180, double_view_price: 210, triple_without_view_price: 240, triple_view_price: 270, amenities: [], distance_from_center: 0.5, is_active: true, created_at: null },
    { id: '9', name: 'فندق كوداوري لودج', city: 'كوداوري', rating: 3, single_price: 60, single_view_price: 80, double_without_view_price: 100, double_view_price: 120, triple_without_view_price: 140, triple_view_price: 160, amenities: [], distance_from_center: 2, is_active: true, created_at: null }
  ],
  'برجومي': [
    { id: '10', name: 'فندق كراون بلازا برجومي', city: 'برجومي', rating: 5, single_price: 110, single_view_price: 130, double_without_view_price: 160, double_view_price: 180, triple_without_view_price: 200, triple_view_price: 220, amenities: [], distance_from_center: 1, is_active: true, created_at: null },
    { id: '11', name: 'فندق برجومي سبا', city: 'برجومي', rating: 4, single_price: 85, single_view_price: 105, double_without_view_price: 125, double_view_price: 145, triple_without_view_price: 165, triple_view_price: 185, amenities: [], distance_from_center: 1.5, is_active: true, created_at: null },
    { id: '12', name: 'فندق برجومي بالاس', city: 'برجومي', rating: 3, single_price: 65, single_view_price: 80, double_without_view_price: 95, double_view_price: 110, triple_without_view_price: 125, triple_view_price: 140, amenities: [], distance_from_center: 2, is_active: true, created_at: null }
  ],
  'باكورياني': [
    { id: '13', name: 'فندق باكورياني ريزورت', city: 'باكورياني', rating: 4, single_price: 75, single_view_price: 95, double_without_view_price: 115, double_view_price: 135, triple_without_view_price: 155, triple_view_price: 175, amenities: [], distance_from_center: 1, is_active: true, created_at: null },
    { id: '14', name: 'فندق لوكس باكورياني', city: 'باكورياني', rating: 5, single_price: 100, single_view_price: 125, double_without_view_price: 150, double_view_price: 175, triple_without_view_price: 200, triple_view_price: 225, amenities: [], distance_from_center: 0.5, is_active: true, created_at: null },
    { id: '15', name: 'فندق باكورياني لودج', city: 'باكورياني', rating: 3, single_price: 55, single_view_price: 70, double_without_view_price: 85, double_view_price: 100, triple_without_view_price: 115, triple_view_price: 130, amenities: [], distance_from_center: 2, is_active: true, created_at: null }
  ],
  'باتومي': [
    { id: '16', name: 'فندق شيراتون باتومي', city: 'باتومي', rating: 5, single_price: 120, single_view_price: 150, double_without_view_price: 180, double_view_price: 210, triple_without_view_price: 240, triple_view_price: 270, amenities: [], distance_from_center: 0.5, is_active: true, created_at: null },
    { id: '17', name: 'فندق هيلتون باتومي', city: 'باتومي', rating: 5, single_price: 110, single_view_price: 140, double_without_view_price: 170, double_view_price: 200, triple_without_view_price: 230, triple_view_price: 260, amenities: [], distance_from_center: 1, is_active: true, created_at: null },
    { id: '18', name: 'فندق رمادا باتومي', city: 'باتومي', rating: 4, single_price: 85, single_view_price: 105, double_without_view_price: 125, double_view_price: 145, triple_without_view_price: 165, triple_view_price: 185, amenities: [], distance_from_center: 1.5, is_active: true, created_at: null }
  ],
  'كوتايسي': [
    { id: '19', name: 'فندق كوتايسي إنترناشيونال', city: 'كوتايسي', rating: 4, single_price: 70, single_view_price: 85, double_without_view_price: 100, double_view_price: 115, triple_without_view_price: 130, triple_view_price: 145, amenities: [], distance_from_center: 1, is_active: true, created_at: null },
    { id: '20', name: 'فندق كوتايسي سيتي', city: 'كوتايسي', rating: 3, single_price: 50, single_view_price: 65, double_without_view_price: 80, double_view_price: 95, triple_without_view_price: 110, triple_view_price: 125, amenities: [], distance_from_center: 2, is_active: true, created_at: null }
  ]
};

export const useAllHotelsData = () => {
  return useQuery({
    queryKey: ['all-hotels'],
    queryFn: async (): Promise<{[key: string]: Hotel[]}> => {
      console.log('جلب بيانات الفنادق من قاعدة البيانات...');
      
      try {
        const { data, error } = await supabase
          .from('hotels')
          .select('*')
          .eq('is_active', true)
          .order('city, name');

        if (error) {
          console.error('خطأ في جلب بيانات الفنادق:', error);
          console.log('استخدام البيانات الافتراضية للفنادق');
          return defaultHotelsData;
        }

        if (data && data.length > 0) {
          console.log('تم جلب الفنادق بنجاح من قاعدة البيانات:', data);
          
          // Group hotels by city
          const groupedHotels: {[key: string]: Hotel[]} = {};
          data.forEach(hotel => {
            if (!groupedHotels[hotel.city]) {
              groupedHotels[hotel.city] = [];
            }
            groupedHotels[hotel.city].push(hotel);
          });

          // Merge with default data for cities that don't have hotels in database
          const result = { ...defaultHotelsData };
          Object.keys(groupedHotels).forEach(city => {
            result[city] = groupedHotels[city];
          });

          return result;
        } else {
          console.log('قاعدة البيانات فارغة، استخدام البيانات الافتراضية');
          return defaultHotelsData;
        }
      } catch (error) {
        console.error('خطأ في الاتصال بقاعدة البيانات:', error);
        console.log('استخدام البيانات الافتراضية للفنادق');
        return defaultHotelsData;
      }
    }
  });
};
