"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    type: {
        type: String,
        default: "Essay",
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "author is required!"],
    },
    postReshared: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "posts",
    },
    postType: {
        type: String,
        default: "post",
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
    title: {
        type: String,
        required: [true, "title is required!"],
    },
    synopsis: {
        type: String,
        required: [true, "synopsis is required!"],
    },
    content: {
        type: String,
        required: [true, "content is Required"],
    },
    edited: {
        type: Boolean,
        default: false,
    },
    status: {
        type: Number,
        enum: [0, 1],
        default: 0,
    },
    coverPhoto: {
        type: String,
        default: "",
    },
    praises: {
        type: Array,
        default: [],
    },
    clicks: {
        type: Array,
        default: [],
    },
    views: {
        type: Array,
        default: [],
    },
    reads: {
        type: Array,
        default: [],
    },
    isPaywalled: {
        type: Boolean,
        default: false,
    },
    paywallFee: {
        type: Number,
        default: 0,
    },
    paywallPayedBy: {
        type: Object,
        default: [],
    },
    paywalledUsers: {
        type: (Array),
        default: [],
    },
    notifications: {
        type: Boolean,
        default: true,
    },
    version: {
        type: Number,
        default: 1,
    },
    tips: {
        type: (Array),
        default: [],
    },
    resharedBy: {
        type: (Array),
        default: [],
    },
    bookmarkedBy: {
        type: (Array),
        default: [],
    },
    categories: {
        type: (Array),
        default: [],
    },
    userAccess: {
        type: (Array),
        default: ["all"],
    },
    comments: {
        type: (Array),
        default: [],
    },
    deleted: {
        type: Boolean,
        default: false,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
postSchema.virtual("clicksCount").get(function () {
    return this.clicks ? this.clicks.length : 0;
});
postSchema.virtual("sharesCount").get(function () {
    return this.resharedBy ? this.resharedBy.length : 0;
});
postSchema.virtual("viewsCount").get(function () {
    return this.views ? this.views.length : 0;
});
postSchema.virtual("readsCount").get(function () {
    return this.reads ? this.reads.length : 0;
});
postSchema.virtual("praisesCount").get(function () {
    return this.praises ? this.praises.length : 0;
});
postSchema.virtual("bookmarksCount").get(function () {
    return this.bookmarkedBy ? this.bookmarkedBy.length : 0;
});
postSchema.virtual("tipsCount").get(function () {
    return this.tips ? this.tips.length : 0;
});
postSchema.virtual("commentsCount").get(function () {
    return this.comments ? this.comments.length : 0;
});
postSchema.pre(/find/, function (next) {
    this.find({
        deleted: { $ne: true },
    }).select("-__v");
    next();
});
const post = mongoose_1.default.models.posts || mongoose_1.default.model("posts", postSchema);
exports.default = post;
