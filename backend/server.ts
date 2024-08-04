import mongoose from "mongoose";
import app from "./app";

process.on("uncaughtException", (err: Error) => {
  console.log(err.name, err.message);
  console.log("uncaught exception occurred: Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});

const port = process.env.PORT;
const mongodbConStr = process.env.MONGODB_CONNECTION || "localhost:8080";

mongoose.connect(mongodbConStr).then((con) => {
  console.log("db connection successful!");
});

const server = app.listen(port, () => {
  console.log("server has started!");
});

process.on("unhandledRejection", (err: Error) => {
  console.log(err.name, err.message);
  console.log("unhandled promise rejection occurred: Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
