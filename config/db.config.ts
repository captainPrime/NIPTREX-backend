import mongoose, { ConnectOptions } from "mongoose";

const connectDB = async () => {
  mongoose.set("strictQuery", false);

  const conn = await mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost/auth",
    {
      retryWrites: true,
      w: "majority",
    } as ConnectOptions
  );

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

export default connectDB;
