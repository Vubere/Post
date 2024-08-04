import { NextFunction, Request, Response } from "express";
import Post from "../models/post";
import ApiFeatures, { ApiFeaturesAggregation } from "../lib/utils/api-features";
import bcrypt from "bcryptjs";
import {
  STATUS_CODES,
  UPDATEABLE_BLOG_DATA,
  jsend,
  validateObjectKeys,
} from "../lib/utils";
import { wrapModuleFunctionsInAsyncErrorHandler } from "../lib/utils/aynsc-error-handler";
import { BlogConfirmRequest } from "../lib/types";
import CustomError from "../lib/utils/custom-error";
import User from "../models/user";

const blogApiFeatures = (query: Record<any, any>) => {
  return new ApiFeatures(Post.find(), query);
};
const blogApiFeaturesAggregation = (
  query: Record<any, any>,
  authorQuery?: Record<string, any>
) => {
  return new ApiFeaturesAggregation(
    {
      from: "users",
      localField: "author",
      foreignField: "_id",
      as: "authorDetails",
    },
    Post,
    query,
    "$authorDetails",
    authorQuery
  );
};

async function createBlog(
  req: BlogConfirmRequest,
  res: Response,
  next: NextFunction
) {
  req.body.author = req.requesterId;
  const newBlog = await Post.create(req.body);

  res
    .status(STATUS_CODES.success.Created)
    .json(jsend("success", newBlog, "post posted successful!"));
}

async function getAllPosts(
  req: BlogConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const blogQuery = blogApiFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  const post = await blogQuery.query;
  res.status(STATUS_CODES.success.OK).json(
    jsend("success!", post, "successfully fetched posts!", {
      count: post.length,
    })
  );
}
async function getPostFromFollowings(
  req: BlogConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const blogQuery = blogApiFeaturesAggregation(req.query, {
    match: {
      authorDetails: {
        $or: [{ followers: req.requesterId }, { _id: req.requesterId }],
      },
    },
  }).aggregate();

  const post = await blogQuery;
  res.status(STATUS_CODES.success.OK).json(
    jsend("success!", post, "successfully fetched posts!", {
      count: post.length,
    })
  );
}
async function getBlog(req: BlogConfirmRequest, res: Response) {
  const post = await Post.findById(req.post?.id)?.populate("author");
  res
    .status(STATUS_CODES.success.OK)
    .json(jsend("success", post, "post fetched successfully!"));
}
async function deleteBlog(req: BlogConfirmRequest, res: Response) {
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
async function updateBlog(
  req: BlogConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const post = await Post.findById(req.post._id);
  if (post !== null) {
    const blogDataToUpdate = req.body;
    const validated = validateUpdateRequestBody(blogDataToUpdate);
    if (typeof blogDataToUpdate !== "object") {
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

    const blogDetails = await Post.findByIdAndUpdate(
      req.post._id,
      blogDataToUpdate,
      {
        runValidators: true,
      }
    );

    res
      .status(STATUS_CODES.success.OK)
      .json(jsend("success!", blogDetails, "post updated successfully"));
    return;
  }
  next(new CustomError("post not found", STATUS_CODES.clientError.Not_Found));
}

async function likeBlog(
  req: BlogConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const post = req.post;
  const requesterId = req.requesterId;
  await Post.findByIdAndUpdate(post._id, {
    $push: { likes: requesterId },
  });
  try {
    await User.findByIdAndUpdate(requesterId, {
      $push: { likes: post.id },
    });
    res
      .status(STATUS_CODES.success.OK)
      .json(jsend("success", undefined, `successfully liked ${post.title}`));
    return;
  } catch (err) {
    await Post.findByIdAndUpdate(post._id, {
      $pull: { likes: requesterId },
    });
    next(
      new CustomError(
        `failed to like ${post.title}!`,
        STATUS_CODES.serverError.Internal_Server_Error
      )
    );
  }
}
async function viewBlog(
  req: BlogConfirmRequest,
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
async function clickBlog(
  req: BlogConfirmRequest,
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
async function readBlog(
  req: BlogConfirmRequest,
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
async function unlikeBlog(
  req: BlogConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const post = req.post;
  const requesterId = req.requesterId;
  await Post.findByIdAndUpdate(post._id, {
    $pull: { likes: requesterId },
  });
  try {
    await User.findByIdAndUpdate(requesterId, {
      $pull: { likes: post.id },
    });
    res
      .status(STATUS_CODES.success.OK)
      .json(jsend("success", undefined, `successfully unliked ${post.title}`));
    return;
  } catch (err) {
    await Post.findByIdAndUpdate(post._id, {
      $push: { likes: requesterId },
    });
    next(
      new CustomError(
        `failed to unlike ${post.title}!`,
        STATUS_CODES.serverError.Internal_Server_Error
      )
    );
  }
}
async function addToBookmarks(
  req: BlogConfirmRequest,
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
  req: BlogConfirmRequest,
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
  req: BlogConfirmRequest,
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
async function getLikes(...args: [BlogConfirmRequest, Response, NextFunction]) {
  const [req, , next] = args;
  req.query.likes = { $in: req.requesterId };
  next();
}
async function getBookmarks(
  ...args: [BlogConfirmRequest, Response, NextFunction]
) {
  const [req, , next] = args;
  req.query.bookmarkedBy = { $in: req.requesterId };
  next();
}
async function isRequestersBlog(
  ...args: [BlogConfirmRequest, Response, NextFunction]
) {
  const [req, , next] = args;
  const blogId = req.body.id || req.params.id;
  const post = await Post.findById(blogId).select("author");
  if (post?.author !== req.requesterId) {
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

const blogExports = {
  createBlog,
  getAllPosts,
  updateBlog,
  getBlog,
  deleteBlog,
  likeBlog,
  unlikeBlog,
  addPaywall,
  getLikes,
  isRequestersBlog,
  getBookmarks,
  addToBookmarks,
  removeFromBookmarks,
  viewBlog,
  clickBlog,
  readBlog,
  getPostFromFollowings,
};

export default wrapModuleFunctionsInAsyncErrorHandler(blogExports);
