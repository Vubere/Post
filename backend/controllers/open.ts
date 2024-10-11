import { Response } from "express";
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

const openExports = {
  getPostsPopular,
  getPost,
};

export default wrapModuleFunctionsInAsyncErrorHandler(openExports);
