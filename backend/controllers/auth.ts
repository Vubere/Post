import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { STATUS_CODES, jsend } from "../lib/utils";
import { wrapModuleFunctionsInAsyncErrorHandler } from "../lib/utils/aynsc-error-handler";
import CustomError from "../lib/utils/custom-error";
import jwt from "jsonwebtoken";
import { signToken, verifyToken } from "../lib/utils/token";
import { promisify } from "util";
import { UserConfirmRequest } from "../lib/types";
import bcrypt from "bcryptjs";
import { hashPassword } from "../lib/helpers";

interface payload extends jwt.JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

async function SignUp(req: Request, res: Response, next: NextFunction) {
  const { confirmPassword, ...user } = req.body;
  if (user.password !== confirmPassword) {
    next(
      new CustomError(
        "confirm password does not match password!",
        STATUS_CODES.clientError.Bad_Request
      )
    );
    return;
  }
  user.password = await hashPassword(user.password);

  const newUser = await User.create(user);
  const token = signToken(newUser._id);
  res
    .status(STATUS_CODES.success.Created)
    .json(jsend("success", newUser, "registration successful!", { token }));
}
async function Login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  if (!email)
    return next(
      new CustomError(
        "email is required!",
        STATUS_CODES.clientError.Bad_Request
      )
    );
  if (!password)
    return next(
      new CustomError(
        "password is required!",
        STATUS_CODES.clientError.Bad_Request
      )
    );

  const user = await User.findOne({ email }).select(
    "password username email firstName lastName"
  );
  //@ts-ignore
  if (!user || !(await user.authenticatePassword(password, user.password))) {
    return next(
      new CustomError(
        "invalid email or password",
        STATUS_CODES.clientError.Bad_Request
      )
    );
  }
  const token = signToken(user._id);
  const returnData = {
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    id: user._id,
  };

  res
    .status(STATUS_CODES.success.OK)
    .json(jsend("success", returnData, "login successful!", { token }));
}
async function AuthenticatePassword(
  req: UserConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const user = await User.findById(req.requesterId).select("password");
  if (
    user &&
    //@ts-ignore
    (await user.authenticatePassword(req.body.password, user.password))
  ) {
    return next();
  }
  return next(
    new CustomError("unauthorized", STATUS_CODES.clientError.Bad_Request)
  );
}

async function ProtectRoutes(
  req: UserConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const testToken = req.headers.authorization;
  let token: string;
  if (typeof testToken === "string" && testToken.startsWith("Bearer")) {
    token = testToken.split(" ")[1];

    let decodedToken = verifyToken(token) as payload;
    if (typeof decodedToken === "string")
      next(
        new CustomError(
          "bearer token not sent!",
          STATUS_CODES.clientError.Unauthorized
        )
      );

    const user = await User.findById(decodedToken.id);
    //@ts-ignore
    req.requesterId = decodedToken.id;
    if (!user)
      return next(
        new CustomError(
          "user don't exist",
          STATUS_CODES.clientError.Unauthorized
        )
      );
    if (await user.isPasswordChanged(decodedToken.iat)) {
      return next(
        new CustomError(
          "Password has been changed since last login! login again.",
          STATUS_CODES.clientError.Unauthorized
        )
      );
    }
    next();
  } else {
    next(
      new CustomError(
        "bearer token not sent!",
        STATUS_CODES.clientError.Unauthorized
      )
    );
  }
}
const authExports = {
  SignUp,
  Login,
  ProtectRoutes,
  AuthenticatePassword,
};

export default wrapModuleFunctionsInAsyncErrorHandler(authExports);
