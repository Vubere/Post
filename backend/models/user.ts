import mongoose, { ObjectId } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import { Document } from "mongoose";

interface IUser extends Document {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  password?: string;
  passwordChangedAt?: Date | null;
  dateOfBirth: Date;
  biography: string;
  location: string;
  interest?: Array<string>;
  signUpMethod?: "google-auth" | "signup-form";
  coverPhoto: string;
  profilePhoto: string;
  active: boolean;
  profileSections?: { name: string; content: string }[];
  postNotifications?: Array<"all" | "followers" | "mutuals" | "subscribers">;
  messageAccess?: Array<"all" | "followers" | "mutuals" | "subscribers">;
  notificationAccess?: Array<"all" | "followers" | "mutuals" | "subscribers">;
  subscribers?: Array<ObjectId>;
  subscriptions?: Array<ObjectId>;
  subscriptionFee?: string;
  followers?: Array<ObjectId>;
  following?: Array<ObjectId>;
  viewedProfiles?: Array<ObjectId>;
  profileViews?: Array<ObjectId>;
  notifications?: Array<{ id: ObjectId; read: Boolean }>;
  praises?: Array<ObjectId>;
  posts?: Array<ObjectId>;
  bookmarks?: Array<ObjectId>;
  isPasswordChanged: (JWTTimestamp: number) => Promise<boolean>;
  blockedBy?: Array<ObjectId>;
  blocked?: Array<ObjectId>;
  authenticatePassword: (
    password: string,
    storedPassword: string
  ) => Promise<any>;
  createdBy?: string | null;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    email: {
      type: String,
      unique: true,
      validate: [validator.isEmail, "please enter a valid email"],
      required: [true, "email is required!"],
    },
    password: {
      type: String,
      minLength: 6,
      select: false,
    },
    firstName: {
      type: String,
      required: [true, "First Name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
    },
    username: {
      type: String,
      default: function () {
        return this.firstName + this.lastName + Date.now();
      },
    },
    coverPhoto: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    biography: {
      type: String,
      default: "",
    },
    profileSections: {
      type: Array<{ title: String; content: String }>,
      default: [],
    },
    messageAccess: {
      type: Array<"all" | "followers" | "mutuals" | "subscribers">,
      default: ["all"],
    },
    notificationAccess: {
      type: Array<"all" | "followers" | "mutuals" | "subscribers">,
      default: ["all"],
    },
    postNotifications: {
      type: Array<"all" | "followers" | "mutuals" | "subscribers">,
      default: [],
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    subscribers: {
      type: Array,
      default: [],
    },
    subscriptionFee: {
      type: String,
      default: "0",
    },
    subscriptions: {
      type: Array,
      default: [],
    },
    signUpMethod: {
      type: String,
      default: "signup-form",
    },
    viewedProfiles: {
      type: Array,
      default: [],
    },
    profileViews: {
      type: Array,
      default: [],
    },
    notifications: {
      type: Array<{ read: Boolean; id: ObjectId }>,
      default: [],
    },
    praises: {
      type: Array<ObjectId>,
      default: [],
    },
    bookmarks: {
      type: Array<ObjectId>,
      default: [],
    },
    blockedBy: {
      type: Array<ObjectId>,
      default: [],
      select: false,
    },
    blocked: {
      type: Array<ObjectId>,
      default: [],
      select: false,
    },
    posts: {
      type: Array<ObjectId>,
      default: [],
    },
    interest: {
      type: Array<String>,
      default: [],
    },
    dateOfBirth: {
      type: Date,
    },
    passwordChangedAt: {
      type: Date,
      select: false,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },

    createdBy: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
userSchema.virtual("fullName").get(function () {
  return this.firstName && `${this.firstName} ${this.lastName}`;
});
userSchema.virtual("followersCount").get(function () {
  return this.followers && this.followers.length;
});
userSchema.virtual("followingCount").get(function () {
  return this.following && this.following.length;
});
userSchema.virtual("profileViewsCount").get(function () {
  return this.viewedProfiles && this.viewedProfiles.length;
});
userSchema.virtual("viewedProfilesCount").get(function () {
  return this.following && this.following.length;
});
userSchema.virtual("unreadNotifications").get(function () {
  return this.notifications && this.notifications.filter((val) => !val.read);
});
userSchema.virtual("postsCount").get(function () {
  return this.posts && this.posts.length;
});
userSchema.virtual("praisesCount").get(function () {
  return this.praises && this.praises.length;
});
userSchema.virtual("bookmarksCount").get(function () {
  return this.bookmarks && this.bookmarks.length;
});
userSchema.virtual("subscribersCount").get(function () {
  return this.subscribers && this.subscribers.length;
});
userSchema.virtual("subscriptionsCount").get(function () {
  return this.subscriptions && this.subscriptions.length;
});
userSchema.pre(/find/, function (next) {
  //@ts-ignore
  this.find({
    active: { $ne: false },
    //@ts-ignore
    blockedBy: { $nin: [this._id] },
    //@ts-ignore
    blocked: { $nin: [this._Id] },
  }).select("-__v");
  next();
});
userSchema.methods.authenticatePassword = async function (
  password: string,
  storedPassword: string
) {
  return await bcrypt.compare(password, storedPassword);
};

//@ts-ignore
userSchema.methods.isPasswordChanged = async function (JWTTimestamp: number) {
  //@ts-ignore
  const passwordChangedAt = this.passwordChangedAt;

  if (passwordChangedAt) {
    const passwordChangedTimeStamp = passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < passwordChangedTimeStamp;
  }
  return false;
};
const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
