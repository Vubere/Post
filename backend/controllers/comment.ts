import { NextFunction, Request, Response } from "express";
import Comment from "../models/comment";
import ApiFeatures, { ApiFeaturesAggregation } from "../lib/utils/api-features";
import {
  STATUS_CODES,
  UPDATABLE_COMMENT_DATA,
  jsend,
  validateObjectKeys,
} from "../lib/utils";
import { wrapModuleFunctionsInAsyncErrorHandler } from "../lib/utils/aynsc-error-handler";
import { CommentConfirmRequest } from "../lib/types";
import CustomError from "../lib/utils/custom-error";
import User from "../models/user";
import Post from "../models/post";
import { Types } from "mongoose";

const commentApiFeatures = (query: Record<any, any>) => {
  return new ApiFeatures(Comment.find(), query);
};
const commentApiFeaturesAggregation = (
  query: Record<any, any>,
  authorQuery?: Record<string, any>
) => {
  return new ApiFeaturesAggregation(
    {
      from: "users",
      localField: "authorId",
      foreignField: "_id",
      as: "authorDetails",
    },
    Comment,
    query,
    "$authorDetails",
    authorQuery
  );
};

async function comment(
  req: CommentConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const newComment = await Comment.create(req.body);
  try {
    await Post.findByIdAndUpdate(req.body.postId, {
      $push: {
        comments: newComment._id,
      },
    });
  } catch (err) {
    console.log(err);
  }
  res
    .status(STATUS_CODES.success.Created)
    .json(jsend("success", newComment, "comment posted successful!"));
}
async function replyComment(
  req: CommentConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const commentId = req.body.commentRepliedTo;
  if (!commentId)
    return next(
      new CustomError("failed to pass the comment being replied to!", 400)
    );
  const newComment = await Comment.create(req.body);
  await Comment.findByIdAndUpdate(commentId, {
    $push: {
      replies: newComment._id,
    },
  });

  res
    .status(STATUS_CODES.success.Created)
    .json(jsend("success", newComment, "comment posted successful!"));
}
async function getPostComments(
  req: CommentConfirmRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.query.postId)
    return next(new CustomError("field postId is missing", 400));
  else req.query.postId = new Types.ObjectId(req.query.postId as string) as any;

  const commentQuery = commentApiFeaturesAggregation(req.query, {}).aggregate();

  const comment = await commentQuery;
  res.status(STATUS_CODES.success.OK).json(
    jsend("success!", comment, "successfully fetched comments!", {
      count: comment.length,
    })
  );
}
async function getCommentReplies(
  req: CommentConfirmRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.query.commentRepliedTo)
    return next(new CustomError("field commentRepliedTo is missing", 400));

  const commentQuery = commentApiFeaturesAggregation(req.query, {}).aggregate();

  const comment = await commentQuery;
  res.status(STATUS_CODES.success.OK).json(
    jsend("success!", comment, "successfully fetched comments!", {
      count: comment.length,
    })
  );
}
async function getComment(req: CommentConfirmRequest, res: Response) {
  const comment = await Comment.findById(req.comment?.id);
  res
    .status(STATUS_CODES.success.OK)
    .json(jsend("success", comment, "comment fetched successfully!"));
}
async function deleteComment(req: CommentConfirmRequest, res: Response) {
  if (req.params.id === req.comment.id) {
    await Comment.findByIdAndDelete(req.comment._id);
    await Post.findByIdAndUpdate(req.comment.postId, {
      $pull: { comments: req.comment.id },
    });

    res.status(204).json(jsend("success", undefined, "comment deleted!"));
  }
}

function validateUpdateRequestBody(body: Record<string, any>) {
  const dataKeys = Object.keys(body);
  for (let value of dataKeys) {
    if (!UPDATABLE_COMMENT_DATA.includes(value)) {
      return value;
    }
  }
  return true;
}
async function updateComment(
  req: CommentConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const comment = await Comment.findById(req.comment._id);
  if (comment !== null) {
    const commentDataToUpdate = req.body;
    const validated = validateUpdateRequestBody(commentDataToUpdate);
    if (typeof commentDataToUpdate !== "object") {
      next(
        new CustomError(
          "invalid comment body sent!",
          STATUS_CODES.clientError.Bad_Request
        )
      );
      return;
    }
    if (validated !== true) {
      next(
        new CustomError(
          `invalid comment body sent! ${validated} can not be updated on comment details!`,
          STATUS_CODES.clientError.Bad_Request
        )
      );
      return;
    }

    const postDetails = await Comment.findByIdAndUpdate(
      req.comment._id,
      commentDataToUpdate,
      {
        runValidators: true,
      }
    );

    res
      .status(STATUS_CODES.success.OK)
      .json(jsend("success!", postDetails, "comment updated successfully"));
    return;
  }
  next(
    new CustomError("comment not found", STATUS_CODES.clientError.Not_Found)
  );
}

async function praiseComment(
  req: CommentConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const comment = req.comment;
  const requesterId = req.requesterId;
  await Comment.findByIdAndUpdate(comment._id, {
    $push: { praises: requesterId },
  });
  try {
    await User.findByIdAndUpdate(requesterId, {
      $push: { praises: comment.id },
    });
    res
      .status(STATUS_CODES.success.OK)
      .json(
        jsend("success", undefined, `successfully praised ${comment.title}`)
      );
    return;
  } catch (err) {
    await Comment.findByIdAndUpdate(comment._id, {
      $pull: { praises: requesterId },
    });
    next(
      new CustomError(
        `failed to praise ${comment.title}!`,
        STATUS_CODES.serverError.Internal_Server_Error
      )
    );
  }
}
async function viewComment(
  req: CommentConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const comment = req.comment;
  const requesterId = req.requesterId;
  await Comment.findByIdAndUpdate(comment._id, {
    $push: { views: requesterId },
  });

  res
    .status(STATUS_CODES.success.OK)
    .json(jsend("success", undefined, `viewed comment ${comment.title}`));
  return;
}
async function clickComment(
  req: CommentConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const comment = req.comment;
  const requesterId = req.requesterId;
  await Comment.findByIdAndUpdate(comment._id, {
    $push: { clicks: requesterId },
  });

  res
    .status(STATUS_CODES.success.OK)
    .json(jsend("success", undefined, `clicked on comment ${comment.title}`));
  return;
}
async function readComment(
  req: CommentConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const comment = req.comment;
  const requesterId = req.requesterId;
  await Comment.findByIdAndUpdate(comment._id, {
    $push: { reads: requesterId },
  });

  res
    .status(STATUS_CODES.success.OK)
    .json(jsend("success", undefined, `read comment ${comment.title}`));
  return;
}
async function unpraiseComment(
  req: CommentConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const comment = req.comment;
  const requesterId = req.requesterId;
  await Comment.findByIdAndUpdate(comment._id, {
    $pull: { praises: requesterId },
  });
  try {
    await User.findByIdAndUpdate(requesterId, {
      $pull: { praises: comment.id },
    });
    res
      .status(STATUS_CODES.success.OK)
      .json(
        jsend("success", undefined, `successfully unpraised ${comment.title}`)
      );
    return;
  } catch (err) {
    await Comment.findByIdAndUpdate(comment._id, {
      $push: { praises: requesterId },
    });
    next(
      new CustomError(
        `failed to unpraise ${comment.title}!`,
        STATUS_CODES.serverError.Internal_Server_Error
      )
    );
  }
}
async function addToBookmarks(
  req: CommentConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const comment = req.comment;
  const requesterId = req.requesterId;
  await Comment.findByIdAndUpdate(comment._id, {
    $push: { bookmarkedBy: requesterId },
  });
  try {
    await User.findByIdAndUpdate(requesterId, {
      $push: { bookmarks: comment.id },
    });
    res
      .status(STATUS_CODES.success.OK)
      .json(
        jsend("success", undefined, `successfully bookmarked ${comment.title}`)
      );
    return;
  } catch (err) {
    await Comment.findByIdAndUpdate(comment._id, {
      $pull: { bookmarkedBy: requesterId },
    });
    next(
      new CustomError(
        `failed to bookmark ${comment.title}!`,
        STATUS_CODES.serverError.Internal_Server_Error
      )
    );
  }
}
async function removeFromBookmarks(
  req: CommentConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const comment = req.comment;
  const requesterId = req.requesterId;
  await Comment.findByIdAndUpdate(comment._id, {
    $pull: { bookmarkedBy: requesterId },
  });
  try {
    await User.findByIdAndUpdate(requesterId, {
      $pull: { bookmarks: comment.id },
    });
    res
      .status(STATUS_CODES.success.OK)
      .json(
        jsend(
          "success",
          undefined,
          `successfully removed bookmarked ${comment.title}!`
        )
      );
    return;
  } catch (err) {
    await Comment.findByIdAndUpdate(comment._id, {
      $push: { bookmarkedBy: requesterId },
    });
    next(
      new CustomError(
        `failed to remove bookmark ${comment.title}!`,
        STATUS_CODES.serverError.Internal_Server_Error
      )
    );
  }
}

async function getLikes(
  ...args: [CommentConfirmRequest, Response, NextFunction]
) {
  const [req, , next] = args;
  req.query.praises = { $in: req.requesterId };
  next();
}
async function getBookmarks(
  ...args: [CommentConfirmRequest, Response, NextFunction]
) {
  const [req, , next] = args;
  req.query.bookmarkedBy = { $in: req.requesterId };
  next();
}

async function isRequestersComment(
  ...args: [CommentConfirmRequest, Response, NextFunction]
) {
  const [req, , next] = args;
  const postId = req.body.id || req.params.id;
  const comment = await Comment.findById(postId).select("authorId");
  if (comment?.authorId !== req.requesterId) {
    next(
      new CustomError(
        "cannot query another users comment!",
        STATUS_CODES.clientError.Bad_Request
      )
    );
    return;
  }
  next();
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

export default wrapModuleFunctionsInAsyncErrorHandler(postExports);
