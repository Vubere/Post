import { NextFunction, Request, Response } from "express";
import { STATUS_CODES, jsend } from "../lib/utils";
import CustomError from "../lib/utils/custom-error";

const devErrors = (res: Response, error: any) => {
  res.status(error.statusCode).json(
    jsend(error.status, undefined, error.message, {
      stackTrace: error.stack,
      error: error.error,
    })
  );
};
const prodErrors: (res: Response, error: any) => void = (res, error) => {
  if (error.isOperational) {
    res
      .status(error.statusCode)
      .json(jsend(error.status, undefined, error.message));
  } else {
    if (error.name === "CastError") {
      return generateProdErrors(
        res,
        `invalid value for ${error.path}:${error.value}`
      );
    }
    //for duplicate field error
    else if (error.code === 11000) {
      const keys = Object.keys(error.keyValue || {}).join(", ");
      const values = Object.values(error.keyValue || {}).join(", ");
      return generateProdErrors(
        res,
        `${keys} must be unique to you. ${values} is already attached to an existing user!`
      );
    } else if (error.name === "ValidationError") {
      const errs = Object.values(error.errors).map((val: any) => val.message);
      return generateProdErrors(res, errs.join(", "));
    } else if (error.name === "TokenExpiredError") {
      return generateProdErrors(res, "login expired!");
    } else if (error.name === "JSONWebTokenError") {
      return generateProdErrors(res, "invalid token! login again!");
    }
    res
      .status(STATUS_CODES.serverError.Internal_Server_Error)
      .json(jsend("error", undefined, "something went wrong"));
  }
};
function generateProdErrors(res: Response, msg: string, statusCode?: number) {
  return prodErrors(
    res,
    new CustomError(msg, statusCode || STATUS_CODES.clientError.Bad_Request)
  );
}
const errorController = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode =
    error.statusCode || STATUS_CODES.serverError.Internal_Server_Error;
  error.status = error.status || "error";
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development") {
    devErrors(res, error);
  } else if (process.env.NODE_ENV === "production") {
    prodErrors(res, error);
  }
};

export default errorController;
