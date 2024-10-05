import mongoose, { ObjectId } from "mongoose";
import { Document } from "mongoose";

interface ICatgories extends Document {
  createdAt: Date;
  updatedAt: Date;
  name: string;
  usage: number;
}

const categorySchema = new mongoose.Schema<ICatgories>(
  {
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

categorySchema.pre(/find/, function (next) {
  //@ts-ignore
  this.find().select("-__v");
  next();
});

const Category =
  mongoose.models.comments || mongoose.model("categories", categorySchema);

export default Category;
