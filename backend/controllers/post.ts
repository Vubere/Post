import { NextFunction, Request, Response } from "express";
import Post from "../models/post";
import ApiFeatures, { ApiFeaturesAggregation } from "../lib/utils/api-features";
import { Types } from "mongoose";
import {
  STATUS_CODES,
  UPDATEABLE_BLOG_DATA,
  jsend,
  validateObjectKeys,
} from "../lib/utils";
import { wrapModuleFunctionsInAsyncErrorHandler } from "../lib/utils/aynsc-error-handler";
import { PostConfirmRequest } from "../lib/types";
import CustomError from "../lib/utils/custom-error";
import User from "../models/user";

const postApiFeatures = (query: Record<any, any>) => {
  return new ApiFeatures(Post.find(), query);
};
const postApiFeaturesAggregation = (
  query: Record<any, any>,
  authorQuery?: Record<string, any>
) => {
  query.status =
    query.status !== undefined && !isNaN(+query.status)
      ? Number(query.status)
      : 1;
  return new ApiFeaturesAggregation(
    [
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
    ],
    Post,
    query,
    [
      "$authorDetails",
      {
        path: "$sharedPostDetails",
        preserveNullAndEmptyArrays: true,
      },
    ],
    authorQuery
  );
};

async function createPost(
  req: PostConfirmRequest,
  res: Response,
  next: NextFunction
) {
  req.body.author = req.requesterId;
  const newPost = await Post.create(req.body);

  res
    .status(STATUS_CODES.success.Created)
    .json(jsend("success", newPost, "post posted successful!"));
}

async function getAllPosts(
  req: PostConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const postQuery = postApiFeaturesAggregation(req.query, {}).aggregate();

  const post = await postQuery;
  res.status(STATUS_CODES.success.OK).json(
    jsend("success!", post, "successfully fetched posts!", {
      count: post?.length,
    })
  );
}
async function getPostFromFollowings(
  req: PostConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const postQuery = postApiFeaturesAggregation(req.query, {
    $or: [
      { "authorDetails.followers": req.requesterId },
      { "authorDetails._id": req.requesterId },
    ],
  }).aggregate();

  const post = await postQuery;
  res.status(STATUS_CODES.success.OK).json(
    jsend("success!", post, "successfully fetched posts!", {
      count: post.length,
    })
  );
}
async function getPost(req: PostConfirmRequest, res: Response) {
  req.query._id = new Types.ObjectId(req.post.id) as any;
  const postQuery = postApiFeaturesAggregation(req.query, {}).aggregate();
  const post = await postQuery;
  res
    .status(STATUS_CODES.success.OK)
    .json(jsend("success", post?.[0], "post fetched successfully!"));
}
async function deletePost(req: PostConfirmRequest, res: Response) {
  if (req.params.id === req.post.id) {
    await Post.findByIdAndUpdate(
      req.post._id,
      { active: false },
      { runValidators: true }
    );
    res.status(204).json(jsend("success", undefined, "post deleted!"));
  }
}

function validateUpdateRequestBody(body: Record<string, any>) {
  const dataKeys = Object.keys(body);
  for (let value of dataKeys) {
    if (!UPDATEABLE_BLOG_DATA.includes(value)) {
      return value;
    }
  }
  return true;
}
async function updatePost(
  req: PostConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const post = await Post.findById(req.post._id);
  if (post !== null) {
    const { id, ...postDataToUpdate } = req.body;
    const validated = validateUpdateRequestBody(postDataToUpdate);
    if (typeof postDataToUpdate !== "object") {
      next(
        new CustomError(
          "invalid post body sent!",
          STATUS_CODES.clientError.Bad_Request
        )
      );
      return;
    }
    if (validated !== true) {
      next(
        new CustomError(
          `invalid post body sent! ${validated} can not be updated on post details!`,
          STATUS_CODES.clientError.Bad_Request
        )
      );
      return;
    }

    const postDetails = await Post.findByIdAndUpdate(
      req.post._id,
      postDataToUpdate,
      {
        runValidators: true,
      }
    );

    res
      .status(STATUS_CODES.success.OK)
      .json(jsend("success!", postDetails, "post updated successfully"));
    return;
  }
  next(new CustomError("post not found", STATUS_CODES.clientError.Not_Found));
}

async function praisePost(
  req: PostConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const post = req.post;
  const requesterId = req.requesterId;
  await Post.findByIdAndUpdate(post._id, {
    $push: { praises: requesterId },
  });
  try {
    await User.findByIdAndUpdate(requesterId, {
      $push: { praises: post.id },
    });
    res
      .status(STATUS_CODES.success.OK)
      .json(jsend("success", undefined, `successfully praised ${post.title}`));
    return;
  } catch (err) {
    await Post.findByIdAndUpdate(post._id, {
      $pull: { praises: requesterId },
    });
    next(
      new CustomError(
        `failed to praise ${post.title}!`,
        STATUS_CODES.serverError.Internal_Server_Error
      )
    );
  }
}
async function viewPost(
  req: PostConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const post = req.post;
  const requesterId = req.requesterId;
  await Post.findByIdAndUpdate(post._id, {
    $push: { views: requesterId },
  });

  res
    .status(STATUS_CODES.success.OK)
    .json(jsend("success", undefined, `viewed post ${post.title}`));
  return;
}
async function clickPost(
  req: PostConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const post = req.post;
  const requesterId = req.requesterId;
  await Post.findByIdAndUpdate(post._id, {
    $push: { clicks: requesterId },
  });

  res
    .status(STATUS_CODES.success.OK)
    .json(jsend("success", undefined, `clicked on post ${post.title}`));
  return;
}
async function readPost(
  req: PostConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const post = req.post;
  const requesterId = req.requesterId;
  await Post.findByIdAndUpdate(post._id, {
    $push: { reads: requesterId },
  });

  res
    .status(STATUS_CODES.success.OK)
    .json(jsend("success", undefined, `readed post ${post.title}`));
  return;
}
async function unpraisePost(
  req: PostConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const post = req.post;
  const requesterId = req.requesterId;
  await Post.findByIdAndUpdate(post._id, {
    $pull: { praises: requesterId },
  });
  try {
    await User.findByIdAndUpdate(requesterId, {
      $pull: { praises: post.id },
    });
    res
      .status(STATUS_CODES.success.OK)
      .json(
        jsend("success", undefined, `successfully unpraised ${post.title}`)
      );
    return;
  } catch (err) {
    await Post.findByIdAndUpdate(post._id, {
      $push: { praises: requesterId },
    });
    next(
      new CustomError(
        `failed to unpraise ${post.title}!`,
        STATUS_CODES.serverError.Internal_Server_Error
      )
    );
  }
}
async function addToBookmarks(
  req: PostConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const post = req.post;
  const requesterId = req.requesterId;
  await Post.findByIdAndUpdate(post._id, {
    $push: { bookmarkedBy: requesterId },
  });
  try {
    await User.findByIdAndUpdate(requesterId, {
      $push: { bookmarks: post.id },
    });
    res
      .status(STATUS_CODES.success.OK)
      .json(
        jsend("success", undefined, `successfully bookmarked ${post.title}`)
      );
    return;
  } catch (err) {
    await Post.findByIdAndUpdate(post._id, {
      $pull: { bookmarkedBy: requesterId },
    });
    next(
      new CustomError(
        `failed to bookmark ${post.title}!`,
        STATUS_CODES.serverError.Internal_Server_Error
      )
    );
  }
}
async function removeFromBookmarks(
  req: PostConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const post = req.post;
  const requesterId = req.requesterId;
  await Post.findByIdAndUpdate(post._id, {
    $pull: { bookmarkedBy: requesterId },
  });
  try {
    await User.findByIdAndUpdate(requesterId, {
      $pull: { bookmarks: post.id },
    });
    res
      .status(STATUS_CODES.success.OK)
      .json(
        jsend(
          "success",
          undefined,
          `successfully removed bookmarked ${post.title}!`
        )
      );
    return;
  } catch (err) {
    await Post.findByIdAndUpdate(post._id, {
      $push: { bookmarkedBy: requesterId },
    });
    next(
      new CustomError(
        `failed to remove bookmark ${post.title}!`,
        STATUS_CODES.serverError.Internal_Server_Error
      )
    );
  }
}

async function addPaywall(
  req: PostConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const body = req.body;
  const sentKeys = Object.keys(body);
  const allowedKeys = ["paywallFee", "paywalledUsers"];
  if (!validateObjectKeys(sentKeys, allowedKeys))
    return next(
      new CustomError(
        "invalid keys sent!",
        STATUS_CODES.clientError.Bad_Request
      )
    );
  await Post.findByIdAndUpdate(req.params.id, body, {
    runValidators: true,
  });

  res
    .status(STATUS_CODES.success.OK)
    .json(jsend("success", undefined, "post paywall settings updated!"));
}
async function getLikes(...args: [PostConfirmRequest, Response, NextFunction]) {
  const [req, , next] = args;
  req.query.praises = req.query.userId || req.requesterId;
  next();
}
async function getUserPost(
  ...args: [PostConfirmRequest, Response, NextFunction]
) {
  const [req, , next] = args;
  const id = req.query.userId || req.requesterId;
  req.query.author = new Types.ObjectId(id as string) as any;
  next();
}
async function getBookmarks(
  ...args: [PostConfirmRequest, Response, NextFunction]
) {
  const [req, , next] = args;
  req.query.bookmarkedBy = new Types.ObjectId(req.requesterId) as any;
  next();
}
async function isRequestersPost(
  ...args: [PostConfirmRequest, Response, NextFunction]
) {
  const [req, , next] = args;
  const postId = req.body.id || req.params.id;
  const post = await Post.findById(postId).select("author");
  if (post?.author?.toString() !== req.requesterId) {
    next(
      new CustomError(
        "cannot query another users post!",
        STATUS_CODES.clientError.Bad_Request
      )
    );
    return;
  }
  next();
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
};

export default wrapModuleFunctionsInAsyncErrorHandler(postExports);
