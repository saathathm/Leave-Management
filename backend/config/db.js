import mongoose from "mongoose";

const connectDb = async () => {
  mongoose.set("strictQuery", false);

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB is connected to the host: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error connecting to the database: ${err.message}`);
  }
};

export default connectDb;
