import mongoose, { ObjectId } from "mongoose";
import { Document } from "mongoose";

interface IReshare extends Document {
  createdAt: Date;
  updatedAt: Date;
  userId: ObjectId;
  postId: ObjectId;
  content: string;
  edited?: boolean;
}

const notificationSchema = new mongoose.Schema<IReshare>(
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
    postId: {
      type: String,
      required: [true, "post id is required!"],
    },
    content: {
      type: String,
      required: [true, "content is required!"],
    },
    edited: {
      type: Boolean,
      default: false,
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

const NotificationModel =
  mongoose.models.reshare || mongoose.model("reshares", notificationSchema);

export default NotificationModel;
