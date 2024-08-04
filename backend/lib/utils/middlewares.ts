//a middleware receive 3 arg, req,res and next()

import dayjs from "dayjs";
import { NextFunction, Request, Response } from "express";

const logger = function (req: Request, res: Response, next: NextFunction) {
  next();
};
const addRequestTime = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  //@ts-ignore
  res.requestedAt = dayjs().format("DD-MM-YYYY HH:mm:ss");
  next();
};
export { logger, addRequestTime };
