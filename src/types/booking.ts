
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
}
