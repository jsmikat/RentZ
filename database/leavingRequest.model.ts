import { Schema, Types, model, models } from "mongoose";

export interface ILeaveRequest {
  requesterId: Types.ObjectId;
  apartmentId: Types.ObjectId;
  ownerId: Types.ObjectId;
  from: string;
  additionalInfo: string;
  status: "pending" | "accepted" | "rejected";
}

export interface ILeaveRequestDocument extends ILeaveRequest, Document {}

const LeaveRequestSchema = new Schema<ILeaveRequest>(
  {
    requesterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    apartmentId: {
      type: Schema.Types.ObjectId,
      ref: "Apartment",
      required: true,
    },
    from: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    additionalInfo: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const LeaveRequest =
  models?.LeaveRequest ||
  model<ILeaveRequest>("LeaveRequest", LeaveRequestSchema);

export default LeaveRequest;
