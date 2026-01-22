import express from "express";

const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/profile", function (req, res, next) {
  res.send("user profile page");
});

export default router;
