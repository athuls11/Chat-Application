import { useEffect, useState } from "react";
import Conversation from "./Conversation";
import axios from "../../axios";

const Conversations = () => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        const res = await axios.get("/api/user", config);
        setConversations(res.data.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    getConversations();
  }, []);

  return (
    <div className="py-2 flex flex-col overflow-auto">
      {conversations.map((conversation, index) => {
        return (
          <Conversation
            key={conversation._id}
            conversation={conversation}
          />
        );
      })}
    </div>
  );
};
export default Conversations;
