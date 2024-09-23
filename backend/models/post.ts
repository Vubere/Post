import mongoose, { ObjectId } from "mongoose";
import { Document } from "mongoose";
import User from "./user";

interface IPost extends Document {
  type?: "Post" | "Essay" | "Short story" | "Article";
  postType: "post" | "reshare";
  createdAt: Date;
  updatedAt: Date;
  author: ObjectId;
  status: 0 | 1; //"Draft"|"Published"
  edited: boolean;
  title: string;
  synopsis: string;
  content: string;
  coverPhoto: string;
  praises?: Array<ObjectId>;
  views?: Array<ObjectId>;
  clicks?: Array<ObjectId>;
  reads?: Array<ObjectId>;
  categories?: Array<string>;
  isPaywalled: boolean;
  paywallFee?: string;
  paywallPayedBy?: Array<ObjectId>;
  paywalledUsers?: Array<"all" | "followers" | "subscribers">;
  userAccess?: Array<"all" | "followers" | "subscribers">;
  comments?: Array<{ id: ObjectId; userId: ObjectId }>;
  tips?: Array<{ userId: ObjectId; amount: Number }>;
  notifications?: boolean;
  resharedBy?: Array<ObjectId>;
  bookmarkedBy?: Array<ObjectId>;
  version?: number;
  deleted?: boolean;
  theme?: string;
  postReshared?: ObjectId;
}

interface IReshare extends Document {}

const postSchema = new mongoose.Schema<IPost>(
  {
    type: {
      type: String,
      default: "Essay",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "author is required!"],
    },
    postReshared: {
      type: mongoose.Schema.Types.ObjectId,
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
      type: Array<"all" | "followers" | "subscribers">,
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
      type: Array<Object>,
      default: [],
    },
    resharedBy: {
      type: Array<Object>,
      default: [],
    },
    bookmarkedBy: {
      type: Array<ObjectId>,
      default: [],
    },
    categories: {
      type: Array<String>,
      default: [],
    },
    userAccess: {
      type: Array<"all" | "followers" | "subscribers">,
      default: ["all"],
    },
    comments: {
      type: Array<{ id: ObjectId; userId: ObjectId }>,
      default: [],
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
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
  //@ts-ignore
  this.find({
    deleted: { $ne: true },
  }).select("-__v");
  next();
});

const post = mongoose.models.posts || mongoose.model("posts", postSchema);

export default post;
