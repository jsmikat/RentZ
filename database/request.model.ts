import { Schema, Types, model, models } from "mongoose";

export interface IRequest {
  userId: Types.ObjectId;
  apartmentId: Types.ObjectId;
  ownerId: Types.ObjectId;
  tenancyType: "bachelor" | "family";
  message: string;
  status: "pending" | "accepted" | "rejected";
  userConfirmation: boolean;
  ownerConfirmation: boolean;
}

export interface IRequestDocument extends IRequest, Document {}

const RequestSchema = new Schema<IRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    apartmentId: {
      type: Schema.Types.ObjectId,
      ref: "Apartment",
      required: true,
    },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tenancyType: { type: String, enum: ["bachelor", "family"], required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    userConfirmation: { type: Boolean, default: false },
    ownerConfirmation: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Request = models?.Request || model<IRequest>("Request", RequestSchema);
