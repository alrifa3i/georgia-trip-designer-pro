
import { useState } from 'react';

interface BookingSearchResult {
  success: boolean;
  data?: any;
  error?: string;
}

export const useBookings = () => {
  const [loading, setLoading] = useState(false);

  const searchBooking = async (referenceNumber: string): Promise<BookingSearchResult> => {
    setLoading(true);
    
    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response - you can integrate with Supabase later
      if (referenceNumber === 'GEO-2024-001') {
        return {
          success: true,
          data: {
            reference_number: referenceNumber,
            customer_name: 'أحمد محمد',
            phone_number: '+966501234567',
            arrival_date: '2024-06-15',
            departure_date: '2024-06-22',
            adults: 2,
            children: [],
            total_cost: 1500,
            currency: 'USD',
            status: 'confirmed',
            selected_cities: [
              { city: 'تبليسي', nights: 3 },
              { city: 'باتومي', nights: 4 }
            ]
          }
        };
      }
      
      return {
        success: false,
        error: 'Booking not found'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Search failed'
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    searchBooking,
    loading
  };
};
