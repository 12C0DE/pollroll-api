const express = require("express");
const router = express.Router();
const VoteLink = require("../Models/VoteLink");
const ipaddr = require("ipaddr.js");

//retrieve pollid
router.get("/pollId/:ip", async (req, res) => {
  try {
    let remoteAddress = req.params.ip;
    if (ipaddr.isValid(req.ip)) {
      remoteAddress = ipaddr.process(req.ip).toString();
    }
    const pollId = await VoteLink.findOne({ ipAdd: remoteAddress });

    res.json(pollId);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/add/:pollId", async (req, res) => {
  let remoteAddress = req.ip;

  if (ipaddr.isValid(req.ip)) {
    remoteAddress = ipaddr.process(req.ip).toString();
  } else {
    remoteAddress = "error";
  }
  const newLink = new VoteLink({
    ipAdd: remoteAddress,
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
  let remoteAddress = req.params.ip;

  if (ipaddr.isValid(req.params.ip)) {
    remoteAddress = ipaddr.process(req.params.ip).toString();
  }
  const delLink = await VoteLink.deleteMany({ ipAdd: remoteAddress });

  res.sendStatus(204);
});

module.exports = router;
