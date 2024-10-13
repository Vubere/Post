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
const open_1 = __importDefault(require("../controllers/open"));
const custom_error_1 = __importDefault(require("../lib/utils/custom-error"));
const utils_1 = require("../lib/utils");
const post_1 = __importDefault(require("../models/post"));
const { getPostsPopular, getPost, getTopUsers } = open_1.default;
const router = express_1.default.Router();
router.param("id", (req, res, next, value) => __awaiter(void 0, void 0, void 0, function* () {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        return next(new custom_error_1.default(`invalid id`, utils_1.STATUS_CODES.clientError.Bad_Request));
    }
    const post = yield post_1.default.findById(value);
    if (!post) {
        next(new custom_error_1.default(`post not found`, utils_1.STATUS_CODES.clientError.Not_Found));
    }
    req.post = post;
    next();
}));
router.route("/top-post").get(getPostsPopular);
router.route("/top-users").get(getTopUsers);
router.route("/posts/:id").get(getPost);
exports.default = router;
