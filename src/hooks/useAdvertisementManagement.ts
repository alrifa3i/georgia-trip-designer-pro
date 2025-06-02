
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Advertisement {
  id: string;
  title: string;
  description?: string;
  price?: string;
  people_range?: string;
  adults?: number;
  children?: number;
  services?: string[];
  type?: string;
  priority?: number;
  status?: string;
  image_url?: string;
  whatsapp_message?: string;
  display_order?: number;
  created_at?: string;
}

export const useAdvertisementManagement = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvertisements = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('priority', { ascending: false })
        .order('display_order', { ascending: true });

      if (error) throw error;

      const processedData = data?.map(ad => ({
        ...ad,
        services: Array.isArray(ad.services) ? ad.services : 
                 typeof ad.services === 'string' ? JSON.parse(ad.services || '[]') : []
      })) || [];

      setAdvertisements(processedData);
    } catch (err) {
      setError('حدث خطأ أثناء تحميل الإعلانات');
      console.error('Error fetching advertisements:', err);
    } finally {
      setLoading(false);
    }
  };

  const createAdvertisement = async (advertisement: Omit<Advertisement, 'id' | 'created_at'>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('advertisements')
        .insert({
          ...advertisement,
          services: JSON.stringify(advertisement.services || [])
        });

      if (error) throw error;

      await fetchAdvertisements(); // إعادة تحميل القائمة
      return true;
    } catch (err) {
      setError('حدث خطأ أثناء إنشاء الإعلان');
      console.error('Error creating advertisement:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateAdvertisement = async (id: string, advertisement: Partial<Advertisement>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const updateData = {
        ...advertisement,
        ...(advertisement.services && { services: JSON.stringify(advertisement.services) })
      };

      const { error } = await supabase
        .from('advertisements')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      await fetchAdvertisements(); // إعادة تحميل القائمة
      return true;
    } catch (err) {
      setError('حدث خطأ أثناء تحديث الإعلان');
      console.error('Error updating advertisement:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAdvertisement = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchAdvertisements(); // إعادة تحميل القائمة
      return true;
    } catch (err) {
      setError('حدث خطأ أثناء حذف الإعلان');
      console.error('Error deleting advertisement:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getActiveAdvertisements = async (): Promise<Advertisement[]> => {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('status', 'active')
        .order('priority', { ascending: false })
        .order('display_order', { ascending: true });

      if (error) throw error;

      return data?.map(ad => ({
        ...ad,
        services: Array.isArray(ad.services) ? ad.services : 
                 typeof ad.services === 'string' ? JSON.parse(ad.services || '[]') : []
      })) || [];
    } catch (err) {
      console.error('Error fetching active advertisements:', err);
      return [];
    }
  };

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  return {
    advertisements,
    loading,
    error,
    fetchAdvertisements,
    createAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
    getActiveAdvertisements
  };
};
