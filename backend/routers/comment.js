"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comment_1 = __importDefault(require("../controllers/comment"));
const auth_1 = __importDefault(require("../controllers/auth"));
const comment_2 = __importDefault(require("../models/comment"));
const custom_error_1 = __importDefault(require("../lib/utils/custom-error"));
const utils_1 = require("../lib/utils");
const { comment, getPostComments, updateComment, getComment, deleteComment, praiseComment, unpraiseComment, getLikes, isRequestersComment, getBookmarks, addToBookmarks, removeFromBookmarks, viewComment, getCommentReplies, clickComment, replyComment, readComment, } = comment_1.default;
const router = express_1.default.Router();
router.param("id", (req, res, next, value) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comment_2.default.findById(value);
    if (!comment) {
        next(new custom_error_1.default(`comment not found`, utils_1.STATUS_CODES.clientError.Not_Found));
    }
    req.comment = comment;
    next();
}));
router.route("/bookmarks").get(getBookmarks, getPostComments);
router.route("/praises").get(getLikes, getPostComments);
router.route("/praise/:id").post(praiseComment).delete(unpraiseComment);
router.route("/bookmark/:id").post(addToBookmarks).delete(removeFromBookmarks);
router.route("/click/:id").post(clickComment);
router.route("/view/:id").post(viewComment);
router.route("/read/:id").post(readComment);
router.route("/reply/:id").post(replyComment);
router.route("/replies").get(getCommentReplies);
router
    .route("/")
    .get(function (...args) {
    const [req, , next] = args;
    next();
}, getPostComments)
    .post(comment);
router
    .route("/:id")
    .patch(isRequestersComment, updateComment)
    .get(getComment)
    .delete(auth_1.default.AuthenticatePassword, isRequestersComment, deleteComment);
exports.default = router;
