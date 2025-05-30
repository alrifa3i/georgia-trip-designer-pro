
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
  roomSelections?: RoomSelection[];
  additionalTours?: number;
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
  flowerReception?: {
    enabled: boolean;
  };
  airportReception: {
    enabled: boolean;
    persons: number;
  };
  photoSession?: {
    enabled: boolean;
  };
}

export interface BookingData {
  customerName: string;
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
  referenceNumber?: string;
}

// Add missing types for data/hotels.ts
export interface Hotel {
  name: string;
  single: number;
  single_v: number;
  dbl_wv: number;
  dbl_v: number;
  trbl_wv: number;
  trbl_v: number;
}

export interface Transport {
  type: string;
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

export interface TourLocation {
  name: string;
  price: number;
}
