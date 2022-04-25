const express = require("express");
const res = require("express/lib/response");
const router = express.Router();

router.get("/pollId", (req, res) => {
  res.json(req.cookies.pollId);
});

router.get("/add/:pollId", (req, res) => {
  res.cookie("pollId", req.params.pollId).redirect("https://www.pollroll.net");
});

router.get("/pollId/clear", (req, res) => {
  res.clearCookie("pollId");
});

module.exports = router;
