/* eslint-disable no-console */
import mongoose from "mongoose";
import { envConfig } from "./envConfig";

export const connectDB = async () => {
  try {
    await mongoose.connect(envConfig.DATABASE.URI, {
      dbName: envConfig.DATABASE.NAME,
    });
    console.log("✅ Database connected successfully.");
  } catch (error) {
    console.log(`❌ Failed to connect database:`, error);
    process.exit(1);
  }
};

export const disconnectDB = () => {
  try {
    mongoose.disconnect();
    console.log("✅ Database disconnected successfully.");
  } catch (error) {
    console.log(`❌ Failed to disconnect database:`, error);
    process.exit(1);
  }
};
