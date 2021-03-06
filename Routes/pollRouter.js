const express = require("express");
const router = express.Router();
const Poll = require("../Models/Poll");
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.REACT_APP_PUSHER_APP_ID,
  key: process.env.REACT_APP_PUSHER_KEY,
  secret: process.env.REACT_APP_PUSHER_SECRET,
  cluster: process.env.REACT_APP_PUSHER_CLUSTER,
  useTLS: true,
});

router.get("/", async (req, res) => {
  try {
    const polls = await Poll.find();
    res.json(polls);
  } catch (err) {
    res.json({ message: err });
  }
});

//retrieve poll names that user OWNS
router.get("/pollnames/:authId", async (req, res) => {
  try {
    const pollNames = await Poll.find({ authId: req.params.authId }).select([
      "pollName",
      "pollKind",
    ]);
    res.json(pollNames);
  } catch (err) {
    res.json({ message: err });
  }
});

//retrieve poll names that user JUST votes in
router.get("/pollnames/:authId/:uid", async (req, res) => {
  try {
    const pollNames = await Poll.find({
      authId: { $nin: req.params.authId },
      $or: [
        { "pollOptions.votes": req.params.uid },
        { "pollOptions.votes.F": req.params.uid },
        { "pollOptions.votes.T": req.params.uid },
      ],
    }).select(["pollName", "pollKind"]);
    res.json(pollNames);
  } catch (err) {
    res.json({ message: err });
  }
});

//retrieve specific poll that has this unique keyphrase
router.get("/pollsearch/:keyphrase", async (req, res) => {
  try {
    const pollSearch = await Poll.findOne({
      keyPhrase: req.params.keyphrase.toLowerCase(),
    }).select("pollName");
    res.json(pollSearch);
  } catch (err) {
    res.json({ message: err });
  }
});

//check if keyphrase is unique
router.get("/keyphrase/:key", async (req, res) => {
  try {
    const result = await Poll.countDocuments({
      keyPhrase: req.params.key.toLowerCase(),
    });

    const isUnique = result < 1;

    res.json({ isUnique: isUnique });
  } catch (err) {
    res.json(false);
  }
});

//retrieve specific poll to EDIT if you are the authID
router.get("/:_id/:authId", async (req, res) => {
  try {
    const specPoll = await Poll.findOne({
      _id: req.params._id,
      authId: req.params.authId,
    });
    res.json(specPoll);
  } catch (err) {
    res.json({ message: err });
  }
});

//retrieve specific poll to VOTE ******PUSHER
router.get("/:_id", async (req, res) => {
  try {
    const specPoll = await Poll.findById(req.params._id);
    res.json(specPoll);
  } catch (err) {
    res.json({ message: err });
  }
});

//create a poll
router.post("/post", async (req, res) => {
  const newPoll = new Poll({
    pollName: req.body.pollName,
    keyPhrase: req.body.keyPhrase.toLowerCase(),
    details: req.body.details,
    rsvpDate: req.body.rsvpDate,
    pollOptions: req.body.pollOptions,
    pollKind: req.body.pollKind,
    authId: req.body.authId,
  });

  const savedPoll = await newPoll.save();
  try {
    res.json(savedPoll);
  } catch (err) {
    res.json({ message: err });
  }
});

//update a specific poll ****PUSHER
router.patch("/upd/:_id", async (req, res) => {
  try {
    const updPoll = await Poll.findOneAndUpdate(
      { _id: req.params._id },
      req.body
    );
    pusher.trigger("polls", "poll-vote");
    res.sendStatus(204);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
