import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
import app from "./app";

const port = process.env.PORT;
const mongodbConStr = process.env.MONGODB_CONNECTION || "localhost:8080";

mongoose.connect(mongodbConStr).then((con) => {
  console.log(con);
  console.log("db connection successful!");
});

app.listen(port, () => {
  console.log("server has started!");
});
