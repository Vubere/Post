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
const post_1 = __importDefault(require("../models/post"));
const aynsc_error_handler_1 = require("../lib/utils/aynsc-error-handler");
const post_2 = require("./post");
const mongoose_1 = require("mongoose");
const utils_1 = require("../lib/utils");
function getPostsPopular(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const skip = (page - 1) * limit;
        const popularPosts = yield post_1.default.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "authorDetails",
                },
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "postReshared",
                    foreignField: "_id",
                    as: "sharedPostDetails",
                },
            },
            { $unwind: { path: "$authorDetails" } },
            {
                $unwind: {
                    path: "$sharedPostDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    popularityScore: {
                        $add: [
                            { $multiply: [{ $size: "$praises" }, 4] },
                            { $multiply: [{ $size: "$views" }, 2] },
                            { $multiply: [{ $size: "$clicks" }, 1] },
                            { $multiply: [{ $size: "$reads" }, 5] },
                            { $multiply: [{ $size: "$comments" }, 3] },
                            { $multiply: [{ $size: "$bookmarkedBy" }, 4] },
                            { $multiply: [{ $size: "$resharedBy" }, 4] },
                        ],
                    },
                },
            },
            {
                $match: {
                    deleted: { $ne: true },
                },
            },
            { $sort: { popularityScore: -1 } },
            { $skip: skip },
            { $limit: limit },
        ]);
        res.status(200).json({ success: true, data: popularPosts });
    });
}
function getPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        req.query._id = new mongoose_1.Types.ObjectId(req.post.id);
        const postQuery = (0, post_2.postApiFeaturesAggregation)(req.query, {}).aggregate();
        const post = yield postQuery;
        res
            .status(utils_1.STATUS_CODES.success.OK)
            .json((0, utils_1.jsend)("success", (post === null || post === void 0 ? void 0 : post[0]) || post, "post fetched successfully!"));
    });
}
const openExports = {
    getPostsPopular,
    getPost,
};
exports.default = (0, aynsc_error_handler_1.wrapModuleFunctionsInAsyncErrorHandler)(openExports);
