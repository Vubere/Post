import express, { NextFunction, Response } from "express";
import userControllers from "../controllers/user";
import authControllers from "../controllers/auth";
import { UserConfirmRequest } from "../lib/types";
import { asyncErrorHandlerIds } from "../lib/utils/aynsc-error-handler";
import User from "../models/user";
import CustomError from "../lib/utils/custom-error";
import { STATUS_CODES } from "../lib/utils";

const {
  getAllUsers,
  getUser,
  updateUser,
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
} = userControllers;
const router = express.Router();

router
  .route("/")
  .get(function (...args: [UserConfirmRequest, Response, NextFunction]) {
    const [req, , next] = args;
    req.query._id = { $ne: req.requesterId };
    next();
  }, getAllUsers);

const idIdentifier = asyncErrorHandlerIds(
  async (
    req: UserConfirmRequest,
    res: Response,
    next: NextFunction,
    value: any
  ) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      return next(
        new CustomError(`invalid id`, STATUS_CODES.clientError.Bad_Request)
      );
    }
    const user = await User.findById(value);
    if (!user) {
      next(
        new CustomError(`User not found`, STATUS_CODES.clientError.Not_Found)
      );
    }
    req.user = user;
    next();
  }
);
router.param("id", idIdentifier);

router.route("/subscribers").get(getSubscribers, getAllUsers);
router.route("/update-privacy").patch(updatePrivacySettings);
router.route("/update-interest").patch(updateInterest);
router.route("/sections").patch(updateSections);
router.route("/profile").get(getProfile);
router
  .route("/update-password")
  .patch(authControllers.AuthenticatePassword, updateUserPassword);

router.route("/analytics").get(getUserAnalytics);
router.route("/blocked-users").get(getBlockedUsers, getAllUsers);
router.route("/followers").get(getFollowers, getAllUsers);
router.route("/subscriptions").get(getSubscriptions, getAllUsers);

router.route("/unblock/:id").post(unblockUser);
router.route("/block/:id").post(blockUser);

router.route("/view-profile/:id").post(viewProfile);
router.route("/follow/:id").post(followUser);
router.route("/following").get(getFollowing, getAllUsers);
router.route("/unfollow/:id").post(unfollowUser);

router.route("/subscribe/:id").post(subscribe);
router.route("/unsubscribe/:id").post(unsubscribe);

router
  .route("/:id")
  .patch(updateUser)
  .get(getUser)
  .delete(authControllers.AuthenticatePassword, deleteUser);

export default router;
