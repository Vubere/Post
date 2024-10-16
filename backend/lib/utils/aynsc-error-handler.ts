import { NextFunction, Response } from "express";
import { UserConfirmRequest } from "../types";

const asyncErrorHandler = (func: any) => {
  return function (
    req: Request | UserConfirmRequest,
    res: Response,
    next: NextFunction
  ) {
    func(req, res, next).catch((err: any) => next(err));
  };
};
const asyncErrorHandlerIds = (func: any) => {
  return function (
    req: Request | UserConfirmRequest,
    res: Response,
    next: NextFunction,
    value: any
  ) {
    func(req, res, next, value).catch((err: any) => next(err));
  };
};
const wrapModuleFunctionsInAsyncErrorHandler = (
  exports: Record<string, any>
) => {
  const valuesHere = Object.values(exports).map((val) =>
    asyncErrorHandler(val)
  );
  const keysHere = Object.keys(exports);
  const transformedexports: { [x: string]: any } = {};

  for (let key in valuesHere) {
    transformedexports[keysHere[key]] = valuesHere[key];
  }
  return transformedexports;
};
export { wrapModuleFunctionsInAsyncErrorHandler, asyncErrorHandlerIds };
export default asyncErrorHandler;
