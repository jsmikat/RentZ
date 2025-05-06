export interface ApartmentObject {
  _id: string;
  name: string;
  address: { street: string; city: string; area: string };
  description: string;
  rentalPrice: number;
  size: number;
  totalRooms: number;
  bedrooms: number;
  bathrooms: number;
  hasParking: boolean;
  hasElevator: boolean;
  totalFloors: number;
  floor: number;
  owner: string;
}
