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
const user_1 = __importDefault(require("../models/user"));
const api_features_1 = __importDefault(require("../lib/utils/api-features"));
const utils_1 = require("../lib/utils");
const aynsc_error_handler_1 = require("../lib/utils/aynsc-error-handler");
const custom_error_1 = __importDefault(require("../lib/utils/custom-error"));
const token_1 = require("../lib/utils/token");
const helpers_1 = require("../lib/helpers");
const post_1 = __importDefault(require("../models/post"));
const notifications_1 = require("./notifications");
const UserApiFeatures = (query) => {
    return new api_features_1.default(user_1.default.find(), query);
};
function getAllUsers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const UserQuery = UserApiFeatures(req.query)
            .filter()
            .sort()
            .limitFields()
            .pagination();
        const users = yield UserQuery.query;
        res.status(utils_1.STATUS_CODES.success.OK).json((0, utils_1.jsend)("success!", users, "successfully fetched users!", {
            count: users.length,
        }));
    });
}
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        res
            .status(utils_1.STATUS_CODES.success.OK)
            .json((0, utils_1.jsend)("success", user, "user fetched successfully!"));
    });
}
function getProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_1.default.findById(req.requesterId);
        res
            .status(utils_1.STATUS_CODES.success.OK)
            .json((0, utils_1.jsend)("success", user, "user fetched successfully!"));
    });
}
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.params.id === req.user.id) {
            yield user_1.default.findByIdAndUpdate(req.user._id, { active: false }, { runValidators: true });
            res.status(204).json((0, utils_1.jsend)("success", undefined, "account deleted!"));
        }
    });
}
function validateUpdateRequestBody(body) {
    const dataKeys = Object.keys(body);
    for (let value of dataKeys) {
        if (!utils_1.UPDATEABLE_USER_DATA.includes(value)) {
            return value;
        }
    }
    return true;
}
function updateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_1.default.findById(req.user._id);
        if (user !== null) {
            const userDataToUpdate = req.body;
            const validated = validateUpdateRequestBody(userDataToUpdate);
            if (typeof userDataToUpdate !== "object") {
                next(new custom_error_1.default("invalid user body sent!", utils_1.STATUS_CODES.clientError.Bad_Request));
                return;
            }
            if (validated !== true) {
                next(new custom_error_1.default(`invalid user body sent! ${validated} can not be updated on user details!`, utils_1.STATUS_CODES.clientError.Bad_Request));
                return;
            }
            const userDetails = yield user_1.default.findByIdAndUpdate(req.user._id, userDataToUpdate, {
                runValidators: true,
            });
            const token = (0, token_1.signToken)(user._id);
            res.status(utils_1.STATUS_CODES.success.OK).json((0, utils_1.jsend)("success!", userDetails, "user updated successfully", {
                token,
            }));
            return;
        }
        next(new custom_error_1.default("user not found", utils_1.STATUS_CODES.clientError.Not_Found));
    });
}
function updateUserPassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_1.default.findById(req.requesterId);
        if (req.body.newPassword !== req.body.confirmPassword) {
            next(new custom_error_1.default("password and confirm password don't match", utils_1.STATUS_CODES.clientError.Bad_Request));
        }
        if (user !== null) {
            user.password = yield (0, helpers_1.hashPassword)(req.body.newPassword);
            user.passwordChangedAt = new Date();
            yield user.save();
            const token = (0, token_1.signToken)(user._id);
            const returnData = {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                id: user._id,
            };
            res.status(utils_1.STATUS_CODES.success.OK).json((0, utils_1.jsend)("success!", returnData, "password updated successfully!", {
                token,
            }));
            return;
        }
        next(new custom_error_1.default("user not found", utils_1.STATUS_CODES.clientError.Not_Found));
    });
}
function viewProfile(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        const requesterId = req.requesterId;
        yield user_1.default.findByIdAndUpdate(user._id, {
            $addToSet: { profileViews: requesterId },
        });
        try {
            yield user_1.default.findByIdAndUpdate(requesterId, {
                $addToSet: { viewedProfiles: user.id },
            });
            res
                .status(utils_1.STATUS_CODES.success.OK)
                .json((0, utils_1.jsend)("success", undefined, `successfully followed ${user.username}`));
            return;
        }
        catch (err) {
            yield user_1.default.findByIdAndUpdate(user._id, {
                $pull: { profileViews: requesterId },
            });
            next(new custom_error_1.default(`failed to follow ${user.username}!`, utils_1.STATUS_CODES.serverError.Internal_Server_Error));
        }
    });
}
function subscribe(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        const requesterId = req.requesterId;
        yield user_1.default.findByIdAndUpdate(user._id, {
            $addToSet: { subscriptions: requesterId },
        });
        try {
            yield user_1.default.findByIdAndUpdate(requesterId, {
                $addToSet: { subscribers: user.id },
            });
            yield (0, notifications_1.createNotification)({
                content: `${user.username} subscribed to you!`,
                type: "subscription",
                userId: user._id,
                notificationOrigin: requesterId,
            });
            res
                .status(utils_1.STATUS_CODES.success.OK)
                .json((0, utils_1.jsend)("success", undefined, `successfully subscribed ${user.username}`));
            return;
        }
        catch (err) {
            yield user_1.default.findByIdAndUpdate(user._id, {
                $pull: { subscriptions: requesterId },
            });
            next(new custom_error_1.default(`failed to subscribe to ${user.username}!`, utils_1.STATUS_CODES.serverError.Internal_Server_Error));
        }
    });
}
function unsubscribe(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        const requesterId = req.requesterId;
        yield user_1.default.findByIdAndUpdate(user._id, {
            $pull: { subscriptions: requesterId },
        });
        try {
            yield user_1.default.findByIdAndUpdate(requesterId, {
                $pull: { subscribers: user.id },
            });
            res
                .status(utils_1.STATUS_CODES.success.OK)
                .json((0, utils_1.jsend)("success", undefined, `successfully unsubscibed ${user.username}`));
            return;
        }
        catch (err) {
            yield user_1.default.findByIdAndUpdate(user._id, {
                $addToSet: { subscriptions: requesterId },
            });
            next(new custom_error_1.default(`failed to unsubscribe from ${user.username}!`, utils_1.STATUS_CODES.serverError.Internal_Server_Error));
        }
    });
}
function followUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        const requesterId = req.requesterId;
        yield user_1.default.findByIdAndUpdate(user._id, {
            $addToSet: { followers: requesterId },
        });
        try {
            yield user_1.default.findByIdAndUpdate(requesterId, {
                $addToSet: { following: user.id },
            });
            yield (0, notifications_1.createNotification)({
                content: `${user.username} followed you!`,
                type: "follow",
                userId: user._id,
                notificationOrigin: requesterId,
            });
            res
                .status(utils_1.STATUS_CODES.success.OK)
                .json((0, utils_1.jsend)("success", undefined, `successfully followed ${user.username}`));
            return;
        }
        catch (err) {
            yield user_1.default.findByIdAndUpdate(user._id, {
                $pull: { followers: requesterId },
            });
            next(new custom_error_1.default(`failed to follow ${user.username}!`, utils_1.STATUS_CODES.serverError.Internal_Server_Error));
        }
    });
}
function unfollowUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        const requesterId = req.requesterId;
        yield user_1.default.findByIdAndUpdate(user._id, {
            $pull: { followers: requesterId },
        });
        try {
            yield user_1.default.findByIdAndUpdate(requesterId, {
                $pull: { following: user.id },
            });
            res
                .status(utils_1.STATUS_CODES.success.OK)
                .json((0, utils_1.jsend)("success", undefined, `successfully unfollowed ${user.username}`));
            return;
        }
        catch (err) {
            yield user_1.default.findByIdAndUpdate(user._id, {
                $addToSet: { followers: requesterId },
            });
            next(new custom_error_1.default(`failed to unfollow ${user.username}!`, utils_1.STATUS_CODES.serverError.Internal_Server_Error));
        }
    });
}
function blockUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        const requesterId = req.requesterId;
        yield user_1.default.findByIdAndUpdate(user._id, {
            $addToSet: { blockedBy: requesterId },
        });
        try {
            yield user_1.default.findByIdAndUpdate(requesterId, {
                $addToSet: { blocked: user.id },
            });
            res
                .status(utils_1.STATUS_CODES.success.OK)
                .json((0, utils_1.jsend)("success", undefined, `successfully blocked ${user.username}`));
            return;
        }
        catch (err) {
            yield user_1.default.findByIdAndUpdate(user._id, {
                $pull: { blockedBy: requesterId },
            });
            next(new custom_error_1.default(`failed to block ${user.username}!`, utils_1.STATUS_CODES.serverError.Internal_Server_Error));
        }
    });
}
function unblockUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        const requesterId = req.requesterId;
        yield user_1.default.findByIdAndUpdate(user._id, {
            $pull: { blockedBy: requesterId },
        });
        try {
            yield user_1.default.findByIdAndUpdate(requesterId, {
                $pull: { blocked: user.id },
            });
            res
                .status(utils_1.STATUS_CODES.success.OK)
                .json((0, utils_1.jsend)("success", undefined, `successfully unblocked ${user.username}`));
            return;
        }
        catch (err) {
            yield user_1.default.findByIdAndUpdate(user._id, {
                $addToSet: { blockedBy: requesterId },
            });
            next(new custom_error_1.default(`failed to unblock ${user.username}!`, utils_1.STATUS_CODES.serverError.Internal_Server_Error));
        }
    });
}
function updatePrivacySettings(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const requesterId = req.requesterId;
        const body = req.body;
        const sentKeys = Object.keys(body);
        const allowedKeys = ["messageAccess", "notificationAccess"];
        if (!(0, utils_1.validateObjectKeys)(sentKeys, allowedKeys))
            return next(new custom_error_1.default("invalid keys sent!", utils_1.STATUS_CODES.clientError.Bad_Request));
        yield user_1.default.findByIdAndUpdate(requesterId, body);
        res
            .status(utils_1.STATUS_CODES.success.OK)
            .json((0, utils_1.jsend)("success", undefined, "privacy settings updated!"));
    });
}
function updateInterest(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const requesterId = req.requesterId;
        const body = req.body;
        const sentKeys = Object.keys(body);
        const allowedKeys = ["interest"];
        if (!(0, utils_1.validateObjectKeys)(sentKeys, allowedKeys))
            return next(new custom_error_1.default("invalid keys sent!", utils_1.STATUS_CODES.clientError.Bad_Request));
        yield user_1.default.findByIdAndUpdate(requesterId, body);
        res
            .status(utils_1.STATUS_CODES.success.OK)
            .json((0, utils_1.jsend)("success", undefined, "privacy settings updated!"));
    });
}
function updateSections(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        const sentKeys = Object.keys(body);
        const allowedKeys = ["profileSections"];
        if (!(0, utils_1.validateObjectKeys)(sentKeys, allowedKeys))
            return next(new custom_error_1.default("invalid keys sent!", utils_1.STATUS_CODES.clientError.Bad_Request));
        yield user_1.default.findByIdAndUpdate(req.requesterId, body);
        res
            .status(utils_1.STATUS_CODES.success.OK)
            .json((0, utils_1.jsend)("success", undefined, "profile sections updated!"));
    });
}
function getBlockedUsers(...args) {
    return __awaiter(this, void 0, void 0, function* () {
        const [req, , next] = args;
        req.query.blockedBy = { $in: req.requesterId };
        next();
    });
}
function getFollowing(...args) {
    return __awaiter(this, void 0, void 0, function* () {
        const [req, , next] = args;
        const userId = req.query.userId || req.requesterId;
        if (req.query.userId)
            delete req.query["userId"];
        req.query.followers = { $in: [userId] };
        next();
    });
}
function getFollowers(...args) {
    return __awaiter(this, void 0, void 0, function* () {
        const [req, , next] = args;
        const userId = req.query.userId || req.requesterId;
        if (req.query.userId)
            delete req.query["userId"];
        req.query.following = { $in: userId };
        next();
    });
}
function getSubscribers(...args) {
    return __awaiter(this, void 0, void 0, function* () {
        const [req, , next] = args;
        const userId = req.query.userId || req.requesterId;
        if (req.query.userId)
            delete req.query["userId"];
        req.query.subscriptions = { $in: [userId] };
        next();
    });
}
function getSubscriptions(...args) {
    return __awaiter(this, void 0, void 0, function* () {
        const [req, , next] = args;
        const userId = req.query.userId || req.requesterId;
        if (req.query.userId)
            delete req.query["userId"];
        req.query.subscribers = { $in: [userId] };
        next();
    });
}
function getUserAnalytics(...args) {
    return __awaiter(this, void 0, void 0, function* () {
        const [req, res, next] = args;
        const fields = "praises posts profileViews followers following subscribers subscribed bookmarks viewedProfiles";
        const userId = req.query.userId || req.requesterId;
        if (req.query.userId)
            delete req.query["userId"];
        const user = yield user_1.default.findById(userId).select(fields);
        const post = yield post_1.default.aggregate([
            {
                $match: {
                    author: user._id,
                },
            },
            {
                $project: {
                    author: "$author",
                    praisesCount: { $size: "$praises" },
                    viewsCount: { $size: "$views" },
                    clicksCount: { $size: "$clicks" },
                    readsCount: { $size: "$reads" },
                    commentCount: { $size: "$comments" },
                    resharesCount: { $size: "$resharedBy" },
                    bookmarksCount: { $size: "$bookmarkedBy" },
                },
            },
            {
                $group: {
                    _id: "$author",
                    posts: { $sum: 1 },
                    praises: { $sum: "$praisesCount" },
                    views: { $sum: "$viewsCount" },
                    clicks: { $sum: "$clicksCount" },
                    reads: { $sum: "$readsCount" },
                    comments: { $sum: "$commentCount" },
                    bookmarks: { $sum: "$bookmarksCount" },
                    reshares: { $sum: "$resharesCount" },
                },
            },
        ]);
        const analytics = {
            userInteractionAnalytics: user,
            userPostAnalytics: (post === null || post === void 0 ? void 0 : post[0]) || {},
        };
        res
            .status(utils_1.STATUS_CODES.success.OK)
            .json((0, utils_1.jsend)("success", analytics, "user analytics compiled successfully!"));
    });
}
const userExports = {
    getAllUsers,
    updateUser,
    getUser,
    getProfile,
    deleteUser,
    updateUserPassword,
    followUser,
    unfollowUser,
    blockUser,
    unblockUser,
    updatePrivacySettings,
    getBlockedUsers,
    getFollowers,
    getFollowing,
    updateInterest,
    updateSections,
    viewProfile,
    getUserAnalytics,
    getSubscribers,
    getSubscriptions,
    subscribe,
    unsubscribe,
};
exports.default = (0, aynsc_error_handler_1.wrapModuleFunctionsInAsyncErrorHandler)(userExports);
