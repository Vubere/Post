import { isEmpty, omit } from "lodash";
import { Query } from "mongoose";
export type Lookup = {
  from: string;
  localField: string;
  foreignField: string;
  as: string;
};

class ApiFeatures {
  queryItem: Record<string, any> | null = null;
  query: Query<any, any, any> | null = null;
  queryStr: string | null = null;
  constructor(query: any, queryItem: any) {
    this.query = query;
    this.queryItem = queryItem;
    this.queryStr = JSON.stringify(queryItem);
  }
  filter() {
    let queryStr = JSON.stringify(this.queryItem);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => {
      return `$${match}`;
    });

    const queryObj = omit(JSON.parse(queryStr), [
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
    if (this.queryItem?.sort && this.query) {
      const sortBy = this.queryItem.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else if (this.query) {
      this.query = this.query.sort("createdAt");
    }
    return this;
  }
  limitFields() {
    if (this.queryItem?.fields && this.query) {
      const fields = this.queryItem.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else if (this.query) {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  pagination() {
    if (this.queryItem && this.query) {
      const page = Number(this.queryItem?.page)
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
  queryItem: Record<string, any> | null = null;
  model: any | null = null;
  queryStr: string | null = null;
  unwind: string | null = null;
  lookup: Lookup | null = null;
  lookupQuery: Record<string, any> | null = null;
  constructor(
    lookup: Lookup,
    model: any,
    queryItem: any,
    unwind?: string,
    lookupQuery?: Record<string, any>
  ) {
    this.lookup = lookup;
    this.unwind = unwind || null;
    this.model = model;
    this.queryItem = queryItem;
    this.queryStr = JSON.stringify(queryItem || {});
    this.lookupQuery = lookupQuery || null;
  }
  aggregate() {
    const aggregateArray: Record<string, any>[] = [];
    if (this.lookup === null) {
      throw new Error("document to lookup not passed!");
    }
    aggregateArray.push({ $lookup: this.lookup });
    if (this.unwind) {
      aggregateArray.push({ $unwind: this.unwind });
    }

    aggregateArray.push({
      $sort: {
        [this.queryItem?.sort || "createdAt"]:
          this.queryItem?.sortDirection || -1,
      },
    });
    const filters = this.filter();
    if (!isEmpty(filters)) {
      aggregateArray.push({
        $match: { ...filters, ...(this.lookupQuery || {}) },
      });
    }
    aggregateArray.push({
      $project: this.limitFields(),
    });
    if (this.queryItem && this.model) {
      const page = Number(this.queryItem?.page)
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

    const queryObj = omit(this.queryItem, ["sort", "fields", "page", "limit"]);

    queryObj.status =
      queryObj.status !== undefined && !isNaN(+queryObj.status)
        ? Number(queryObj.status)
        : 1;

    return queryObj;
  }
  limitFields() {
    if (this.queryItem?.fields) {
      const fields = this.queryItem.fields
        .split(",")
        .reduce((acc: Record<string, number>, curVal: string) => {
          return (acc[curVal] = 1);
        }, {});
      return fields;
    } else {
      return {
        __v: 0,
      };
    }
  }
}

export default ApiFeatures;
export { ApiFeaturesAggregation };
