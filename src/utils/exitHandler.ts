/* eslint-disable no-console */
import { Server } from "http";
import { disconnectDB } from "../configs/connectDB";

const exitHandler = (server: Server) => {
  let isShutingDown = false;
  const shutdown = async (reason: string) => {
    if (isShutingDown) return;
    isShutingDown = true;
    try {
      console.info(`\n🛑 Shutting down due to: ${reason}`);

      server.close(() => {
        console.info("✅ Server closed gracefully.");
      });

      await disconnectDB();

      process.exit(0);
    } catch (error) {
      console.error("❌ Error during shutdown:", error);
      process.exit(1);
    }
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  process.on("uncaughtException", (err) => {
    console.error(`🔥 Uncaught Exception: ${err}`);
    shutdown("uncaughtException");
  });

  process.on("unhandledRejection", (err) => {
    console.error(`🔥 Unhandled Rejection: ${err}`);
    shutdown("unhandledRejection");
  });
};

export default exitHandler;
