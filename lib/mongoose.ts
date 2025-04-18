import mongoose, { Mongoose } from "mongoose";

// import "@/database";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

interface MongooseCache {
  connection: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { connection: null, promise: null };
}

// const dbConnect = async (): Promise<Mongoose> => {
async function dbConnect() {
  if (cached.connection) {
    console.log("Using existing mongoose connection");
    return cached.connection;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "Auth",
      })
      .then((result) => {
        console.log("Connected to MongoDB");
        return result;
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB", error);
        throw error;
      });
  }

  cached.connection = await cached.promise;

  return cached.connection;
}

export default dbConnect;
