import express, { NextFunction, Response } from "express";
import postControllers from "../controllers/post";
import authControllers from "../controllers/auth";
import Post from "../models/post";
import CustomError from "../lib/utils/custom-error";
import { PostConfirmRequest } from "../lib/types";
import { STATUS_CODES } from "../lib/utils";

const {
  createPost,
  getAllPosts,
  updatePost,
  getPost,
  deletePost,
  praisePost,
  unpraisePost,
  getUserPost,
  addPaywall,
  payPaywallFee,
  getLikes,
  isRequestersPost,
  getBookmarks,
  addToBookmarks,
  removeFromBookmarks,
  viewPost,
  clickPost,
  readPost,
  getCategories,
  getTopCategories,
  getPostsPopular,
  getFollowingPost,
} = postControllers;
const router = express.Router();

//this is a param middleware used to target param(:id) values and this would only execute for the id param, can be used to check for presence of a user before resolving a get,post,delete or patch request
router.param(
  "id",
  async (req: PostConfirmRequest, res: Response, next, value) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      return next(
        new CustomError(`invalid id`, STATUS_CODES.clientError.Bad_Request)
      );
    }
    const post = await Post.findById(value);

    if (!post) {
      next(
        new CustomError(`post not found`, STATUS_CODES.clientError.Not_Found)
      );
    }
    req.post = post;
    next();
  }
);

//multiple middlewares can be chained before calling the maing request

router.route("/paywall").post(isRequestersPost, addPaywall);
router.route("/bookmarks").get(getBookmarks, getAllPosts);
router.route("/requester").get(getUserPost, getAllPosts);
router.route("/praises").get(getLikes, getAllPosts);
router.route("/praise/:id").post(praisePost).delete(unpraisePost);

router.route("/bookmark/:id").post(addToBookmarks).delete(removeFromBookmarks);

router.route("/click/:id").post(clickPost);
router.route("/view/:id").post(viewPost);
router.route("/read/:id").post(readPost);

router
  .route("/")
  .get(function (...args: [PostConfirmRequest, Response, NextFunction]) {
    const [req, , next] = args;
    next();
  }, getAllPosts)
  .post(createPost);
router
  .route("/feed")
  .get(function (...args: [PostConfirmRequest, Response, NextFunction]) {
    const [req, , next] = args;
    if (next) next();
  }, getAllPosts);
router
  .route("/interest")
  .get(function (...args: [PostConfirmRequest, Response, NextFunction]) {
    const [req, , next] = args;
    next();
  }, getAllPosts);
router.route("/popular").get(getPostsPopular);
router.route("/following").get(getFollowingPost);
router.route("/categories").get(getCategories);
router.route("/top-categories").get(getTopCategories);
router.route("/pay-paywall-fee").patch(payPaywallFee);

router
  .route("/:id")
  .patch(isRequestersPost, updatePost)
  .get(getPost)
  .delete(isRequestersPost, deletePost);

export default router;
