const mongoose = require("mongoose");

const VoteLinkSchema = mongoose.Schema({
  ipAdd: { type: String, require: true },
  pollId: { type: String, require: true },
});

module.exports = mongoose.model("votelink", VoteLinkSchema);
