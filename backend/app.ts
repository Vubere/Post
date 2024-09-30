import express, { Express } from "express";
import { logger, addRequestTime } from "./lib/utils/middlewares";
import morgan from "morgan";

import userRouter from "./routers/user";
import authRouter from "./routers/auth";
import postRouter from "./routers/post";
import commentRouter from "./routers/comment";
import notificationRoter from "./routers/notifications";
import authController from "./controllers/auth";
import rateLimit from "express-rate-limit";

import CustomError from "./lib/utils/custom-error";
import errorController from "./controllers/error";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
//@ts-ignore
import xss from "xss-clean";
import hpp from "hpp";
import { STATUS_CODES } from "./lib/utils";

dotenv.config();

const app: Express = express();
const limiter = rateLimit({
  max: 3000,
  windowMs: 60 * 60 * 1000,
  message:
    "you have exceeded the amount of allowed request, try again in an hour!",
});
app.use(logger);
app.use(addRequestTime);
app.use(morgan("dev"));
app.use(express.static("./public"));
app.use(helmet());
app.use(express.json({ limit: "20mb" }));
app.use(limiter);
app.use(xss());
app.use(hpp({ whitelist: [] }));
app.use(cors());

//console.log(process.argv);

const baseRootUsers = "/api/users";
const baseRootPosts = "/api/posts";
const baseRootComments = "/api/comments";
const baseRootNotification = "/api/notifications";
app.post(baseRootUsers + "/login", authController.Login);
app.use(baseRootUsers, authRouter);
app.use(baseRootUsers, authController.ProtectRoutes, userRouter);
app.use(baseRootPosts, authController.ProtectRoutes, postRouter);
app.use(baseRootComments, authController.ProtectRoutes, commentRouter);
app.use(baseRootNotification, authController.ProtectRoutes, notificationRoter);
app.all("*", (...args) => {
  const [req, , next] = args;
  const error = new CustomError(
    "route not found: " + req.url,
    STATUS_CODES.clientError.Not_Found
  );
  next(error);
});
app.use(errorController);

export default app;
