import { NextFunction, Request, Response } from "express";
import Comment from "../models/comment";
import ApiFeatures from "../lib/utils/api-features";
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

const commentApiFeatures = (query: Record<any, any>) => {
  return new ApiFeatures(Comment.find(), query);
};

async function comment(
  req: CommentConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const newBlog = await Comment.create(req.body);

  res
    .status(STATUS_CODES.success.Created)
    .json(jsend("success", newBlog, "comment posted successful!"));
}
async function replyComment(
  req: CommentConfirmRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.body.commentRepliedTo)
    return next(
      new CustomError("failed to pass the comment being replied to!", 400)
    );
  const newBlog = await Comment.create(req.body);

  res
    .status(STATUS_CODES.success.Created)
    .json(jsend("success", newBlog, "comment posted successful!"));
}
async function getBlogComments(
  req: CommentConfirmRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.query.blogId)
    return next(new CustomError("field blogId is missing", 400));
  const commentQuery = commentApiFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  const comment = await commentQuery.query;
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
    await Comment.findByIdAndUpdate(
      req.comment._id,
      { active: false },
      { runValidators: true }
    );
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

    const blogDetails = await Comment.findByIdAndUpdate(
      req.comment._id,
      commentDataToUpdate,
      {
        runValidators: true,
      }
    );

    res
      .status(STATUS_CODES.success.OK)
      .json(jsend("success!", blogDetails, "comment updated successfully"));
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
  const blogId = req.body.id || req.params.id;
  const comment = await Comment.findById(blogId).select("authorId");
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

const blogExports = {
  comment,
  getBlogComments,
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

export default wrapModuleFunctionsInAsyncErrorHandler(blogExports);
