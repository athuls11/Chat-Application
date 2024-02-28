import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const GroupMessage = mongoose.model("GroupMessage", messageSchema);

export default GroupMessage;
