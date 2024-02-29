import React from "react";

const SwitchButtons = ({ showChat, handleSwitch }) => {
  return (
    <div className="mb-4">
      <button
        className={`bg-blue-500 text-white px-4 py-2 rounded ${
          showChat ? "opacity-100" : "opacity-50"
        }`}
        onClick={handleSwitch}
      >
        Chat
      </button>
      <button
        className={`bg-blue-500 text-white px-3 py-2 rounded ${
          !showChat ? "opacity-100" : "opacity-50"
        }`}
        onClick={handleSwitch}
      >
        Group
      </button>
    </div>
  );
};

export default SwitchButtons;
