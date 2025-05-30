
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
}

export interface Child {
  age: number;
}

export interface CityStay {
  city: string;
  nights: number;
  hotel: string;
  tours: number;
}

export interface Hotel {
  name: string;
  dbl_v: number;
  trbl_v: number;
  dbl_wv: number;
  trbl_wv: number;
  rating?: number;
  distanceFromCenter?: number;
}

export interface Transport {
  type: string;
  price: number; // Tour price per day
  capacity: string;
  reception: {
    sameCity: number;
    differentCity: number;
  };
  farewell: {
    sameCity: number;
    differentCity: number;
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
}
