"use server";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { z } from "zod";

import { auth, signIn } from "@/auth";
import Apartment from "@/database/apartment.model";
import User from "@/database/user.model";
import {
  CreateApartmentFormSchema,
  SignInFormSchema,
  SignupFormSchema,
} from "@/lib/validations";

import { NotFoundError, UnauthorizedError } from "./http-errors";
import dbConnect from "./mongoose";

type SignUpParams = z.infer<typeof SignupFormSchema>;
type SignInParama = z.infer<typeof SignInFormSchema>;
type ApartmentParams = z.infer<typeof CreateApartmentFormSchema>;

export async function SignUp(params: SignUpParams) {
  const parsedData = SignupFormSchema.safeParse(params);
  if (!parsedData.success) {
    throw new Error("Invalid data provided");
  }
  const { name, email, password, phone, nidNumber, role } = parsedData.data;

  dbConnect();

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
          phoneNumber: phone,
          nidNumber,
          role,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    await signIn("credentials", {
      email,
      password,
      role,
      redirect: false,
    });

    return {
      success: true,
    };
  } catch (error) {
    // await session.abortTransaction();
    console.error("Error during sign up:", error);
    return {
      success: false,
      error: "Sign up failed",
    };
  } finally {
    session.endSession();
  }
}

export async function SignIn(params: SignInParama) {
  const parsedData = SignInFormSchema.safeParse(params);
  if (!parsedData.success) {
    throw new Error("Invalid data provided");
  }
  const { email, password } = parsedData.data;

  dbConnect();

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new NotFoundError("User");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid password");
    }

    await signIn("credentials", {
      email,
      password,
      role: existingUser.role,
      redirect: false,
    });

    return {
      success: true,
    };
  } catch (error: Error | any) {
    switch (error.name) {
      case "NotFoundError":
        return {
          success: false,
          error: "User not found",
        };
      case "UnauthorizedError":
        return {
          success: false,
          error: "Invalid password",
        };
      default:
        console.error("Error during sign in:", error);
        return {
          success: false,
          error: "Sign in failed",
        };
    }
  }
}

export async function CreateApartment(params: ApartmentParams) {
  const parsedData = CreateApartmentFormSchema.safeParse(params);

  const session = await auth();

  if (!parsedData.success) {
    throw new Error("Invalid data provided");
  }

  if (!session) {
    throw new UnauthorizedError("Unauthenticated User");
  }

  if (session?.user.role !== "owner") {
    throw new UnauthorizedError("Unauthorized Access Request");
  }

  const {
    street,
    city,
    rentalPrice,
    size,
    totalRooms,
    bedrooms,
    bathrooms,
    hasParking,
    hasElevator,
    area,
    totalFloors,
    floor,
    description,
  } = parsedData.data;

  try {
    dbConnect();
    await Apartment.create({
      owner: session?.user.id,
      address: {
        street,
        city,
        area,
      },
      rentalPrice,
      size,
      description,
      totalRooms,
      bedrooms,
      bathrooms,
      hasParking,
      hasElevator,
      totalFloors,
      floor,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error during database connection:", error);
    return {
      success: false,
    };
  }
}

export async function GetOwnedApartments(userId: string) {
  dbConnect();
  try {
    const apartments = await Apartment.find({ owner: userId });
    return {
      success: true,
      data: { apartments: JSON.parse(JSON.stringify(apartments)) },
    };
  } catch (error) {
    console.error("Error fetching owned apartments:", error);
    return {
      success: false,
    };
  }
}

export async function GetAvailableApartments(query?: string) {
  dbConnect();
  try {
    const searchQuery = query
      ? {
          $or: [
            { "address.street": { $regex: query, $options: "i" } },
            { "address.city": { $regex: query, $options: "i" } },
            { "address.area": { $regex: query, $options: "i" } },
          ],
        }
      : {};
    const filter = { allocatedTo: null, ...searchQuery }; // Sort by rental price in ascending order

    const apartments = await Apartment.find(filter);
    return {
      success: true,
      data: { apartments: JSON.parse(JSON.stringify(apartments)) },
    };
  } catch (error) {
    console.error("Error fetching available apartments:", error);
    return {
      success: false,
    };
  }
}

export async function SendRequest(params: {
  apartmentId: string;
  tenancyType: string;
  message: string;
}) {
  return;
}
