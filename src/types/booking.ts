
export interface BookingData {
  customerName: string;
  adults: number;
  children: Child[];
  arrivalDate: string;
  departureDate: string;
  rooms: number;
  budget: number;
  currency: string;
  airport: string;
  roomTypes: string[];
  carType: string;
  selectedCities: CityStay[];
  totalCost: number;
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
}

export interface Transport {
  type: string;
  price: number;
}
