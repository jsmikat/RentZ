import { Document, Schema, model, models } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  phoneNumber: string;
  nidNumber: string;
  password: string;
  role: "user" | "owner";
}

export interface IUserDocument extends Document, IUser {}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    nidNumber: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const User = models?.User || model<IUser>("User", UserSchema);

export default User;
