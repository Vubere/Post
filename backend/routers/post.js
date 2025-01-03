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
const post_1 = __importDefault(require("../controllers/post"));
const post_2 = __importDefault(require("../models/post"));
const custom_error_1 = __importDefault(require("../lib/utils/custom-error"));
const utils_1 = require("../lib/utils");
const { createPost, getAllPosts, updatePost, getPost, deletePost, praisePost, unpraisePost, getUserPost, addPaywall, payPaywallFee, getLikes, isRequestersPost, getBookmarks, addToBookmarks, removeFromBookmarks, viewPost, clickPost, readPost, getCategories, getTopCategories, getPostsPopular, getFollowingPost, } = post_1.default;
const router = express_1.default.Router();
router.param("id", (req, res, next, value) => __awaiter(void 0, void 0, void 0, function* () {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        return next(new custom_error_1.default(`invalid id`, utils_1.STATUS_CODES.clientError.Bad_Request));
    }
    const post = yield post_2.default.findById(value);
    if (!post) {
        next(new custom_error_1.default(`post not found`, utils_1.STATUS_CODES.clientError.Not_Found));
    }
    req.post = post;
    next();
}));
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
    .get(function (...args) {
    const [req, , next] = args;
    next();
}, getAllPosts)
    .post(createPost);
router
    .route("/feed")
    .get(function (...args) {
    const [req, , next] = args;
    if (next)
        next();
}, getAllPosts);
router
    .route("/interest")
    .get(function (...args) {
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
exports.default = router;
