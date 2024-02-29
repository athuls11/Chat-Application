import React, { useState } from "react";
import Conversations from "./Conversations";
import GroupConversations from "./GroupConversations";
import LogoutButton from "./LogoutButton";
import SwitchButtons from "./SwitchButtons";

const Sidebar = () => {
  const [showChat, setShowChat] = useState(true);

  const handleSwitch = () => {
    setShowChat((prevShowChat) => !prevShowChat);
  };

  return (
    <div className="border-r border-slate-500 p-4 flex flex-col">
      <SwitchButtons showChat={showChat} handleSwitch={handleSwitch} />
      <div className="divider px-3"></div>
      {showChat ? <Conversations /> : <GroupConversations />}
      <LogoutButton />
    </div>
  );
};

export default Sidebar;
