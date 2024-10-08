"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    email: {
        type: String,
        unique: true,
        validate: [validator_1.default.isEmail, "please enter a valid email"],
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
        type: (Array),
        default: [],
    },
    messageAccess: {
        type: (Array),
        default: ["all"],
    },
    notificationAccess: {
        type: (Array),
        default: ["all"],
    },
    postNotifications: {
        type: (Array),
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
        type: (Array),
        default: [],
    },
    praises: {
        type: (Array),
        default: [],
    },
    bookmarks: {
        type: (Array),
        default: [],
    },
    blockedBy: {
        type: (Array),
        default: [],
        select: false,
    },
    blocked: {
        type: (Array),
        default: [],
        select: false,
    },
    posts: {
        type: (Array),
        default: [],
    },
    interest: {
        type: (Array),
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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
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
    this.find({
        active: { $ne: false },
        blockedBy: { $nin: [this._id] },
        blocked: { $nin: [this._Id] },
    }).select("-__v");
    next();
});
userSchema.methods.authenticatePassword = function (password, storedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(password, storedPassword);
    });
};
userSchema.methods.isPasswordChanged = function (JWTTimestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const passwordChangedAt = this.passwordChangedAt;
        if (passwordChangedAt) {
            const passwordChangedTimeStamp = passwordChangedAt.getTime() / 1000;
            return JWTTimestamp < passwordChangedTimeStamp;
        }
        return false;
    });
};
const User = mongoose_1.default.models.users || mongoose_1.default.model("users", userSchema);
exports.default = User;
