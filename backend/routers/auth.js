"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../controllers/auth"));
const router = express_1.default.Router();
router.route("/sign-up").post(auth_1.default.SignUp);
router.route("/login").post(auth_1.default.Login);
router.route("/google-auth").post(auth_1.default.GoogleSignIn);
exports.default = router;
