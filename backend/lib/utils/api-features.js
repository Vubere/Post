"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiFeaturesAggregation = void 0;
const lodash_1 = require("lodash");
class ApiFeatures {
    constructor(query, queryItem) {
        this.queryItem = null;
        this.query = null;
        this.queryStr = null;
        this.query = query;
        this.queryItem = queryItem;
        this.queryStr = JSON.stringify(queryItem);
    }
    filter() {
        let queryStr = JSON.stringify(this.queryItem);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => {
            return `$${match}`;
        });
        const queryObj = (0, lodash_1.omit)(JSON.parse(queryStr), [
            "sort",
            "fields",
            "page",
            "limit",
        ]);
        if (this.query) {
            this.query = this.query.find(queryObj);
        }
        return this;
    }
    sort() {
        var _a;
        if (((_a = this.queryItem) === null || _a === void 0 ? void 0 : _a.sort) && this.query) {
            const sortBy = this.queryItem.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
        }
        else if (this.query) {
            this.query = this.query.sort("createdAt");
        }
        return this;
    }
    limitFields() {
        var _a;
        if (((_a = this.queryItem) === null || _a === void 0 ? void 0 : _a.fields) && this.query) {
            const fields = this.queryItem.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        }
        else if (this.query) {
            this.query = this.query.select("-__v");
        }
        return this;
    }
    pagination() {
        var _a;
        if (this.queryItem && this.query) {
            const page = Number((_a = this.queryItem) === null || _a === void 0 ? void 0 : _a.page)
                ? Number(this.queryItem.page)
                : 1;
            const limit = Number(this.queryItem.limit)
                ? Number(this.queryItem.limit)
                : 10;
            const skip = (page - 1) * limit;
            this.query = this.query.skip(skip).limit(limit);
        }
        return this;
    }
}
class ApiFeaturesAggregation {
    constructor(lookup, model, queryItem, unwind, lookupQuery) {
        this.queryItem = null;
        this.model = null;
        this.queryStr = null;
        this.unwind = null;
        this.lookup = null;
        this.lookupQuery = null;
        this.lookup = lookup;
        this.unwind = unwind || null;
        this.model = model;
        this.queryItem = queryItem;
        this.queryStr = JSON.stringify(queryItem || {});
        this.lookupQuery = lookupQuery || null;
    }
    aggregate() {
        var _a, _b, _c;
        const aggregateArray = [];
        if (this.lookup === null) {
            throw new Error("document to lookup not passed!");
        }
        if (this.lookup) {
            if (Array.isArray(this.lookup)) {
                this.lookup.map((lu) => aggregateArray.push({ $lookup: lu }));
            }
            else {
                aggregateArray.push({ $lookup: this.lookup });
            }
        }
        if (this.unwind) {
            if (Array.isArray(this.unwind)) {
                this.unwind.map((lu) => aggregateArray.push({ $unwind: lu }));
            }
            else {
                aggregateArray.push({ $unwind: this.unwind });
            }
        }
        aggregateArray.push({
            $sort: {
                [((_a = this.queryItem) === null || _a === void 0 ? void 0 : _a.sort) || "createdAt"]: ((_b = this.queryItem) === null || _b === void 0 ? void 0 : _b.sortDirection) || -1,
            },
        });
        const filters = this.filter();
        if (!(0, lodash_1.isEmpty)(filters)) {
            aggregateArray.push({
                $match: Object.assign(Object.assign({}, filters), (this.lookupQuery || {})),
            });
        }
        aggregateArray.push({
            $project: this.limitFields(),
        });
        if (this.queryItem && this.model) {
            const page = Number((_c = this.queryItem) === null || _c === void 0 ? void 0 : _c.page)
                ? Number(this.queryItem.page)
                : 1;
            const limit = Number(this.queryItem.limit)
                ? Number(this.queryItem.limit)
                : 10;
            aggregateArray.push({ $skip: (page - 1) * limit });
            aggregateArray.push({ $limit: limit });
        }
        return this.model.aggregate(aggregateArray);
    }
    filter() {
        let queryStr = JSON.stringify(this.queryItem);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => {
            return `$${match}`;
        });
        const queryObj = (0, lodash_1.omit)(this.queryItem, [
            "sort",
            "fields",
            "page",
            "limit",
            "userId",
        ]);
        return queryObj;
    }
    limitFields() {
        var _a;
        if ((_a = this.queryItem) === null || _a === void 0 ? void 0 : _a.fields) {
            const fields = this.queryItem.fields
                .split(",")
                .reduce((acc, curVal) => {
                return (acc[curVal] = 1);
            }, {});
            return fields;
        }
        else {
            return {
                __v: 0,
            };
        }
    }
}
exports.ApiFeaturesAggregation = ApiFeaturesAggregation;
exports.default = ApiFeatures;
