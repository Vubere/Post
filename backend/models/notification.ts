import mongoose, { ObjectId } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import { Document } from "mongoose";
import { string } from "yup";

interface INotification extends Document {
  createdAt: Date;
  updatedAt: Date;
  userId: ObjectId;
  content: string;
  notificationOrigin: ObjectId;
  type:
    | "follow"
    | "praise"
    | "comment"
    | "tip"
    | "subscription"
    | "paywall"
    | "milestone"
    | "post"
    | "reply";
  unread?: boolean;
}

const notificationSchema = new mongoose.Schema<INotification>(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
    userId: {
      type: String,
      required: [true, "user id is required!"],
    },
    content: {
      type: String,
      required: [true, "content is required!"],
    },
    notificationOrigin: {
      type: String,
      required: [true, "origin of notification is required!"],
    },
    type: {
      type: String,
      enum: [
        "follow",
        "praise",
        "comment",
        "tip",
        "subscription",
        "paywall",
        "milestone",
        "post",
        "reply",
      ],
      required: [true, "notification type is required!"],
    },
    unread: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

notificationSchema.pre(/find/, function (next) {
  //@ts-ignore
  this.find().select("-__v");
  next();
});

const Notification =
  mongoose.models.notifications ||
  mongoose.model("notifications", notificationSchema);

export default Notification;
