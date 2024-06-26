"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUS = exports.jsend = void 0;
const jsend = (status, data, message, extra) => {
    return Object.assign(Object.assign(Object.assign({ status }, (data ? { data } : {})), (message ? { message } : {})), (extra ? extra : {}));
};
exports.jsend = jsend;
const STATUS = {
    success: "success!",
    error: "error",
};
exports.STATUS = STATUS;
