import PrivateMessage from "../models/personalMessage.model.js";
import Message from "../models/message.model.js";
import { getReciverSocketId, io } from "../socket/socket.js";
import CryptoJS from "crypto-js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.userId;

    const encryptedMessage = CryptoJS.AES.encrypt(
      message,
      process.env.SECRET_KEY
    ).toString();

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
      message: encryptedMessage,
    });

    if (newMessage) {
      privateMessage.messages.push(newMessage._id);
    }

    await Promise.all([privateMessage.save(), newMessage.save()]);

    const receiverSocketId = getReciverSocketId(receiverId);
    if (receiverSocketId) {
      const bytes = CryptoJS.AES.decrypt(
        encryptedMessage,
        process.env.SECRET_KEY
      );
      const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);

      io.to(receiverSocketId).emit("newMessage", {
        ...newMessage.toObject(),
        message: decryptedMessage,
      });
    }

    res.status(201).json({
      ...newMessage.toObject(),
      message: message,
    });
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
    const decryptedMessages = conversation.messages.map((message) => {
      const decryptedMessage = CryptoJS.AES.decrypt(
        message.message,
        process.env.SECRET_KEY
      ).toString(CryptoJS.enc.Utf8);

      return {
        ...message.toObject(),
        message: decryptedMessage,
      };
    });

    res.status(200).json(decryptedMessages);
  } catch (error) {
    console.log("error", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
