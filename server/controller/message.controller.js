import PrivateMessage from "../models/personalMessage.model.js";
import Message from "../models/message.model.js";
import { getReciverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.userId;

    let privateMessage = await PrivateMessage.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!privateMessage) {
      privateMessage = await PrivateMessage.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      privateMessage.messages.push(newMessage._id);
    }

    // await privateMessage.save();
    // await newMessage.save();
    await Promise.all([privateMessage.save(), newMessage.save()]);

    // SOCKET IO FUNCTIONALITY
    const receiverSocketId = getReciverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("error", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user.userId;

    const conversation = await PrivateMessage.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json([]);
    }
    const message = conversation.messages;

    res.status(200).json(message);
  } catch (error) {
    console.log("error", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

