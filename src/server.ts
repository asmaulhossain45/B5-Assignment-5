/* eslint-disable no-console */
import app from "./app";
import { Server } from "http";
import exitHandler from "./utils/exitHandler";
import { connectDB } from "./configs/connectDB";
import { envConfig } from "./configs/envConfig";

let server: Server;
const start = async () => {
  try {
    await connectDB();

    server = app.listen(envConfig.PORT, () => {
      console.log(`🚀 Server is running on port: ${envConfig.PORT}`);
    });

    exitHandler(server);
  } catch (error) {
    console.error(`❌ Failed to start server:`, error);
  }
};

(async () => {
  await start();
})();
