import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { STATUS_CODES, jsend } from "../lib/utils";
import { wrapModuleFunctionsInAsyncErrorHandler } from "../lib/utils/aynsc-error-handler";
import CustomError from "../lib/utils/custom-error";
import jwt from "jsonwebtoken";
import { signToken, verifyToken } from "../lib/utils/token";
import { UserConfirmRequest } from "../lib/types";
import { hashPassword } from "../lib/helpers";
import nodemailer from "nodemailer";
//import fetch from "node-fetch";

interface payload extends jwt.JwtPayload {
  id: string;
  iat: number;
  exp: number;
}
function validateRequestBody(
  body: Record<string, any>,
  arrayOfValues: string[]
) {
  const bodyKeys = Object.keys(body);
  const arr: string[] = [];
  for (let value of arrayOfValues) {
    if (!bodyKeys.includes(value)) {
      arr.push(value);
    }
  }
  return arr.length ? arr : true;
}

async function SignUp(req: Request, res: Response, next: NextFunction) {
  const { confirmPassword, ...user } = req.body;
  const errorVal = validateRequestBody(user, ["dateOfBirth", "password"]);
  if (errorVal !== true) {
    next(new CustomError(errorVal.join(", ") + " is required!", 400));
    return;
  }
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
async function GoogleSignIn(req: Request, res: Response, next: NextFunction) {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${req.body.token}`
  );

  const info: any = await response.json();
  const userInfo = {
    email: info.email,
    firstName: info.given_name,
    lastName: info.family_name,
    profilePhoto: info.picture,
    signUpMethod: "google-auth",
  };
  const userCheck = await User.findOne({ email: userInfo.email }).select(
    "signUpMethod"
  );
  if (userCheck) {
    if (userCheck.signUpMethod === "google-auth") {
      const userDetails = await User.findById(userCheck._id);
      const token = signToken(userDetails._id);
      res
        .status(STATUS_CODES.success.OK)
        .json(jsend("success", userDetails, "login successful!", { token }));
    } else {
      next(new CustomError("user signed up using form", 400));
    }
  } else {
    const newUser = await User.create(userInfo);
    const token = signToken(newUser._id);
    res
      .status(STATUS_CODES.success.Created)
      .json(jsend("success", newUser, "registration successful!", { token }));
  }
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
    "password username email firstName lastName signUpMethod"
  );
  if (user?.signUpMethod !== "signup-form") {
    return next(
      new CustomError(
        "user signed in with google auth!",
        STATUS_CODES.clientError.Bad_Request
      )
    );
  }
  if (!user || !(await user.authenticatePassword(password, user.password))) {
    return next(
      new CustomError(
        "invalid email or password",
        STATUS_CODES.clientError.Bad_Request
      )
    );
  }
  const token = signToken(user._id);
  const userDetails = await User.findById(user._id);
  res
    .status(STATUS_CODES.success.OK)
    .json(jsend("success", userDetails, "login successful!", { token }));
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
async function resetPassword(req: UserConfirmRequest, res: Response) {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    //send email using nodemailer
    const token = signToken(user._id);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      auth: {
        user: process.env.DEFAULT_EMAIL,
        pass: process.env.DEFAULT_EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.DEFAULT_EMAIL,
      to: email,
      subject: "Password Reset",
      text: "Password Reset Email!",
      html: ` <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>NodeMailer Email Template</title>
        </head>
        <body>
      <div style="background-color: #f1f1f1; padding: 10px; border-radius: 5px;display:flex;flex-direction:column;align-items:center;">
      <p>Click on this link to reset your password. Please login with your new password. Ignore if you did not request a password reset.</p>
      <a style="text-decoration: none; color: blue;" href="${process.env.WEBSITE_BASE_URL}/reset-password/${token}">Reset Password</a>
      </div>
      </body>
    </html>
      `,
    };
    await transporter.sendMail(mailOptions);

    res
      .status(STATUS_CODES.success.OK)
      .json(jsend("success", undefined, "password reset email sent!"));
  }
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
  GoogleSignIn,
};

export default wrapModuleFunctionsInAsyncErrorHandler(authExports);
