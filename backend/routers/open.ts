import express, { NextFunction, Response } from "express";
import openController from "../controllers/open";
import CustomError from "../lib/utils/custom-error";
import { CommentConfirmRequest } from "../lib/types";
import { STATUS_CODES } from "../lib/utils";
import Post from "../models/post";

const { getPostsPopular, getPost } = openController;
const router = express.Router();

//this is a param middleware used to target param(:id) values and this would only execute for the id param, can be used to check for presence of a user before resolving a get,post,delete or patch request
router.param(
  "id",
  async (req: CommentConfirmRequest, res: Response, next, value) => {
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

router.route("/top-post").get(getPostsPopular);
router.route("/:id").get(getPost);
export default router;
