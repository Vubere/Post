import mongoose from "mongoose";
import app from "./app";
import { Server } from "socket.io";
import CustomError from "./lib/utils/custom-error";
import { STATUS_CODES } from "./lib/utils";
import { socketManager } from "./controllers/chat";

process.on("uncaughtException", (err: Error) => {
  console.log(err.name, err.message);
  console.log("uncaught exception occurred: Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});

const port = Number(process.env.PORT || 3000);
const mongodbConStr = process.env.MONGODB_CONNECTION || "localhost:8080";

mongoose.connect(mongodbConStr).then((con) => {
  console.log("db connection successful!");
});

const server = app.listen(port, () => {
  console.log(`server is running on ${port}!`);
});
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", socketManager);

app.all("*", (...args) => {
  const [req, , next] = args;
  const error = new CustomError(
    "route not found: " + req.url,
    STATUS_CODES.clientError.Not_Found
  );
  next(error);
});

process.on("unhandledRejection", (err: Error) => {
  console.log(err.name, err.message);
  console.log("unhandled promise rejection occurred: Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
