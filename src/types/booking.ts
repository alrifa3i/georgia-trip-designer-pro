
export interface Child {
  age: number;
}

export interface AdditionalServices {
  travelInsurance: {
    enabled: boolean;
    persons: number;
  };
  phoneLines: {
    enabled: boolean;
    quantity: number;
  };
  roomDecoration: {
    enabled: boolean;
  };
  airportReception: {
    enabled: boolean;
    persons: number;
  };
  photoSession: {
    enabled: boolean;
  };
  flowerReception: {
    enabled: boolean;
  };
}

export interface BookingData {
  id?: string;
  referenceNumber?: string;
  customerName: string;
  phoneNumber?: string;
  adults: number;
  children: Child[];
  arrivalDate: string;
  departureDate: string;
  arrivalAirport: string;
  departureAirport: string;
  rooms: number;
  budget: number;
  currency: string;
  roomTypes: string[];
  carType: string;
  selectedCities: string[];
  totalCost: number;
  additionalServices: AdditionalServices;
  discountCoupon?: string;
  discountAmount?: number;
  status?: string;
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  single_price: number;
  single_view_price: number;
  double_without_view_price: number;
  double_view_price: number;
  triple_without_view_price: number;
  triple_view_price: number;
  rating: number;
  distance_from_center: number;
  amenities: string[];
  is_active: boolean;
}

export interface City {
  id: string;
  name: string;
  description: string;
  available_tours: string[];
  tour_prices: Record<string, number>;
  is_active: boolean;
}

export interface Transport {
  id: string;
  type: string;
  daily_price: number;
  capacity: string;
  reception_same_city_price: number;
  reception_different_city_price: number;
  farewell_same_city_price: number;
  farewell_different_city_price: number;
  is_active: boolean;
}

export interface Service {
  id: string;
  name: string;
  type: string;
  price: number;
  unit: string;
  description: string;
  is_active: boolean;
}
