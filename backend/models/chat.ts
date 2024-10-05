import mongoose, { ObjectId } from "mongoose";
import { Document } from "mongoose";

interface IChat extends Document {
  sentAt: Date;
  updatedAt: Date;
  message: string;
  senderId: ObjectId;
  receiverId: ObjectId;
  read: boolean;
  chatId: string;
}

const chatSchema = new mongoose.Schema<IChat>(
  {
    sentAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
    message: {
      type: String,
      required: [true, "message is required!"],
    },
    senderId: {
      unique: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "sender id is required!"],
    },
    receiverId: {
      unique: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "receiver id is required!"],
    },
    read: {
      type: Boolean,
      default: false,
    },
    chatId: {
      type: String,
      required: [true, "chat id is required"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

chatSchema.pre(/find/, function (next) {
  //@ts-ignore
  this.find().select("-__v");
  next();
});

const Chat = mongoose.models.comments || mongoose.model("chats", chatSchema);

export default Chat;
