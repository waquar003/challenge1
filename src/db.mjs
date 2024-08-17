import mongoose from "mongoose";

/**
 * Asynchronous function to connect to MongoDB using the Mongoose library.
 * 
 * Attempts to establish a connection to the MongoDB database specified by the MONGODB_URI environment variable.
 * If successful, logs the connection details to the console.
 * 
 * @throws {Error} Throws an error if the MongoDB connection fails.
 */
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/test`)
    console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`) 
  } catch (error) {
    throw new Error("MongoDB connection failed")
  }
}

export default connectDB