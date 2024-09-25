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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const utils_1 = require("../lib/utils");
const aynsc_error_handler_1 = require("../lib/utils/aynsc-error-handler");
const custom_error_1 = __importDefault(require("../lib/utils/custom-error"));
const token_1 = require("../lib/utils/token");
const helpers_1 = require("../lib/helpers");
function validateRequestBody(body, arrayOfValues) {
    const bodyKeys = Object.keys(body);
    const arr = [];
    for (let value of arrayOfValues) {
        if (!bodyKeys.includes(value)) {
            arr.push(value);
        }
    }
    return arr.length ? arr : true;
}
function SignUp(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const _a = req.body, { confirmPassword } = _a, user = __rest(_a, ["confirmPassword"]);
        const errorVal = validateRequestBody(user, ["dateOfBirth", "password"]);
        if (errorVal !== true) {
            next(new custom_error_1.default(errorVal.join(", ") + " is required!", 400));
            return;
        }
        if (user.password !== confirmPassword) {
            next(new custom_error_1.default("confirm password does not match password!", utils_1.STATUS_CODES.clientError.Bad_Request));
            return;
        }
        user.password = yield (0, helpers_1.hashPassword)(user.password);
        const newUser = yield user_1.default.create(user);
        const token = (0, token_1.signToken)(newUser._id);
        res
            .status(utils_1.STATUS_CODES.success.Created)
            .json((0, utils_1.jsend)("success", newUser, "registration successful!", { token }));
    });
}
function GoogleSignIn(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${req.body.token}`);
        const info = yield response.json();
        const userInfo = {
            email: info.email,
            firstName: info.given_name,
            lastName: info.family_name,
            profilePhoto: info.picture,
            signUpMethod: "google-auth",
        };
        const userCheck = yield user_1.default.findOne({ email: userInfo.email }).select("signUpMethod");
        if (userCheck) {
            if (userCheck.signUpMethod === "google-auth") {
                const userDetails = yield user_1.default.findById(userCheck._id);
                const token = (0, token_1.signToken)(userDetails._id);
                res
                    .status(utils_1.STATUS_CODES.success.OK)
                    .json((0, utils_1.jsend)("success", userDetails, "login successful!", { token }));
            }
            else {
                next(new custom_error_1.default("user signed up using form", 400));
            }
        }
        else {
            const newUser = yield user_1.default.create(userInfo);
            const token = (0, token_1.signToken)(newUser._id);
            res
                .status(utils_1.STATUS_CODES.success.Created)
                .json((0, utils_1.jsend)("success", newUser, "registration successful!", { token }));
        }
    });
}
function Login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!email)
            return next(new custom_error_1.default("email is required!", utils_1.STATUS_CODES.clientError.Bad_Request));
        if (!password)
            return next(new custom_error_1.default("password is required!", utils_1.STATUS_CODES.clientError.Bad_Request));
        const user = yield user_1.default.findOne({ email }).select("password username email firstName lastName signUpMethod");
        if ((user === null || user === void 0 ? void 0 : user.signUpMethod) !== "signup-form") {
            return next(new custom_error_1.default("user signed in with google auth!", utils_1.STATUS_CODES.clientError.Bad_Request));
        }
        if (!user || !(yield user.authenticatePassword(password, user.password))) {
            return next(new custom_error_1.default("invalid email or password", utils_1.STATUS_CODES.clientError.Bad_Request));
        }
        const token = (0, token_1.signToken)(user._id);
        const userDetails = yield user_1.default.findById(user._id);
        res
            .status(utils_1.STATUS_CODES.success.OK)
            .json((0, utils_1.jsend)("success", userDetails, "login successful!", { token }));
    });
}
function AuthenticatePassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_1.default.findById(req.requesterId).select("password");
        if (user &&
            (yield user.authenticatePassword(req.body.password, user.password))) {
            return next();
        }
        return next(new custom_error_1.default("unauthorized", utils_1.STATUS_CODES.clientError.Bad_Request));
    });
}
function ProtectRoutes(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const testToken = req.headers.authorization;
        let token;
        if (typeof testToken === "string" && testToken.startsWith("Bearer")) {
            token = testToken.split(" ")[1];
            let decodedToken = (0, token_1.verifyToken)(token);
            if (typeof decodedToken === "string")
                next(new custom_error_1.default("bearer token not sent!", utils_1.STATUS_CODES.clientError.Unauthorized));
            const user = yield user_1.default.findById(decodedToken.id);
            req.requesterId = decodedToken.id;
            if (!user)
                return next(new custom_error_1.default("user don't exist", utils_1.STATUS_CODES.clientError.Unauthorized));
            if (yield user.isPasswordChanged(decodedToken.iat)) {
                return next(new custom_error_1.default("Password has been changed since last login! login again.", utils_1.STATUS_CODES.clientError.Unauthorized));
            }
            next();
        }
        else {
            next(new custom_error_1.default("bearer token not sent!", utils_1.STATUS_CODES.clientError.Unauthorized));
        }
    });
}
const authExports = {
    SignUp,
    Login,
    ProtectRoutes,
    AuthenticatePassword,
    GoogleSignIn,
};
exports.default = (0, aynsc_error_handler_1.wrapModuleFunctionsInAsyncErrorHandler)(authExports);
