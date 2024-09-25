"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = _1.STATUS_CODES.serverError.Internal_Server_Error;
        this.status = "error";
        this.isOperational = true;
        this.statusCode = statusCode || this.statusCode;
        this.status =
            this.statusCode >= _1.STATUS_CODES.clientError.Bad_Request &&
                this.statusCode < _1.STATUS_CODES.serverError.Internal_Server_Error
                ? "failed"
                : this.status;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = CustomError;
