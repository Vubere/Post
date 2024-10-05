"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncErrorHandlerIds = exports.wrapModuleFunctionsInAsyncErrorHandler = void 0;
const asyncErrorHandler = (func) => {
    return function (req, res, next) {
        func(req, res, next).catch((err) => next(err));
    };
};
const asyncErrorHandlerIds = (func) => {
    return function (req, res, next, value) {
        func(req, res, next, value).catch((err) => next(err));
    };
};
exports.asyncErrorHandlerIds = asyncErrorHandlerIds;
const wrapModuleFunctionsInAsyncErrorHandler = (exports) => {
    const valuesHere = Object.values(exports).map((val) => asyncErrorHandler(val));
    const keysHere = Object.keys(exports);
    const transformedexports = {};
    for (let key in valuesHere) {
        transformedexports[keysHere[key]] = valuesHere[key];
    }
    return transformedexports;
};
exports.wrapModuleFunctionsInAsyncErrorHandler = wrapModuleFunctionsInAsyncErrorHandler;
exports.default = asyncErrorHandler;
