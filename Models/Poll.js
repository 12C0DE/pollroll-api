const mongoose = require("mongoose");

const PollSchema = mongoose.Schema({
  pollName: { type: String, require: true },
  keyPhrase: { type: String, require: true, unique: true },
  details: String,
  rsvpDate: Date,
  pollOptions: { type: [], require: true },
  pollKind: { type: Number, require: true },
  authId: { type: String, require: true },
});

module.exports = mongoose.model("polls", PollSchema);
