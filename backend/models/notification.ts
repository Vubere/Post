import mongoose, { ObjectId } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import { Document } from "mongoose";

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
    | "reshare"
    | "subscription"
    | "paywall"
    | "milestone"
    | "post"
    | "reply";
  unread?: boolean;
  metadata?: Record<string, any>;
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
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "user id is required!"],
    },
    content: {
      type: String,
      required: [true, "content is required!"],
    },
    notificationOrigin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "origin of notification is required!"],
    },
    type: {
      type: String,
      enum: [
        "follow",
        "praise",
        "comment",
        "tip",
        "reshare",
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
