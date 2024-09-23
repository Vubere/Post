import express, { NextFunction, Response } from "express";
import commentController from "../controllers/comment";
import authControllers from "../controllers/auth";
import Comment from "../models/comment";
import CustomError from "../lib/utils/custom-error";
import { CommentConfirmRequest } from "../lib/types";
import { STATUS_CODES } from "../lib/utils";

const {
  comment,
  getPostComments,
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
} = commentController;
const router = express.Router();

//this is a param middleware used to target param(:id) values and this would only execute for the id param, can be used to check for presence of a user before resolving a get,post,delete or patch request
router.param(
  "id",
  async (req: CommentConfirmRequest, res: Response, next, value) => {
    const comment = await Comment.findById(value);

    if (!comment) {
      next(
        new CustomError(`comment not found`, STATUS_CODES.clientError.Not_Found)
      );
    }
    req.comment = comment;
    next();
  }
);

//multiple middlewares can be chained before calling the maing request

router.route("/bookmarks").get(getBookmarks, getPostComments);
router.route("/praises").get(getLikes, getPostComments);
router.route("/praise/:id").post(praiseComment).delete(unpraiseComment);

router.route("/bookmark/:id").post(addToBookmarks).delete(removeFromBookmarks);

router.route("/click/:id").post(clickComment);
router.route("/view/:id").post(viewComment);
router.route("/read/:id").post(readComment);
router.route("/reply/:id").post(replyComment);

router
  .route("/")
  .get(function (...args: [CommentConfirmRequest, Response, NextFunction]) {
    const [req, , next] = args;
    next();
  }, getPostComments)
  .post(comment);

router
  .route("/:id")
  .patch(isRequestersComment, updateComment)
  .get(getComment)
  .delete(
    authControllers.AuthenticatePassword,
    isRequestersComment,
    deleteComment
  );

export default router;
