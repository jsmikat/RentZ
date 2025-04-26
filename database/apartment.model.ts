import { Document, Schema, Types, model, models } from "mongoose";

export interface IApartment {
  owner: Types.ObjectId;
  allocatedTo: {
    userId: Types.ObjectId;
    allocatedAt: Date;
  } | null;

  address: {
    street: string;
    area: string;
    city: string;
  };

  rentalPrice: number;
  size: number;
  description: string;
  totalRooms: number;
  bedrooms: number;
  bathrooms: number;
  hasParking?: boolean;
  hasElevator?: boolean;
  totalFloors: number;
  floor: number;
}

export interface IApartmentDocument extends IApartment, Document {}

const ApartmentSchema = new Schema<IApartment>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    allocatedTo: {
      type: {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        allocatedAt: { type: Date, default: Date.now },
      },
      default: null,
    },
    address: {
      street: { type: String, required: true },
      area: { type: String, required: true },
      city: { type: String, required: true },
    },
    rentalPrice: { type: Number, required: true },
    size: { type: Number, required: true },
    hasParking: { type: Boolean, default: false },
    hasElevator: { type: Boolean, default: false },
    description: { type: String, required: true },
    totalRooms: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    totalFloors: { type: Number, required: true },
    floor: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Apartment =
  models?.Apartment || model<IApartment>("Apartment", ApartmentSchema);

export default Apartment;
