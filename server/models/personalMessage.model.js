import mongoose from "mongoose";

const personalMessageSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: [],
    },
  ],
});

const PrivateMessage = mongoose.model("PrivateMessage", personalMessageSchema);

export default PrivateMessage;
