import jwt from "jsonwebtoken";

const signToken = (id: any) => {
  return jwt.sign({ id }, process.env.SECRET_KEY || "", {
    expiresIn: "8d",
  });
};
const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.SECRET_KEY || "");
};
export { signToken, verifyToken };
