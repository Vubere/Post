import express, { NextFunction, Response } from "express";
import blogControllers from "../controllers/post";
import authControllers from "../controllers/auth";
import Post from "../models/post";
import CustomError from "../lib/utils/custom-error";
import { BlogConfirmRequest } from "../lib/types";
import { STATUS_CODES } from "../lib/utils";

const {
  createBlog,
  getAllPosts,
  updateBlog,
  getBlog,
  deleteBlog,
  praiseBlog,
  unpraiseBlog,
  getUserPost,
  addPaywall,
  getLikes,
  isRequestersBlog,
  getBookmarks,
  addToBookmarks,
  removeFromBookmarks,
  getPostFromFollowings,
  viewBlog,
  clickBlog,
  readBlog,
} = blogControllers;
const router = express.Router();

//this is a param middleware used to target param(:id) values and this would only execute for the id param, can be used to check for presence of a user before resolving a get,post,delete or patch request
router.param(
  "id",
  async (req: BlogConfirmRequest, res: Response, next, value) => {
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

router.route("/paywall").post(isRequestersBlog, addPaywall);
router.route("/bookmarks").get(getBookmarks, getAllPosts);
router.route("/requester").get(getUserPost, getAllPosts);
router.route("/praises").get(getLikes, getAllPosts);
router.route("/praise/:id").post(praiseBlog).delete(unpraiseBlog);

router.route("/bookmark/:id").post(addToBookmarks).delete(removeFromBookmarks);

router.route("/click/:id").post(clickBlog);
router.route("/view/:id").post(viewBlog);
router.route("/read/:id").post(readBlog);

router
  .route("/")
  .get(function (...args: [BlogConfirmRequest, Response, NextFunction]) {
    const [req, , next] = args;
    next();
  }, getAllPosts)
  .post(createBlog);
router
  .route("/feed")
  .get(function (...args: [BlogConfirmRequest, Response, NextFunction]) {
    const [req, , next] = args;
    next();
  }, getAllPosts);
router
  .route("/interest")
  .get(function (...args: [BlogConfirmRequest, Response, NextFunction]) {
    const [req, , next] = args;
    next();
  }, getAllPosts);
router
  .route("/popular")
  .get(function (...args: [BlogConfirmRequest, Response, NextFunction]) {
    const [req, , next] = args;
    next();
  }, getAllPosts);
router.route("/following").get(getPostFromFollowings);

router
  .route("/:id")
  .patch(isRequestersBlog, updateBlog)
  .get(getBlog)
  .delete(authControllers.AuthenticatePassword, isRequestersBlog, deleteBlog);

export default router;
