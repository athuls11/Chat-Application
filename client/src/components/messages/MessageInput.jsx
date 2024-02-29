import { BsSend } from "react-icons/bs";
import useConversation from "../../zustand/useConversations";
import axios from "../../axios";
import { useState } from "react";

const MessageInput = () => {
  const { messages, setMessages, selectedConversation } = useConversation();
  const [inputs, setInputs] = useState("");

  const sendMessage = async (message) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const res = await axios.post(
        `api/message/send/${selectedConversation._id}`,
        { message },
        config
      );
      const data = res.data;
      console.log("data", data);
      setMessages([...messages, data]);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputs) return;
    await sendMessage(inputs);
    setInputs("");
  };

  return (
    <form className="px-4 my-3" onSubmit={handleSubmit}>
      <div className="w-full relative">
        <input
          type="text"
          className="border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white"
          placeholder="Send a message"
          value={inputs}
          onChange={(e) => setInputs(e.target.value)}
        />
        <button
          type="submit"
          className="absolute inset-y-0 end-0 flex items-center pe-3"
        >
          <BsSend />
        </button>
      </div>
    </form>
  );
};
export default MessageInput;
