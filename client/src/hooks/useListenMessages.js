import { useEffect } from "react";
import CryptoJS from "crypto-js";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversations";

const useListenMessages = () => {
  const REACT_APP_SECRET_KEY = "qwertyufghdjkvbn$dvb";
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversation();

  const decryptMessage = (encryptedMessage) => {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, REACT_APP_SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      const decryptedMessage = decryptMessage(newMessage.message);
      console.log("decryptedMessage", decryptedMessage);
      setMessages([...messages, { ...newMessage, message: decryptedMessage }]);
    });

    return () => socket?.off("newMessage");
  }, [socket, setMessages, messages]);
};
export default useListenMessages;
