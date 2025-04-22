export interface ApartmentObject {
  _id: string;
  name: string;
  address: { street: string; city: string; district: string; division: string };
  description: string;
  rentalPrice: number;
  size: number;
}
