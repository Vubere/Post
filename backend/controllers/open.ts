import { Request, Response } from "express";
import Post from "../models/post";
import ApiFeatures, { ApiFeaturesAggregation } from "../lib/utils/api-features";
import { wrapModuleFunctionsInAsyncErrorHandler } from "../lib/utils/aynsc-error-handler";
import { PostConfirmRequest } from "../lib/types";
import User from "../models/user";
import { postApiFeaturesAggregation } from "./post";
import { Types } from "mongoose";
import { jsend, STATUS_CODES } from "../lib/utils";

async function getPostsPopular(req: PostConfirmRequest, res: Response) {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const skip = (page - 1) * limit;
  const extraQuery = {
    ...(req.query.author
      ? {
          author: new Types.ObjectId(req.query.author as string),
        }
      : {}),
    ...(!req.query.showPaywall
      ? {
          isPaywalled: { $ne: true },
        }
      : {}),
  };

  const popularPosts = await Post.aggregate([
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
        postType: { $ne: "reshare" },
        ...extraQuery,
      },
    },
    { $sort: { popularityScore: -1 } },
    { $skip: skip },
    { $limit: limit },
  ]);

  res.status(200).json({ success: true, data: popularPosts });
}

async function getPost(req: PostConfirmRequest, res: Response) {
  req.query._id = new Types.ObjectId(req.post.id) as any;
  const postQuery = postApiFeaturesAggregation(req.query, {}).aggregate();
  const post = await postQuery;

  res
    .status(STATUS_CODES.success.OK)
    .json(jsend("success", post?.[0] || post, "post fetched successfully!"));
}

async function getTopUsers(...args: [Request, Response]) {
  const [req, res] = args;
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 5);
  const skip = (page - 1) * limit;

  const topUsers = await Post.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "authorDetails",
      },
    },
    {
      $unwind: {
        path: "$authorDetails",
      },
    },
    {
      $project: {
        author: "$author",
        authorDetails: 1,
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
      $addFields: {
        engagement: {
          $add: [
            { $multiply: ["$praisesCount", 4] },
            { $multiply: ["$viewsCount", 2] },
            { $multiply: ["$clicksCount", 1] },
            { $multiply: ["$readsCount", 5] },
            { $multiply: ["$commentsCount", 3] },
            { $multiply: ["$bookmarksCount", 4] },
            { $multiply: ["$resharesCount", 4] },
          ],
        },
      },
    },
    {
      $group: {
        _id: "$author",
        authorDetails: { $first: "$authorDetails" },
        posts: { $sum: 1 },
        engagement: { $sum: "$engagement" },
      },
    },
    {
      $sort: {
        engagement: -1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);

  res
    .status(STATUS_CODES.success.OK)
    .json(jsend("success", topUsers, "top users fetched successfully!"));
}

const openExports = {
  getPostsPopular,
  getPost,
  getTopUsers,
};

export default wrapModuleFunctionsInAsyncErrorHandler(openExports);
