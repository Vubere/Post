import express, { NextFunction, Response } from "express";
import notificationControllers from "../controllers/notifications";
import { NotificationConfirmRequest } from "../lib/types";
import { asyncErrorHandlerIds } from "../lib/utils/aynsc-error-handler";
import CustomError from "../lib/utils/custom-error";
import { STATUS_CODES } from "../lib/utils";
import Notification from "../models/notification";

const { markNotificationAsRead, getNotifications, createNotification } =
  notificationControllers;
const router = express.Router();

const idIdentifier = asyncErrorHandlerIds(
  async (
    req: NotificationConfirmRequest,
    res: Response,
    next: NextFunction,
    value: any
  ) => {
    //wrtie regex check for if the value is 24 characters of hex
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      return next(
        new CustomError(`invalid id`, STATUS_CODES.clientError.Bad_Request)
      );
    }

    const notification = await Notification.findById(value);
    if (!notification) {
      next(
        new CustomError(
          `Notification not found`,
          STATUS_CODES.clientError.Not_Found
        )
      );
    }
    req.notification = notification;
    next();
  }
);
router.param("id", idIdentifier);

router.route("/mark-as-read/:id").post(markNotificationAsRead);
router.route("/").get(getNotifications).post(createNotification);

export default router;
