"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
    postId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
    },
    content: {
        type: String,
        required: [true, "content is Required"],
    },
    authorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, "Author is required"],
    },
    edited: {
        type: Boolean,
        default: false,
    },
    commentRepliedTo: {
        type: String,
        default: null,
    },
    replies: {
        type: Array,
        default: [],
    },
    praises: {
        type: Array,
        default: [],
    },
    clicks: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
    reads: {
        type: Number,
        default: 0,
    },
    notifications: {
        type: Boolean,
        default: true,
    },
    bookmarkedBy: {
        type: (Array),
        default: [],
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
commentSchema.virtual("praisesCount").get(function () {
    return this.praises ? this.praises.length : 0;
});
commentSchema.virtual("bookmarksCount").get(function () {
    return this.bookmarkedBy ? this.bookmarkedBy.length : 0;
});
commentSchema.virtual("repliesCount").get(function () {
    return this.replies ? this.replies.length : 0;
});
commentSchema.pre(/find/, function (next) {
    this.find().select("-__v");
    next();
});
const Comment = mongoose_1.default.models.comments || mongoose_1.default.model("comments", commentSchema);
exports.default = Comment;
