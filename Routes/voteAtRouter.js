const express = require("express");
const res = require("express/lib/response");
const router = express.Router();

router.get("/pollId", (req, res) => {
  res.json(res.cookies("pollId"));
});

router.get("/add/:pollId", (req, res) => {
  res
    .cookie("pollId", req.params.pollId, { expire: 600000 + Date.now() })
    .redirect("https://www.pollroll.net");
});

router.get("/clear", (req, res) => {
  res.clearCookie("pollId").sendStatus(204);
});

module.exports = router;
