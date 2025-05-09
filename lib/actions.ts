"use server";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { z } from "zod";

import { auth, signIn } from "@/auth";
import Apartment from "@/database/apartment.model";
import Request from "@/database/request.model";
import User from "@/database/user.model";
import {
  ApartmentFormSchema,
  SignInFormSchema,
  SignupFormSchema,
} from "@/lib/validations";

import { NotFoundError, UnauthorizedError } from "./http-errors";
import dbConnect from "./mongoose";

type SignUpParams = z.infer<typeof SignupFormSchema>;
type SignInParama = z.infer<typeof SignInFormSchema>;
type ApartmentParams = z.infer<typeof ApartmentFormSchema>;

export async function SignUp(params: SignUpParams) {
  const parsedData = SignupFormSchema.safeParse(params);
  if (!parsedData.success) {
    throw new Error("Invalid data provided");
  }
  const { name, email, password, phone, nidNumber, role } = parsedData.data;

  await dbConnect();

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

  await dbConnect();

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
  const parsedData = ApartmentFormSchema.safeParse(params);

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
    await dbConnect();
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
      // requests: [],
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
  await dbConnect();
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
  await dbConnect();
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
    const filter = { allottedTo: null, ...searchQuery }; // Sort by rental price in ascending order

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

export async function SendRequest(Params: {
  apartmentId: string;
  type: string;
  additionalInfo: string;
  requesterId: string;
  owner: string;
  members: number;
}) {
  const { apartmentId, type, additionalInfo, requesterId, owner, members } =
    Params;

  await dbConnect();

  const session = await auth();
  if (!session) {
    throw new UnauthorizedError("Unauthenticated User");
  }

  try {
    const newReq = await Request.create([
      {
        apartmentId,
        ownerId: owner,
        requesterId,
        type,
        members,
        additionalInfo,
      },
    ]);

    await Apartment.findByIdAndUpdate(apartmentId, {
      $push: { requests: newReq[0]._id },
    });
    return { success: true };
  } catch (err: any) {
    console.error("Error during request creation:", err);
    return { success: false, error: err.message || "SendRequest failed" };
  }
}

export async function GetUserRequests(userId: string) {
  await dbConnect();
  try {
    const requests = await Request.find({ requesterId: userId })
      .populate({
        path: "apartmentId",
        model: Apartment,
      })
      .populate({
        path: "requesterId",
        model: User,
      })
      .populate({
        path: "ownerId",
        model: User,
      });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(requests)),
    };
  } catch (error) {
    console.error("Error fetching sent requests:", error);
    return {
      success: false,
    };
  }
}

export async function GetUserRequest(requestId: string) {
  await dbConnect();
  try {
    const request = await Request.findById(requestId)
      .populate({
        path: "apartmentId",
        model: Apartment,
      })
      .populate({
        path: "ownerId",
        model: User,
        select: "name phoneNumber",
      });

    if (!request) {
      throw new NotFoundError("Request");
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(request)),
    };
  } catch (error) {
    console.error("Error fetching request:", error);
    return {
      success: false,
    };
  }
}

export async function GetApartment(apartmentId: string) {
  await dbConnect();
  try {
    const apartment = await Apartment.findById(apartmentId).populate({
      path: "requests",
      populate: {
        path: "requesterId",
        model: User,
        select: "_id name phoneNumber",
      },
    });

    return {
      success: true,
      data: { apartment: JSON.parse(JSON.stringify(apartment)) },
    };
  } catch (error) {
    console.error("Error fetching apartment:", error);
    return {
      success: false,
    };
  }
}

export async function DeleteApartment(apartmentId: string) {
  await dbConnect();
  try {
    const apartment = await Apartment.findById(apartmentId);
    if (!apartment) {
      throw new NotFoundError("Apartment");
    }
    await Apartment.findByIdAndDelete(apartmentId);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting apartment:", error);
    return {
      success: false,
    };
  }
}

export async function EditApartment(
  apartmentId: string,
  params: ApartmentParams
) {
  const parsedData = ApartmentFormSchema.safeParse(params);

  if (!parsedData.success) {
    throw new Error("Invalid data provided");
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

  await dbConnect();
  try {
    await Apartment.findByIdAndUpdate(apartmentId, {
      address: { street, city, area },
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
    console.error("Error during apartment update:", error);
    return {
      success: false,
    };
  }
}

export async function GetOwnerRequestedApartments(userId: string) {
  await dbConnect();
  try {
    const requests = await Apartment.find({
      owner: userId,
      requests: { $exists: true, $ne: [] },
    }).populate({ path: "requests", model: Request });
    return {
      success: true,
      data: { requests: JSON.parse(JSON.stringify(requests)) },
    };
  } catch (error) {
    console.error("Error fetching requested apartments:", error);
    return {
      success: false,
    };
  }
}

export async function GetApartmentRequests(apartmentId: string) {
  await dbConnect();
  try {
    const apartment = await Apartment.findById(apartmentId).populate({
      path: "requests",
      model: Request,
    });
    if (!apartment) {
      throw new NotFoundError("Apartment");
    }
    return {
      success: true,
      data: { requests: JSON.parse(JSON.stringify(apartment.requests)) },
    };
  } catch (error) {
    console.error("Error fetching apartment requests:", error);
    return {
      success: false,
    };
  }
}

export async function AcceptRequest(requestId: string) {
  await dbConnect();
  try {
    const request = await Request.findByIdAndUpdate(requestId, {
      requestStatus: "accepted",
    });
    if (!request) {
      throw new NotFoundError("Request");
    }
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error accepting request:", error);
    return {
      success: false,
    };
  }
}

export async function RejectRequest(requestId: string) {
  await dbConnect();
  try {
    const requestDoc = await Request.findByIdAndUpdate(requestId, {
      requestStatus: "rejected",
    });
    if (!requestDoc) {
      throw new NotFoundError("Request");
    }
    // await Apartment.findByIdAndUpdate(requestDoc.apartmentId, {
    //   $pull: { requests: { _id: requestId } },
    // });
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error rejecting request:", error);
    return {
      success: false,
    };
  }
}

export async function ConfirmRequest(requestId: string) {
  await dbConnect();
  try {
    const requestDoc = await Request.findByIdAndUpdate(requestId, {
      isRequesterConfirmed: true,
    });
    if (!requestDoc) {
      throw new NotFoundError("Request");
    }
  } catch (error) {
    console.error("Error confirming request:", error);
    return {
      success: false,
    };
  }
}
