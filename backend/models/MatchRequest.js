const mongoose = require("mongoose");

const matchRequestSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
  isAccepted: { type: Boolean, default: false },
  isRejected: { type: Boolean, default: false },
  transactionDateTime: { type: Date, default: Date.now },
});

const MatchRequest = mongoose.model("MatchRequest", matchRequestSchema);

module.exports = MatchRequest;
