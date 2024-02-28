import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [
      { type: mongoose.Schema.Types.ObjectId, ref: "GroupMessage", default: [] },
    ],
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);

export default Group;
