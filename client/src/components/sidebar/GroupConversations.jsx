import React, { useEffect, useState } from "react";
import axios from "../../axios";
import GroupConversation from "./GroupConversation";
import NewGroupButton from "./NewGroupButton";

const GroupConversations = () => {
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
        const res = await axios.get("/api/group", config);
        console.log("res.data", res.data);
        setConversations(res.data.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    getConversations();
  }, []);

  const handleCreateGroup = async (groupName) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const res = await axios.post("api/group", { name: groupName }, config);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  return (
    <div className="py-2 flex flex-col overflow-auto">
      <NewGroupButton handleCreateGroup={handleCreateGroup} />

      {conversations.length > 0 ? (
        conversations.map((conversation) => {
          return (
            <GroupConversation
              key={conversation._id}
              conversation={conversation}
            />
          );
        })
      ) : (
        <p>No groups available.</p>
      )}
      {/* {conversations.map((conversation, index) => {
        return (
          <GroupConversation
            key={conversation._id}
            conversation={conversation}
          />
        );
      })} */}
    </div>
  );
};

export default GroupConversations;
