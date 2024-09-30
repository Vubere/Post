import { NextFunction, Response } from "express";
import { NotificationConfirmRequest } from "../lib/types";
import Notification from "../models/notification";
import CustomError from "../lib/utils/custom-error";
import { jsend } from "../lib/utils";
import { wrapModuleFunctionsInAsyncErrorHandler } from "../lib/utils/aynsc-error-handler";
import { ApiFeaturesAggregation } from "../lib/utils/api-features";
import { Types } from "mongoose";

const notificationApiFeaturesAggregation = (
  query: Record<any, any>,
  authorQuery?: Record<string, any>
) => {
  query.sort = query.sort || { createdAt: -1 };
  return new ApiFeaturesAggregation(
    [
      {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "ownerDetails",
      },
      {
        from: "users",
        localField: "notificationOrigin",
        foreignField: "_id",
        as: "notificationOriginDetails",
      },
    ],
    Notification,
    query,
    [
      { path: "$ownerDetails", preserveNullAndEmptyArrays: true },
      "$notificationOriginDetails",
    ],
    authorQuery || {}
  );
};
async function markNotificationAsRead(
  req: NotificationConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id;
  const userId = req.requesterId;
  if (id && userId) {
    await Notification.findByIdAndUpdate(id, {
      $set: {
        unread: false,
      },
    });
    res
      .status(204)
      .json(jsend("success", undefined, "notification marked as read!"));
  }
  next(new CustomError("notification not found", 404));
  return;
}

async function getNotifications(
  req: NotificationConfirmRequest,
  res: Response
) {
  req.query.userId = new Types.ObjectId(req.requesterId) as any;
  const notificationQuery = notificationApiFeaturesAggregation(
    req.query
  ).aggregate();
  const notifications = await notificationQuery;
  res
    .status(200)
    .json(
      jsend("success", notifications, "notifications fetched successfully!")
    );
}

export async function createNotification(data: {
  content: string;
  type: string;
  userId: string;
  notificationOrigin: string;
  metadata?: Record<string, any>;
}) {
  const notification = await Notification.create({
    ...data,
    unread: true,
  });
  return notification;
}

const notificationExports = {
  markNotificationAsRead,
  getNotifications,
  createNotification: async (
    req: NotificationConfirmRequest,
    res: Response
  ) => {
    await createNotification(req.body);
    res.status(204).json(jsend("success", undefined, "notification created!"));
  },
};
export default wrapModuleFunctionsInAsyncErrorHandler(notificationExports);
