import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import ApiFeatures from "../lib/utils/api-features";
import bcrypt from "bcryptjs";
import {
  STATUS_CODES,
  UPDATEABLE_USER_DATA,
  jsend,
  validateObjectKeys,
} from "../lib/utils";
import {
  asyncErrorHandlerIds,
  wrapModuleFunctionsInAsyncErrorHandler,
} from "../lib/utils/aynsc-error-handler";
import { UserConfirmRequest } from "../lib/types";
import CustomError from "../lib/utils/custom-error";
import { signToken } from "../lib/utils/token";
import { hashPassword } from "../lib/helpers";
import Post from "../models/post";

const UserApiFeatures = (query: Record<any, any>) => {
  return new ApiFeatures(User.find(), query);
};

async function getAllUsers(
  req: UserConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const UserQuery = UserApiFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  const users = await UserQuery.query;
  res.status(STATUS_CODES.success.OK).json(
    jsend("success!", users, "successfully fetched users!", {
      count: users.length,
    })
  );
}
async function getUser(req: UserConfirmRequest, res: Response) {
  const user = req.user;
  res
    .status(STATUS_CODES.success.OK)
    .json(jsend("success", user, "user fetched successfully!"));
}
async function getProfile(req: UserConfirmRequest, res: Response) {
  const user = await User.findById(req.requesterId);
  res
    .status(STATUS_CODES.success.OK)
    .json(jsend("success", user, "user fetched successfully!"));
}
async function deleteUser(req: UserConfirmRequest, res: Response) {
  if (req.params.id === req.user.id) {
    await User.findByIdAndUpdate(
      req.user._id,
      { active: false },
      { runValidators: true }
    );
    res.status(204).json(jsend("success", undefined, "account deleted!"));
  }
}

function validateUpdateRequestBody(body: Record<string, any>) {
  const dataKeys = Object.keys(body);
  for (let value of dataKeys) {
    if (!UPDATEABLE_USER_DATA.includes(value)) {
      return value;
    }
  }
  return true;
}
async function updateUser(
  req: UserConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const user = await User.findById(req.user._id);
  if (user !== null) {
    const userDataToUpdate = req.body;
    const validated = validateUpdateRequestBody(userDataToUpdate);
    if (typeof userDataToUpdate !== "object") {
      next(
        new CustomError(
          "invalid user body sent!",
          STATUS_CODES.clientError.Bad_Request
        )
      );
      return;
    }
    if (validated !== true) {
      next(
        new CustomError(
          `invalid user body sent! ${validated} can not be updated on user details!`,
          STATUS_CODES.clientError.Bad_Request
        )
      );
      return;
    }

    const userDetails = await User.findByIdAndUpdate(
      req.user._id,
      userDataToUpdate,
      {
        runValidators: true,
      }
    );

    const token = signToken(user._id);
    res.status(STATUS_CODES.success.OK).json(
      jsend("success!", userDetails, "user updated successfully", {
        token,
      })
    );
    return;
  }
  next(new CustomError("user not found", STATUS_CODES.clientError.Not_Found));
}
async function updateUserPassword(
  req: UserConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const user = await User.findById(req.requesterId);
  if (req.body.newPassword !== req.body.confirmPassword) {
    next(
      new CustomError(
        "password and confirm password don't match",
        STATUS_CODES.clientError.Bad_Request
      )
    );
  }
  if (user !== null) {
    user.password = await hashPassword(req.body.newPassword);
    user.passwordChangedAt = new Date();
    await user.save();
    const token = signToken(user._id);
    const returnData = {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      id: user._id,
    };
    res.status(STATUS_CODES.success.OK).json(
      jsend("success!", returnData, "password updated successfully!", {
        token,
      })
    );
    return;
  }
  next(new CustomError("user not found", STATUS_CODES.clientError.Not_Found));
}

async function viewProfile(
  req: UserConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const user = req.user;
  const requesterId = req.requesterId;
  await User.findByIdAndUpdate(user._id, {
    $push: { profileViews: requesterId },
  });
  try {
    await User.findByIdAndUpdate(requesterId, {
      $push: { viewedProfiles: user.id },
    });
    res
      .status(STATUS_CODES.success.OK)
      .json(
        jsend("success", undefined, `successfully followed ${user.username}`)
      );
    return;
  } catch (err) {
    await User.findByIdAndUpdate(user._id, {
      $pull: { profileViews: requesterId },
    });
    next(
      new CustomError(
        `failed to follow ${user.username}!`,
        STATUS_CODES.serverError.Internal_Server_Error
      )
    );
  }
}
async function subscribe(
  req: UserConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const user = req.user;
  const requesterId = req.requesterId;
  await User.findByIdAndUpdate(user._id, {
    $push: { subscriptions: requesterId },
  });
  try {
    await User.findByIdAndUpdate(requesterId, {
      $push: { subscribers: user.id },
    });
    res
      .status(STATUS_CODES.success.OK)
      .json(
        jsend("success", undefined, `successfully subscribed ${user.username}`)
      );
    return;
  } catch (err) {
    await User.findByIdAndUpdate(user._id, {
      $pull: { subscriptions: requesterId },
    });
    next(
      new CustomError(
        `failed to subscribe to ${user.username}!`,
        STATUS_CODES.serverError.Internal_Server_Error
      )
    );
  }
}
async function unsubscribe(
  req: UserConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const user = req.user;
  const requesterId = req.requesterId;
  await User.findByIdAndUpdate(user._id, {
    $pull: { subscriptions: requesterId },
  });
  try {
    await User.findByIdAndUpdate(requesterId, {
      $pull: { subscribers: user.id },
    });
    res
      .status(STATUS_CODES.success.OK)
      .json(
        jsend("success", undefined, `successfully unsubscibed ${user.username}`)
      );
    return;
  } catch (err) {
    await User.findByIdAndUpdate(user._id, {
      $push: { subscriptions: requesterId },
    });
    next(
      new CustomError(
        `failed to unsubscribe from ${user.username}!`,
        STATUS_CODES.serverError.Internal_Server_Error
      )
    );
  }
}
async function followUser(
  req: UserConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const user = req.user;
  const requesterId = req.requesterId;
  await User.findByIdAndUpdate(user._id, {
    $push: { followers: requesterId },
  });
  try {
    await User.findByIdAndUpdate(requesterId, {
      $push: { following: user.id },
    });
    res
      .status(STATUS_CODES.success.OK)
      .json(
        jsend("success", undefined, `successfully followed ${user.username}`)
      );
    return;
  } catch (err) {
    await User.findByIdAndUpdate(user._id, {
      $pull: { followers: requesterId },
    });
    next(
      new CustomError(
        `failed to follow ${user.username}!`,
        STATUS_CODES.serverError.Internal_Server_Error
      )
    );
  }
}
async function unfollowUser(
  req: UserConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const user = req.user;
  const requesterId = req.requesterId;
  await User.findByIdAndUpdate(user._id, {
    $pull: { followers: requesterId },
  });
  try {
    await User.findByIdAndUpdate(requesterId, {
      $pull: { following: user.id },
    });
    res
      .status(STATUS_CODES.success.OK)
      .json(
        jsend("success", undefined, `successfully unfollowed ${user.username}`)
      );
    return;
  } catch (err) {
    await User.findByIdAndUpdate(user._id, {
      $push: { followers: requesterId },
    });
    next(
      new CustomError(
        `failed to unfollow ${user.username}!`,
        STATUS_CODES.serverError.Internal_Server_Error
      )
    );
  }
}

async function blockUser(
  req: UserConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const user = req.user;
  const requesterId = req.requesterId;
  await User.findByIdAndUpdate(user._id, {
    $push: { blockedBy: requesterId },
  });
  try {
    await User.findByIdAndUpdate(requesterId, {
      $push: { blocked: user.id },
    });
    res
      .status(STATUS_CODES.success.OK)
      .json(
        jsend("success", undefined, `successfully blocked ${user.username}`)
      );
    return;
  } catch (err) {
    await User.findByIdAndUpdate(user._id, {
      $pull: { blockedBy: requesterId },
    });
    next(
      new CustomError(
        `failed to block ${user.username}!`,
        STATUS_CODES.serverError.Internal_Server_Error
      )
    );
  }
}
async function unblockUser(
  req: UserConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const user = req.user;
  const requesterId = req.requesterId;
  await User.findByIdAndUpdate(user._id, {
    $pull: { blockedBy: requesterId },
  });
  try {
    await User.findByIdAndUpdate(requesterId, {
      $pull: { blocked: user.id },
    });
    res
      .status(STATUS_CODES.success.OK)
      .json(
        jsend("success", undefined, `successfully unblocked ${user.username}`)
      );
    return;
  } catch (err) {
    await User.findByIdAndUpdate(user._id, {
      $push: { blockedBy: requesterId },
    });
    next(
      new CustomError(
        `failed to unblock ${user.username}!`,
        STATUS_CODES.serverError.Internal_Server_Error
      )
    );
  }
}

async function updatePrivacySettings(
  req: UserConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const requesterId = req.requesterId;
  const body = req.body;
  const sentKeys = Object.keys(body);
  const allowedKeys = ["messageAccess", "notificationAccess"];
  if (!validateObjectKeys(sentKeys, allowedKeys))
    return next(
      new CustomError(
        "invalid keys sent!",
        STATUS_CODES.clientError.Bad_Request
      )
    );
  console.log(requesterId);
  await User.findByIdAndUpdate(requesterId, body);

  res
    .status(STATUS_CODES.success.OK)
    .json(jsend("success", undefined, "privacy settings updated!"));
}
async function updateInterest(
  req: UserConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const requesterId = req.requesterId;
  const body = req.body;
  const sentKeys = Object.keys(body);
  const allowedKeys = ["interest"];
  if (!validateObjectKeys(sentKeys, allowedKeys))
    return next(
      new CustomError(
        "invalid keys sent!",
        STATUS_CODES.clientError.Bad_Request
      )
    );
  await User.findByIdAndUpdate(requesterId, body);

  res
    .status(STATUS_CODES.success.OK)
    .json(jsend("success", undefined, "privacy settings updated!"));
}
async function updateSections(
  req: UserConfirmRequest,
  res: Response,
  next: NextFunction
) {
  const body = req.body;
  const sentKeys = Object.keys(body);
  const allowedKeys = ["profileSections"];
  if (!validateObjectKeys(sentKeys, allowedKeys))
    return next(
      new CustomError(
        "invalid keys sent!",
        STATUS_CODES.clientError.Bad_Request
      )
    );
  await User.findByIdAndUpdate(req.requesterId, body);

  res
    .status(STATUS_CODES.success.OK)
    .json(jsend("success", undefined, "profile sections updated!"));
}
async function getBlockedUsers(
  ...args: [UserConfirmRequest, Response, NextFunction]
) {
  const [req, , next] = args;
  req.query.blockedBy = { $in: req.requesterId };
  next();
}
async function getFollowing(
  ...args: [UserConfirmRequest, Response, NextFunction]
) {
  const [req, , next] = args;
  const userId = req.query.userId || req.requesterId;
  if (req.query.userId) delete req.query["userId"];
  req.query.followers = { $in: [userId as string] };
  next();
}
async function getFollowers(
  ...args: [UserConfirmRequest, Response, NextFunction]
) {
  const [req, , next] = args;
  const userId = req.query.userId || req.requesterId;
  if (req.query.userId) delete req.query["userId"];

  req.query.following = { $in: userId as string };
  next();
}
async function getSubscribers(
  ...args: [UserConfirmRequest, Response, NextFunction]
) {
  const [req, , next] = args;
  const userId = req.query.userId || req.requesterId;
  if (req.query.userId) delete req.query["userId"];

  req.query.subscriptions = { $in: [userId as string] };
  next();
}
async function getSubscriptions(
  ...args: [UserConfirmRequest, Response, NextFunction]
) {
  const [req, , next] = args;
  const userId = req.query.userId || req.requesterId;
  if (req.query.userId) delete req.query["userId"];
  req.query.subscribers = { $in: [userId as string] };
  next();
}

async function getUserAnalytics(
  ...args: [UserConfirmRequest, Response, NextFunction]
) {
  const [req, res, next] = args;
  const fields =
    "praises posts profileViews followers following subscribers subscribed bookmarks viewedProfiles";
  const userId = req.query.userId || req.requesterId;
  if (req.query.userId) delete req.query["userId"];

  const user = await User.findById(userId as string).select(fields);
  const post = await Post.aggregate([
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
    userPostAnalytics: post?.[0] || {},
  };
  res
    .status(STATUS_CODES.success.OK)
    .json(jsend("success", analytics, "user analytics compiled successfully!"));
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
export default wrapModuleFunctionsInAsyncErrorHandler(userExports);
