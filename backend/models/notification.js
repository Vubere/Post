"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.default.Schema({
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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
notificationSchema.pre(/find/, function (next) {
    this.find().select("-__v");
    next();
});
const Notification = mongoose_1.default.models.notifications ||
    mongoose_1.default.model("notifications", notificationSchema);
exports.default = Notification;
