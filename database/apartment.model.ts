import { Document, Schema, Types, model, models } from "mongoose";

export interface IApartment {
  owner: Types.ObjectId;
  allocatedTo: {
    userId: Types.ObjectId;
    allocatedAt: Date;
  } | null;
  address: {
    street: string;
    city: string;
    district: string;
    division: string;
  };
  rentalPrice: number;
  size: number;
  description: string;
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
      city: { type: String, required: true },
      district: { type: String, required: true },
      division: { type: String, required: true },
    },
    rentalPrice: { type: Number, required: true },
    size: { type: Number, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Apartment =
  models?.Apartment || model<IApartment>("Apartment", ApartmentSchema);

export default Apartment;
