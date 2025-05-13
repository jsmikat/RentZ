"use server";

import bcrypt from "bcryptjs";
import mongoose, { PipelineStage, Types } from "mongoose";
import { z } from "zod";

import { auth, signIn } from "@/auth";
import Apartment from "@/database/apartment.model";
import LeaveRequest from "@/database/leavingRequest.model";
import Payment from "@/database/payment.model";
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
    const apartment = await Apartment.findById(apartmentId)
      .populate({
        path: "requests",
        populate: {
          path: "requesterId",
          model: User,
          select: "_id name phoneNumber",
        },
      })
      .populate({
        path: "allottedTo.userId",
        model: User,
        select: "name phoneNumber email nidNumber",
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
    const requestDoc = await Request.findByIdAndUpdate(
      requestId,
      { isRequesterConfirmed: true },
      { new: true }
    );

    if (!requestDoc) throw new NotFoundError("Request");

    const apartmentDoc = await Apartment.findById(requestDoc.apartmentId);
    if (!apartmentDoc) throw new NotFoundError("Apartment");

    await Request.deleteMany({ _id: { $in: apartmentDoc.requests } });

    await Apartment.findByIdAndUpdate(
      requestDoc.apartmentId,
      {
        $set: {
          allottedTo: {
            userId: requestDoc.requesterId,
            allocatedAt: new Date(),
            paymentHistory: [],
          },
          requests: [],
        },
      },
      { new: true }
    );

    await Request.deleteMany({ requesterId: requestDoc.requesterId });

    await User.findByIdAndUpdate(requestDoc.requesterId, {
      userAllottedTo: requestDoc.apartmentId,
    });

    return { success: true };
  } catch (error) {
    console.error("Error confirming request:", error);
    return { success: false };
  }
}

export async function GetUnpaidMonths(apartmentId: string) {
  await dbConnect();

  const objectId = new Types.ObjectId(apartmentId);

  const pipeline: PipelineStage[] = [
    { $match: { _id: objectId } },

    {
      $project: {
        allottedAt: "$allottedTo.allottedAt",
        paymentIds: "$allottedTo.paymentHistory",
        now: "$$NOW",
      },
    },
    {
      $lookup: {
        from: "payments",
        localField: "paymentIds",
        foreignField: "_id",
        as: "payments",
      },
    },

    {
      $addFields: {
        monthsElapsed: {
          $add: [
            {
              $dateDiff: {
                startDate: "$allottedAt",
                endDate: "$$NOW",
                unit: "month",
              },
            },
            1,
          ],
        },
      },
    },

    {
      $addFields: {
        monthIndices: { $range: [0, "$monthsElapsed"] },
      },
    },

    {
      $addFields: {
        allMonths: {
          $map: {
            input: "$monthIndices",
            as: "i",
            in: {
              $dateToString: {
                format: "%Y-%m",
                date: {
                  $dateAdd: {
                    startDate: "$allottedAt",
                    unit: "month",
                    amount: "$$i",
                  },
                },
              },
            },
          },
        },
        paidMonths: {
          $map: {
            input: "$payments",
            as: "p",
            in: "$$p.monthOf",
          },
        },
      },
    },

    {
      $addFields: {
        unpaidMonths: {
          $filter: {
            input: "$allMonths",
            as: "month",
            cond: { $not: { $in: ["$$month", "$paidMonths"] } },
          },
        },
      },
    },

    {
      $project: {
        _id: 0,
        unpaidMonths: 1,
      },
    },
  ];

  const result = await Apartment.aggregate(pipeline);
  return result[0]?.unpaidMonths || [];
}

export async function GetUserAllottedApartment(userId: string) {
  await dbConnect();
  try {
    const user = await User.findById(userId).populate({
      path: "userAllottedTo",
      model: Apartment,
    });
    if (!user) {
      throw new NotFoundError("User");
    }
    return {
      success: true,
      data: { apartment: JSON.parse(JSON.stringify(user.userAllottedTo)) },
    };
  } catch (error) {
    console.error("Error fetching user allotted apartment:", error);
    return {
      success: false,
    };
  }
}

export async function CreatePayment(
  apartmentId: string,
  userId: string,
  formData: {
    amount: number;
    paymentMethod: string;
    transactionId: string;
    month: string;
  }
) {
  await dbConnect();

  try {
    const newPayment = await Payment.create({
      apartmentId,
      userId,
      amount: formData.amount,
      paymentMethod: formData.paymentMethod,
      transactionId: formData.transactionId,
      monthOf: formData.month,
      status: "pending",
    });

    return { success: true, payment: JSON.parse(JSON.stringify(newPayment)) };
  } catch (error) {
    console.error("Payment creation error:", error);
    return { success: false, error: "Something went wrong" };
  }
}

export async function GetUserPayments(userId: string) {
  await dbConnect();
  try {
    const payments = await Payment.find({ userId })
      .populate({ path: "apartmentId", model: Apartment })
      .populate({ path: "userId", model: User })
      .sort({ paidAt: -1 });

    return {
      success: true,
      data: { payments: JSON.parse(JSON.stringify(payments)) },
    };
  } catch (error) {
    console.error("Error fetching user payments:", error);
    return {
      success: false,
    };
  }
}

export async function GetOwnerPaymentRequests(ownerId: string) {
  await dbConnect();
  try {
    const paymentsByOwner = await Payment.aggregate([
      {
        $lookup: {
          from: "apartments",
          localField: "apartmentId",
          foreignField: "_id",
          as: "apartment",
        },
      },
      { $unwind: "$apartment" },
      {
        $match: {
          "apartment.owner": new Types.ObjectId(ownerId),
          status: "pending",
        },
      },
      {
        $project: {
          userId: 1,
          apartmentId: 1,
          amount: 1,
          paidAt: 1,
          monthOf: 1,
          status: 1,
          transactionId: 1,
          paymentMethod: 1,
        },
      },
    ]);
    return {
      success: true,
      data: { payments: JSON.parse(JSON.stringify(paymentsByOwner)) },
    };
  } catch (error) {
    console.error("Error fetching owner payment requests:", error);
    return {
      success: false,
    };
  }
}

export async function PaymentConfirmation(
  paymentId: string,
  status: "confirmed" | "declined"
) {
  await dbConnect();
  try {
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status },
      { new: true }
    );

    if (!payment) {
      throw new NotFoundError("Payment");
    }

    if (status === "confirmed") {
      await Apartment.updateOne(
        { _id: payment.apartmentId },
        {
          $push: {
            "allottedTo.paymentHistory": payment._id,
          },
        }
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error confirming payment:", error);
    return { success: false };
  }
}

export async function GetPaymentMemoData(paymentId: string) {
  await dbConnect();

  const payment = await Payment.findOne({ _id: paymentId, status: "confirmed" })
    .populate({
      path: "apartmentId",
      populate: {
        path: "owner",
        model: "User",
      },
    })
    .populate("userId");

  if (!payment) return null;

  return {
    user: {
      name: payment.userId.name,
      phoneNumber: payment.userId.phoneNumber,
    },
    apartment: {
      address: payment.apartmentId.address,
      rentalPrice: payment.apartmentId.rentalPrice,
    },
    owner: {
      name: payment.apartmentId.owner.name,
      phoneNumber: payment.apartmentId.owner.phoneNumber,
    },
    payment: {
      amount: payment.amount,
      method: payment.paymentMethod,
      transactionId: payment.transactionId,
      paidAt: payment.paidAt,
      monthOf: payment.monthOf,
      confirmedAt: payment.updatedAt,
    },
  };
}

export async function SubmitLeaveRequest(
  apartmentId: string,
  month: string,
  additionalInfo: string
) {
  await dbConnect();

  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const apartment = await Apartment.findById(apartmentId).populate("owner");
  if (!apartment) throw new Error("Apartment not found");

  await LeaveRequest.create({
    requesterId: session?.user.id,
    apartmentId,
    ownerId: apartment.owner._id,
    from: month,
    additionalInfo,
  });

  return { success: true };
}

export async function GetApartmentId(userId: string) {
  await dbConnect();
  try {
    const user = await User.findById(userId).populate({
      path: "userAllottedTo",
      model: Apartment,
    });
    if (!user) {
      throw new NotFoundError("User");
    }
    return {
      success: true,
      data: {
        apartmentId: JSON.parse(JSON.stringify(user.userAllottedTo._id)),
      },
    };
  } catch (error) {
    console.error("Error fetching user allotted apartment:", error);
    return {
      success: false,
    };
  }
}

export async function GetLeaveRequest(apartmentId: string) {
  await dbConnect();
  try {
    const leaveRequest = await LeaveRequest.find({
      apartmentId,
    });

    return {
      success: true,
      data: { leaveRequest: JSON.parse(JSON.stringify(leaveRequest[0])) },
    };
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    return {
      success: false,
    };
  }
}
