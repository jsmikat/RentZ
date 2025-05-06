import { Schema, Types, model, models } from "mongoose";

export interface IRequest {
  requesterId: Types.ObjectId;
  apartmentId: Types.ObjectId;
  ownerId: Types.ObjectId;
  type: "bachelor" | "family";
  members: number;
  additionalInfo: string;
  requestStatus: "pending" | "accepted" | "rejected";
  isRequesterConfirmed: boolean;
}

export interface IRequestDocument extends IRequest, Document {}

const RequestSchema = new Schema<IRequest>(
  {
    requesterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    apartmentId: {
      type: Schema.Types.ObjectId,
      ref: "Apartment",
      required: true,
    },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["bachelor", "family"], required: true },
    members: { type: Number, required: true },
    additionalInfo: { type: String, required: true },
    requestStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    isRequesterConfirmed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Request = models?.Request || model<IRequest>("Request", RequestSchema);

export default Request;
