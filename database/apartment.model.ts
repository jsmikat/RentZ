import { Document, Schema, Types, model, models } from "mongoose";

export interface IApartment {
  owner: Types.ObjectId;
  allottedTo: {
    userId: Types.ObjectId;
    allottedAt: Date;
    // paymentHistory:
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
  requests?: Types.ObjectId[];
}

export interface IApartmentDocument extends IApartment, Document {}

const ApartmentSchema = new Schema<IApartment>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    allottedTo: {
      type: {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        allottedAt: { type: Date, default: Date.now },
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
    requests: {
      type: [{ type: Schema.Types.ObjectId, ref: "Request" }],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Apartment =
  models?.Apartment || model<IApartment>("Apartment", ApartmentSchema);

export default Apartment;
