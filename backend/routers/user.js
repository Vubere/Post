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
const user_1 = __importDefault(require("../controllers/user"));
const auth_1 = __importDefault(require("../controllers/auth"));
const aynsc_error_handler_1 = require("../lib/utils/aynsc-error-handler");
const user_2 = __importDefault(require("../models/user"));
const custom_error_1 = __importDefault(require("../lib/utils/custom-error"));
const utils_1 = require("../lib/utils");
const { getAllUsers, getUser, updateUser, getProfile, deleteUser, updateUserPassword, followUser, unfollowUser, blockUser, unblockUser, updatePrivacySettings, getBlockedUsers, getFollowers, getFollowing, updateInterest, updateSections, viewProfile, getUserAnalytics, getSubscribers, getSubscriptions, subscribe, unsubscribe, } = user_1.default;
const router = express_1.default.Router();
router
    .route("/")
    .get(function (...args) {
    const [req, , next] = args;
    req.query._id = { $ne: req.requesterId };
    next();
}, getAllUsers);
const idIdentifier = (0, aynsc_error_handler_1.asyncErrorHandlerIds)((req, res, next, value) => __awaiter(void 0, void 0, void 0, function* () {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        return next(new custom_error_1.default(`invalid id`, utils_1.STATUS_CODES.clientError.Bad_Request));
    }
    const user = yield user_2.default.findById(value);
    if (!user) {
        next(new custom_error_1.default(`User not found`, utils_1.STATUS_CODES.clientError.Not_Found));
    }
    req.user = user;
    next();
}));
router.param("id", idIdentifier);
router.route("/subscribers").get(getSubscribers, getAllUsers);
router.route("/update-privacy").patch(updatePrivacySettings);
router.route("/update-interest").patch(updateInterest);
router.route("/sections").patch(updateSections);
router.route("/profile").get(getProfile);
router
    .route("/update-password")
    .patch(auth_1.default.AuthenticatePassword, updateUserPassword);
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
    .delete(auth_1.default.AuthenticatePassword, deleteUser);
exports.default = router;
