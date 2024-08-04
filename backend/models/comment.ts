import mongoose, { ObjectId } from "mongoose";
import { Document } from "mongoose";

interface IComment extends Document {
  createdAt: Date;
  updatedAt: Date;
  blogId: ObjectId;
  authorId: ObjectId;
  edited: boolean;
  content: string;
  commentRepliedTo?: ObjectId | null;
  likes?: Array<ObjectId>;
  views?: number;
  clicks?: number;
  reads?: number;
  replies?: Array<{ id: ObjectId; userId: ObjectId }>;
  notifications?: boolean;
  bookmarkedBy?: Array<ObjectId>;
}

const commentSchema = new mongoose.Schema<IComment>(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
    blogId: {
      type: String,
      required: [true, "post id is required!"],
    },
    content: {
      type: String,
      required: [true, "content is Required"],
    },
    authorId: {
      type: String,
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
    likes: {
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
      type: Array<ObjectId>,
      default: [],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
commentSchema.virtual("likesCount").get(function () {
  return this.likes ? this.likes.length : 0;
});
commentSchema.virtual("bookmarksCount").get(function () {
  return this.bookmarkedBy ? this.bookmarkedBy.length : 0;
});
commentSchema.virtual("repliesCount").get(function () {
  return this.replies ? this.replies.length : 0;
});

commentSchema.pre(/find/, function (next) {
  //@ts-ignore
  this.find().select("-__v");
  next();
});

const Comment =
  mongoose.models.comments || mongoose.model("comments", commentSchema);

export default Comment;
