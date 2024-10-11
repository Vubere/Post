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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comment_1 = __importDefault(require("../models/comment"));
const api_features_1 = __importStar(require("../lib/utils/api-features"));
const utils_1 = require("../lib/utils");
const aynsc_error_handler_1 = require("../lib/utils/aynsc-error-handler");
const custom_error_1 = __importDefault(require("../lib/utils/custom-error"));
const user_1 = __importDefault(require("../models/user"));
const post_1 = __importDefault(require("../models/post"));
const mongoose_1 = require("mongoose");
const notifications_1 = require("./notifications");
const lodash_1 = require("lodash");
const commentApiFeatures = (query) => {
    return new api_features_1.default(comment_1.default.find(), query);
};
const commentApiFeaturesAggregation = (query, authorQuery) => {
    return new api_features_1.ApiFeaturesAggregation({
        from: "users",
        localField: "authorId",
        foreignField: "_id",
        as: "authorDetails",
    }, comment_1.default, query, "$authorDetails", authorQuery);
};
function comment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const body = (0, lodash_1.omit)(req.body, "ownerId");
        const newComment = yield comment_1.default.create(body);
        try {
            if (req.requesterId !== newComment.authorId)
                (0, notifications_1.createNotification)({
                    content: `commented on your post!`,
                    type: "comment",
                    userId: (_a = req.body) === null || _a === void 0 ? void 0 : _a.ownerId,
                    notificationOrigin: req.requesterId,
                    metadata: { commentId: newComment._id },
                });
            yield post_1.default.findByIdAndUpdate(req.body.postId, {
                $addToSet: {
                    comments: newComment._id,
                },
            });
        }
        catch (err) {
            console.log(err);
        }
        res
            .status(utils_1.STATUS_CODES.success.Created)
            .json((0, utils_1.jsend)("success", newComment, "comment posted successful!"));
    });
}
function replyComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const commentId = req.body.commentRepliedTo;
        if (!commentId)
            return next(new custom_error_1.default("failed to pass the comment being replied to!", 400));
        const body = (0, lodash_1.omit)(req.body, "ownerId");
        const newComment = yield comment_1.default.create(body);
        yield comment_1.default.findByIdAndUpdate(commentId, {
            $addToSet: {
                replies: newComment._id,
            },
        });
        if (req.requesterId !== newComment.authorId)
            (0, notifications_1.createNotification)({
                content: `replied to your comment!`,
                type: "comment",
                userId: (_a = req.body) === null || _a === void 0 ? void 0 : _a.ownerId,
                notificationOrigin: req.requesterId,
                metadata: { commentId: newComment._id },
            });
        res
            .status(utils_1.STATUS_CODES.success.Created)
            .json((0, utils_1.jsend)("success", newComment, "comment posted successful!"));
    });
}
function getPostComments(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.query.postId)
            return next(new custom_error_1.default("field postId is missing", 400));
        else
            req.query.postId = new mongoose_1.Types.ObjectId(req.query.postId);
        const commentQuery = commentApiFeaturesAggregation(req.query, {}).aggregate();
        const comment = yield commentQuery;
        res.status(utils_1.STATUS_CODES.success.OK).json((0, utils_1.jsend)("success!", comment, "successfully fetched comments!", {
            count: comment.length,
        }));
    });
}
function getCommentReplies(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.query.commentRepliedTo)
            return next(new custom_error_1.default("field commentRepliedTo is missing", 400));
        const commentQuery = commentApiFeaturesAggregation(req.query, {}).aggregate();
        const comment = yield commentQuery;
        res.status(utils_1.STATUS_CODES.success.OK).json((0, utils_1.jsend)("success!", comment, "successfully fetched comments!", {
            count: comment.length,
        }));
    });
}
function getComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const comment = yield comment_1.default.findById((_a = req.comment) === null || _a === void 0 ? void 0 : _a.id);
        res
            .status(utils_1.STATUS_CODES.success.OK)
            .json((0, utils_1.jsend)("success", comment, "comment fetched successfully!"));
    });
}
function deleteComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        yield comment_1.default.findByIdAndDelete(req.comment._id);
        if (req.comment.commentRepliedTo)
            yield comment_1.default.findByIdAndDelete(req.comment.commentRepliedTo, {
                $pull: {
                    replies: ((_a = req.comment) === null || _a === void 0 ? void 0 : _a._id) || ((_b = req.comment) === null || _b === void 0 ? void 0 : _b.id),
                },
            });
        else
            yield post_1.default.findByIdAndUpdate(req.comment.postId, {
                $pull: { comments: req.comment.id },
            });
        res.status(204).json((0, utils_1.jsend)("success", undefined, "comment deleted!"));
    });
}
function validateUpdateRequestBody(body) {
    const dataKeys = Object.keys(body);
    for (let value of dataKeys) {
        if (!utils_1.UPDATABLE_COMMENT_DATA.includes(value)) {
            return value;
        }
    }
    return true;
}
function updateComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const comment = yield comment_1.default.findById(req.comment._id);
        if (comment !== null) {
            const commentDataToUpdate = req.body;
            const validated = validateUpdateRequestBody(commentDataToUpdate);
            if (typeof commentDataToUpdate !== "object") {
                next(new custom_error_1.default("invalid comment body sent!", utils_1.STATUS_CODES.clientError.Bad_Request));
                return;
            }
            if (validated !== true) {
                next(new custom_error_1.default(`invalid comment body sent! ${validated} can not be updated on comment details!`, utils_1.STATUS_CODES.clientError.Bad_Request));
                return;
            }
            const postDetails = yield comment_1.default.findByIdAndUpdate(req.comment._id, commentDataToUpdate, {
                runValidators: true,
            });
            res
                .status(utils_1.STATUS_CODES.success.OK)
                .json((0, utils_1.jsend)("success!", postDetails, "comment updated successfully"));
            return;
        }
        next(new custom_error_1.default("comment not found", utils_1.STATUS_CODES.clientError.Not_Found));
    });
}
function praiseComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const comment = req.comment;
        const requesterId = req.requesterId;
        yield comment_1.default.findByIdAndUpdate(comment._id, {
            $addToSet: { praises: requesterId },
        });
        try {
            yield user_1.default.findByIdAndUpdate(requesterId, {
                $addToSet: { praises: comment.id },
            });
            res
                .status(utils_1.STATUS_CODES.success.OK)
                .json((0, utils_1.jsend)("success", undefined, `successfully praised ${comment.title}`));
            return;
        }
        catch (err) {
            yield comment_1.default.findByIdAndUpdate(comment._id, {
                $pull: { praises: requesterId },
            });
            next(new custom_error_1.default(`failed to praise ${comment.title}!`, utils_1.STATUS_CODES.serverError.Internal_Server_Error));
        }
    });
}
function viewComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const comment = req.comment;
        const requesterId = req.requesterId;
        yield comment_1.default.findByIdAndUpdate(comment._id, {
            $addToSet: { views: requesterId },
        });
        res
            .status(utils_1.STATUS_CODES.success.OK)
            .json((0, utils_1.jsend)("success", undefined, `viewed comment ${comment.title}`));
        return;
    });
}
function clickComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const comment = req.comment;
        const requesterId = req.requesterId;
        yield comment_1.default.findByIdAndUpdate(comment._id, {
            $addToSet: { clicks: requesterId },
        });
        res
            .status(utils_1.STATUS_CODES.success.OK)
            .json((0, utils_1.jsend)("success", undefined, `clicked on comment ${comment.title}`));
        return;
    });
}
function readComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const comment = req.comment;
        const requesterId = req.requesterId;
        yield comment_1.default.findByIdAndUpdate(comment._id, {
            $addToSet: { reads: requesterId },
        });
        res
            .status(utils_1.STATUS_CODES.success.OK)
            .json((0, utils_1.jsend)("success", undefined, `read comment ${comment.title}`));
        return;
    });
}
function unpraiseComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const comment = req.comment;
        const requesterId = req.requesterId;
        yield comment_1.default.findByIdAndUpdate(comment._id, {
            $pull: { praises: requesterId },
        });
        try {
            yield user_1.default.findByIdAndUpdate(requesterId, {
                $pull: { praises: comment.id },
            });
            res
                .status(utils_1.STATUS_CODES.success.OK)
                .json((0, utils_1.jsend)("success", undefined, `successfully unpraised ${comment.title}`));
            return;
        }
        catch (err) {
            yield comment_1.default.findByIdAndUpdate(comment._id, {
                $addToSet: { praises: requesterId },
            });
            next(new custom_error_1.default(`failed to unpraise ${comment.title}!`, utils_1.STATUS_CODES.serverError.Internal_Server_Error));
        }
    });
}
function addToBookmarks(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const comment = req.comment;
        const requesterId = req.requesterId;
        yield comment_1.default.findByIdAndUpdate(comment._id, {
            $addToSet: { bookmarkedBy: requesterId },
        });
        try {
            yield user_1.default.findByIdAndUpdate(requesterId, {
                $addToSet: { bookmarks: comment.id },
            });
            res
                .status(utils_1.STATUS_CODES.success.OK)
                .json((0, utils_1.jsend)("success", undefined, `successfully bookmarked ${comment.title}`));
            return;
        }
        catch (err) {
            yield comment_1.default.findByIdAndUpdate(comment._id, {
                $pull: { bookmarkedBy: requesterId },
            });
            next(new custom_error_1.default(`failed to bookmark ${comment.title}!`, utils_1.STATUS_CODES.serverError.Internal_Server_Error));
        }
    });
}
function removeFromBookmarks(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const comment = req.comment;
        const requesterId = req.requesterId;
        yield comment_1.default.findByIdAndUpdate(comment._id, {
            $pull: { bookmarkedBy: requesterId },
        });
        try {
            yield user_1.default.findByIdAndUpdate(requesterId, {
                $pull: { bookmarks: comment.id },
            });
            res
                .status(utils_1.STATUS_CODES.success.OK)
                .json((0, utils_1.jsend)("success", undefined, `successfully removed bookmarked ${comment.title}!`));
            return;
        }
        catch (err) {
            yield comment_1.default.findByIdAndUpdate(comment._id, {
                $addToSet: { bookmarkedBy: requesterId },
            });
            next(new custom_error_1.default(`failed to remove bookmark ${comment.title}!`, utils_1.STATUS_CODES.serverError.Internal_Server_Error));
        }
    });
}
function getLikes(...args) {
    return __awaiter(this, void 0, void 0, function* () {
        const [req, , next] = args;
        req.query.praises = { $in: req.requesterId };
        next();
    });
}
function getBookmarks(...args) {
    return __awaiter(this, void 0, void 0, function* () {
        const [req, , next] = args;
        req.query.bookmarkedBy = { $in: req.requesterId };
        next();
    });
}
function isRequestersComment(...args) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const [req, , next] = args;
        const commentId = req.params.id || req.body.id;
        const comment = yield comment_1.default.findById(commentId);
        if (((_a = comment === null || comment === void 0 ? void 0 : comment.authorId) === null || _a === void 0 ? void 0 : _a.toString()) !== req.requesterId) {
            next(new custom_error_1.default("cannot query another users comment!", utils_1.STATUS_CODES.clientError.Bad_Request));
            return;
        }
        req.comment = comment;
        next();
    });
}
const postExports = {
    comment,
    getPostComments,
    getCommentReplies,
    updateComment,
    getComment,
    deleteComment,
    praiseComment,
    unpraiseComment,
    getLikes,
    isRequestersComment,
    getBookmarks,
    addToBookmarks,
    removeFromBookmarks,
    viewComment,
    clickComment,
    replyComment,
    readComment,
};
exports.default = (0, aynsc_error_handler_1.wrapModuleFunctionsInAsyncErrorHandler)(postExports);
