/* eslint-disable no-console */
import { connectDB } from "../configs/connectDB";
import superAdmin from "./superAdmin";
import systemWallet from "./systemWallet";

const runSeeds = async () => {
  try {
    await connectDB();

    await superAdmin();
    await systemWallet();
  
    process.exit(0);
  } catch (error) {
    console.log("❌ Failed to run seeds:", error);
    process.exit(1);
  }
};

(async () => {
  await runSeeds();
})();
