import express from "express";
import auth from "../controllers/auth";

const router = express.Router();

router.route("/sign-up").post(auth.SignUp);
router.route("/login").post(auth.Login);

export default router;
