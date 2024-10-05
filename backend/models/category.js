"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
    name: {
        type: String,
        required: [true, "name is required!"],
        unique: true,
    },
    usage: {
        type: Number,
        default: 0,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
categorySchema.pre(/find/, function (next) {
    this.find().select("-__v");
    next();
});
const Category = mongoose_1.default.models.comments || mongoose_1.default.model("categories", categorySchema);
exports.default = Category;
