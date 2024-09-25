"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../lib/utils");
const custom_error_1 = __importDefault(require("../lib/utils/custom-error"));
const devErrors = (res, error) => {
    res.status(error.statusCode).json((0, utils_1.jsend)(error.status, undefined, error.message, {
        stackTrace: error.stack,
        error: error.error,
    }));
};
const prodErrors = (res, error) => {
    if (error.isOperational) {
        res
            .status(error.statusCode)
            .json((0, utils_1.jsend)(error.status, undefined, error.message));
    }
    else {
        if (error.name === "CastError") {
            return generateProdErrors(res, `invalid value for ${error.path}:${error.value}`);
        }
        else if (error.code === 11000) {
            const keys = Object.keys(error.keyValue || {}).join(", ");
            const values = Object.values(error.keyValue || {}).join(", ");
            return generateProdErrors(res, `${keys} must be unique to you. ${values} is already attached to an existing user!`);
        }
        else if (error.name === "ValidationError") {
            const errs = Object.values(error.errors).map((val) => val.message);
            return generateProdErrors(res, errs.join(", "));
        }
        else if (error.name === "TokenExpiredError") {
            return generateProdErrors(res, "login expired!");
        }
        else if (error.name === "JSONWebTokenError") {
            return generateProdErrors(res, "invalid token! login again!");
        }
        res
            .status(utils_1.STATUS_CODES.serverError.Internal_Server_Error)
            .json((0, utils_1.jsend)("error", undefined, "something went wrong"));
    }
};
function generateProdErrors(res, msg, statusCode) {
    return prodErrors(res, new custom_error_1.default(msg, statusCode || utils_1.STATUS_CODES.clientError.Bad_Request));
}
const errorController = (error, req, res, next) => {
    error.statusCode =
        error.statusCode || utils_1.STATUS_CODES.serverError.Internal_Server_Error;
    error.status = error.status || "error";
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === "development") {
        devErrors(res, error);
    }
    else if (process.env.NODE_ENV === "production") {
        prodErrors(res, error);
    }
};
exports.default = errorController;
