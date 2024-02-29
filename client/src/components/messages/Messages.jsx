import Message from "./Message";
import { useEffect, useState, useRef } from "react";
import useConversation from "../../zustand/useConversations";
import axios from "../../axios";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = () => {
  const { messages, setMessages, selectedConversation } = useConversation();
  useListenMessages();

  const lastMessageRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      // setLoading(true);
      try {
        const accessToken = localStorage.getItem("accessToken");
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        const res = await axios.get(
          `/api/message/${selectedConversation._id}`,
          config
        );
        const data = res.data;
        setMessages(data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);

  return (
    <div className="px-4 flex-1 overflow-auto">
      {messages.length > 0 &&
        messages.map((message) => {
          return (
            <div key={message._id} ref={lastMessageRef}>
              <Message message={message} />
            </div>
          );
        })}
      {messages.length === 0 && (
        <p className="text-center">Send a message to start the conversation</p>
      )}
    </div>
  );
};
export default Messages;
