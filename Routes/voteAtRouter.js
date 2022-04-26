const express = require("express");
const res = require("express/lib/response");
const router = express.Router();

//retrieve pollid
router.get("/pollId", (req, res) => {
  res.json(req.cookies.pollId);
});

//create pollId cookie
router.get("/add/:pollId", (req, res) => {
  res
    .cookie("pollId", req.params.pollId, { expire: 600000 + Date.now() })
    .redirect("https://www.pollroll.net");
});

//clear pollId cookie
router.get("/clear", (req, res) => {
  res.clearCookie("pollId").sendStatus(204);
});

module.exports = router;
