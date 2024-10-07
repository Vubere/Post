"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_1 = __importDefault(require("../models/post"));
const api_features_1 = __importStar(require("../lib/utils/api-features"));
const mongoose_1 = require("mongoose");
const utils_1 = require("../lib/utils");
const aynsc_error_handler_1 = require("../lib/utils/aynsc-error-handler");
const custom_error_1 = __importDefault(require("../lib/utils/custom-error"));
const user_1 = __importDefault(require("../models/user"));
const notifications_1 = require("./notifications");
const category_1 = __importDefault(require("../models/category"));
const postApiFeatures = (query) => {
    return new api_features_1.default(post_1.default.find(), query);
};
const postApiFeaturesAggregation = (query, authorQuery) => {
    query.status =
        query.status !== undefined && !isNaN(+query.status)
            ? Number(query.status)
            : 1;
    return new api_features_1.ApiFeaturesAggregation([
        {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "authorDetails",
        },
        {
            from: "posts",
            localField: "postReshared",
            foreignField: "_id",
            as: "sharedPostDetails",
        },
    ], post_1.default, query, [
        "$authorDetails",
        {
            path: "$sharedPostDetails",
            preserveNullAndEmptyArrays: true,
        },
    ], authorQuery);
};
function createPost(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        req.body.author = req.requesterId;
        const newPost = yield post_1.default.create(req.body);
        if (((_a = req.body) === null || _a === void 0 ? void 0 : _a.postType) === "reshare") {
            if (req.requesterId !== newPost.author)
                yield (0, notifications_1.createNotification)({
                    content: `reshared your post!`,
                    type: "reshare",
                    userId: req.requesterId,
                    notificationOrigin: newPost.author,
                    metadata: { postId: newPost.id },
                });
        }
        const categories = (_b = req.body) === null || _b === void 0 ? void 0 : _b.categories;
        res
            .status(utils_1.STATUS_CODES.success.Created)
            .json((0, utils_1.jsend)("success", newPost, "post posted successful!"));
        if (categories) {
            setImmediate(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    for (let category of categories) {
                        const categoryCheck = yield category_1.default.findOne({ name: category });
                        if (!categoryCheck) {
                            const newCategory = yield category_1.default.create({ name: category });
                            newPost.categories.push(newCategory._id);
                        }
                        else {
                            yield category_1.default.findByIdAndUpdate(categoryCheck._id, {
                                $inc: { usage: 1 },
                            });
                        }
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }));
        }
    });
}
function getAllPosts(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const postQuery = postApiFeaturesAggregation(req.query, {}).aggregate();
        const post = yield postQuery;
        res.status(utils_1.STATUS_CODES.success.OK).json((0, utils_1.jsend)("success!", post, "successfully fetched posts!", {
            count: post === null || post === void 0 ? void 0 : post.length,
        }));
    });
}
function getPostFromFollowings(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const postQuery = postApiFeaturesAggregation(req.query, {
            $or: [
                { "authorDetails.followers": req.requesterId },
                { "authorDetails._id": req.requesterId },
            ],
        }).aggregate();
        const post = yield postQuery;
        res.status(utils_1.STATUS_CODES.success.OK).json((0, utils_1.jsend)("success!", post, "successfully fetched posts!", {
            count: post.length,
        }));
    });
}
function getPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        req.query._id = new mongoose_1.Types.ObjectId(req.post.id);
        const postQuery = postApiFeaturesAggregation(req.query, {}).aggregate();
        const post = yield postQuery;
        res
            .status(utils_1.STATUS_CODES.success.OK)
            .json((0, utils_1.jsend)("success", (post === null || post === void 0 ? void 0 : post[0]) || post, "post fetched successfully!"));
    });
}
function deletePost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.params.id === req.post.id) {
            yield post_1.default.findByIdAndUpdate(req.post._id, { active: false }, { runValidators: true });
            res.status(204).json((0, utils_1.jsend)("success", undefined, "post deleted!"));
        }
    });
}
function validateUpdateRequestBody(body) {
    const dataKeys = Object.keys(body);
    for (let value of dataKeys) {
        if (!utils_1.UPDATEABLE_BLOG_DATA.includes(value)) {
            return value;
        }
    }
    return true;
}
function updatePost(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const post = yield post_1.default.findById(req.post._id);
        if (post !== null) {
            const _a = req.body, { id } = _a, postDataToUpdate = __rest(_a, ["id"]);
            const validated = validateUpdateRequestBody(postDataToUpdate);
            if (typeof postDataToUpdate !== "object") {
                next(new custom_error_1.default("invalid post body sent!", utils_1.STATUS_CODES.clientError.Bad_Request));
                return;
            }
            if (validated !== true) {
                next(new custom_error_1.default(`invalid post body sent! ${validated} can not be updated on post details!`, utils_1.STATUS_CODES.clientError.Bad_Request));
                return;
            }
            const postDetails = yield post_1.default.findByIdAndUpdate(req.post._id, postDataToUpdate, {
                runValidators: true,
            });
            res
                .status(utils_1.STATUS_CODES.success.OK)
                .json((0, utils_1.jsend)("success!", postDetails, "post updated successfully"));
            return;
        }
        next(new custom_error_1.default("post not found", utils_1.STATUS_CODES.clientError.Not_Found));
    });
}
function praisePost(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const post = req.post;
        const requesterId = req.requesterId;
        yield post_1.default.findByIdAndUpdate(post._id, {
            $addToSet: { praises: requesterId },
        });
        try {
            yield user_1.default.findByIdAndUpdate(requesterId, {
                $addToSet: { praises: post.id },
            });
            if (req.requesterId !== post.author)
                yield (0, notifications_1.createNotification)({
                    content: `praised your post!`,
                    type: "praise",
                    userId: post.author,
                    notificationOrigin: requesterId,
                    metadata: { postId: post._id },
                });
            res
                .status(utils_1.STATUS_CODES.success.OK)
                .json((0, utils_1.jsend)("success", undefined, `successfully praised ${post.title}`));
            return;
        }
        catch (err) {
            yield post_1.default.findByIdAndUpdate(post._id, {
                $pull: { praises: requesterId },
            });
            next(new custom_error_1.default(`failed to praise ${post.title}!`, utils_1.STATUS_CODES.serverError.Internal_Server_Error));
        }
    });
}
function viewPost(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const post = req.post;
        const requesterId = req.requesterId;
        yield post_1.default.findByIdAndUpdate(post._id, {
            $push: { views: requesterId },
        });
        res
            .status(utils_1.STATUS_CODES.success.OK)
            .json((0, utils_1.jsend)("success", undefined, `viewed post ${post.title}`));
        return;
    });
}
function clickPost(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const post = req.post;
        const requesterId = req.requesterId;
        const data = yield post_1.default.findByIdAndUpdate(post._id, {
            $push: { clicks: requesterId },
        }).populate("author");
        res
            .status(utils_1.STATUS_CODES.success.OK)
            .json((0, utils_1.jsend)("success", undefined, `clicked on post ${post.title}`));
        return;
    });
}
function readPost(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const post = req.post;
        const requesterId = req.requesterId;
        yield post_1.default.findByIdAndUpdate(post._id, {
            $push: { reads: requesterId },
        });
        res
            .status(utils_1.STATUS_CODES.success.OK)
            .json((0, utils_1.jsend)("success", undefined, `readed post ${post.title}`));
        return;
    });
}
function unpraisePost(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const post = req.post;
        const requesterId = req.requesterId;
        yield post_1.default.findByIdAndUpdate(post._id, {
            $pull: { praises: requesterId },
        });
        try {
            yield user_1.default.findByIdAndUpdate(requesterId, {
                $pull: { praises: post.id },
            });
            res
                .status(utils_1.STATUS_CODES.success.OK)
                .json((0, utils_1.jsend)("success", undefined, `successfully unpraised ${post.title}`));
            return;
        }
        catch (err) {
            yield post_1.default.findByIdAndUpdate(post._id, {
                $addToSet: { praises: requesterId },
            });
            next(new custom_error_1.default(`failed to unpraise ${post.title}!`, utils_1.STATUS_CODES.serverError.Internal_Server_Error));
        }
    });
}
function addToBookmarks(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const post = req.post;
        const requesterId = req.requesterId;
        yield post_1.default.findByIdAndUpdate(post._id, {
            $addToSet: { bookmarkedBy: requesterId },
        });
        try {
            yield user_1.default.findByIdAndUpdate(requesterId, {
                $addToSet: { bookmarks: post.id },
            });
            res
                .status(utils_1.STATUS_CODES.success.OK)
                .json((0, utils_1.jsend)("success", undefined, `successfully bookmarked ${post.title}`));
            return;
        }
        catch (err) {
            yield post_1.default.findByIdAndUpdate(post._id, {
                $pull: { bookmarkedBy: requesterId },
            });
            next(new custom_error_1.default(`failed to bookmark ${post.title}!`, utils_1.STATUS_CODES.serverError.Internal_Server_Error));
        }
    });
}
function removeFromBookmarks(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const post = req.post;
        const requesterId = req.requesterId;
        yield post_1.default.findByIdAndUpdate(post._id, {
            $pull: { bookmarkedBy: requesterId },
        });
        try {
            yield user_1.default.findByIdAndUpdate(requesterId, {
                $pull: { bookmarks: post.id },
            });
            res
                .status(utils_1.STATUS_CODES.success.OK)
                .json((0, utils_1.jsend)("success", undefined, `successfully removed bookmarked ${post.title}!`));
            return;
        }
        catch (err) {
            yield post_1.default.findByIdAndUpdate(post._id, {
                $addToSet: { bookmarkedBy: requesterId },
            });
            next(new custom_error_1.default(`failed to remove bookmark ${post.title}!`, utils_1.STATUS_CODES.serverError.Internal_Server_Error));
        }
    });
}
function addPaywall(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        const sentKeys = Object.keys(body);
        const allowedKeys = ["paywallFee", "paywalledUsers"];
        if (!(0, utils_1.validateObjectKeys)(sentKeys, allowedKeys))
            return next(new custom_error_1.default("invalid keys sent!", utils_1.STATUS_CODES.clientError.Bad_Request));
        yield post_1.default.findByIdAndUpdate(req.params.id, body, {
            runValidators: true,
        });
        res
            .status(utils_1.STATUS_CODES.success.OK)
            .json((0, utils_1.jsend)("success", undefined, "post paywall settings updated!"));
    });
}
function getLikes(...args) {
    return __awaiter(this, void 0, void 0, function* () {
        const [req, , next] = args;
        req.query.praises = req.query.userId || req.requesterId;
        console.log(req.query.praises);
        next();
    });
}
function getUserPost(...args) {
    return __awaiter(this, void 0, void 0, function* () {
        const [req, , next] = args;
        const id = req.query.userId || req.requesterId;
        req.query.author = new mongoose_1.Types.ObjectId(id);
        next();
    });
}
function getBookmarks(...args) {
    return __awaiter(this, void 0, void 0, function* () {
        const [req, , next] = args;
        req.query.bookmarkedBy = req.requesterId;
        next();
    });
}
function isRequestersPost(...args) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const [req, , next] = args;
        const postId = req.body.id || req.params.id;
        const post = yield post_1.default.findById(postId).select("author");
        if (((_a = post === null || post === void 0 ? void 0 : post.author) === null || _a === void 0 ? void 0 : _a.toString()) !== req.requesterId) {
            next(new custom_error_1.default("cannot query another users post!", utils_1.STATUS_CODES.clientError.Bad_Request));
            return;
        }
        next();
    });
}
function getCategories(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const categoriesData = yield category_1.default.find({}).sort({ usage: -1 });
        const categories = categoriesData.map((category) => {
            return category.name;
        });
        res
            .status(utils_1.STATUS_CODES.success.OK)
            .json((0, utils_1.jsend)("success", categories, "categories fetched successfully!"));
    });
}
function getTopCategories(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const categoriesData = yield category_1.default.find({}).sort({ usage: -1 }).limit(5);
        const categories = categoriesData.map((category) => {
            return category.name;
        });
        res
            .status(utils_1.STATUS_CODES.success.OK)
            .json((0, utils_1.jsend)("success", categories, "categories fetched successfully!"));
    });
}
const postExports = {
    createPost,
    getAllPosts,
    getUserPost,
    updatePost,
    getPost,
    deletePost,
    praisePost,
    unpraisePost,
    addPaywall,
    getLikes,
    isRequestersPost,
    getBookmarks,
    addToBookmarks,
    removeFromBookmarks,
    viewPost,
    clickPost,
    readPost,
    getPostFromFollowings,
    getCategories,
    getTopCategories,
};
exports.default = (0, aynsc_error_handler_1.wrapModuleFunctionsInAsyncErrorHandler)(postExports);
