"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "sender id is required!"],
    },
    receiverId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
    time: {
        type: Date,
        default: Date.now(),
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
chatSchema.pre(/find/, function (next) {
    this.find().select("-__v");
    next();
});
const Chat = mongoose_1.default.models.chats || mongoose_1.default.model("chats", chatSchema);
exports.default = Chat;
