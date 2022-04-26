const express = require("express");
const router = express.Router();
const VoteLink = require("../Models/VoteLink");
const ip = require("ip");

//retrieve pollid
router.get("/pollId/:ip", async (req, res) => {
  try {
    const pollId = await VoteLink.findOne({ ipAdd: req.params.ip });

    res.json(pollId);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/add/:pollId", async (req, res) => {
  const newLink = new VoteLink({
    ipAdd: ip.address(),
    pollId: req.params.pollId,
  });

  try {
    const savedLink = await newLink.save();
    res.redirect("https://www.pollroll.net");
  } catch (err) {
    res.json({ message: err });
  }
});

//clear pollId
router.get("/clear/:ip", async (req, res) => {
  const delLink = await VoteLink.deleteOne({ ipAdd: req.params.ip });

  res.sendStatus(204);
});

module.exports = router;
