import express, { Response, Request, NextFunction } from "express";

const router = express.Router();

//this is a param middleware used to target param(:id) values and this would only execute for the id param, can be used to check for presence of a user before resolving a delete or patch request
router.param("id", (req, res, next, value) => {
  next();
});

//multiple middlewares can be chained before calling the maing request

router.route("/").post(
  (req, res, next) => {
    next();
  },
  (req, res, next) => {
    next();
  },
  (req, res) => {
    console.log("here");
    res.send("here");
  }
);
