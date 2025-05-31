
export interface Child {
  age: number;
}

export interface RoomSelection {
  roomNumber: number;
  roomType: string;
}

export interface CityStay {
  city: string;
  nights: number;
  hotel: string;
  tours: number;
  mandatoryTours: number;
  roomType?: string;
  roomSelections?: RoomSelection[];
  availableTours?: string[];
}

export interface TourLocation {
  name: string;
  description?: string;
  mandatoryTours: {
    fromTbilisi: number;
    fromBatumi: number;
    fromKutaisi: number;
    toTbilisi: number;
    toBatumi: number;
    toKutaisi: number;
  };
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
  selectedCities: CityStay[];
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
  // إضافة الخصائص المطلوبة للتوافق مع الكود الموجود
  single?: number;
  single_v?: number;
  dbl_wv?: number;
  dbl_v?: number;
  trbl_wv?: number;
  trbl_v?: number;
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
  // Add compatibility properties
  price: number;
  reception: {
    sameCity: number;
    differentCity: number;
  };
  farewell: {
    sameCity: number;
    differentCity: number;
  };
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

export interface Currency {
  code: string;
  name: string;
  nameAr: string;
  symbol: string;
  rate: number;
  exchangeRate: number;
}

export interface Airport {
  code: string;
  name: string;
  nameAr: string;
  city: string;
}

export interface AdditionalServiceData {
  travelInsurance: {
    pricePerPersonPerDay: number;
    pricePerPerson: number;
    nameAr: string;
  };
  phoneLines: {
    pricePerLine: number;
    nameAr: string;
  };
  roomDecoration: {
    price: number;
    nameAr: string;
  };
  airportReception: {
    pricePerPerson: number;
    nameAr: string;
  };
}
