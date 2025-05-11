import { Schema, Types, model, models } from "mongoose";

interface IPayment {
  userId: Types.ObjectId;
  apartmentId: Types.ObjectId;
  amount: number;
  paidAt: Date;
  monthOf: string;
  status: "pending" | "confirmed" | "declined";
  transactionId: string;
  paymentMethod: "bkash" | "nagad" | "rocket" | "bankTransfer";
}

export interface IPaymentDocument extends IPayment, Document {}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    apartmentId: {
      type: Schema.Types.ObjectId,
      ref: "Apartment",
      required: true,
    },
    amount: { type: Number, required: true },
    paidAt: { type: Date, default: Date.now },
    monthOf: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "declined"],
      default: "pending",
    },
    transactionId: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ["bkash", "nagad", "rocket", "bankTransfer"],
      required: true,
    },
  },
  { timestamps: true }
);

const Payment = models?.Payment || model<IPayment>("Payment", PaymentSchema);
export default Payment;
