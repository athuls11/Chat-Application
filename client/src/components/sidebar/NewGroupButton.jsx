import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

const NewGroupButton = ({ handleCreateGroup }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setGroupName("");
  };

  const handleSubmit = () => {
    if (groupName.trim() !== "") {
      handleCreateGroup(groupName);
      closeModal();
    }
  };

  return (
    <>
      <button
        className="bg-green-500 text-white px-3 py-2 rounded mb-2 flex items-center"
        onClick={openModal}
      >
        <FaPlus className="mr-2" />
        Create New Group
      </button>

      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-700 bg-opacity-75">
          <div className="bg-white p-4 rounded shadow-md">
            <label className="block mb-2">Group Name:</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full p-2 border rounded"
            />

            <div className="flex justify-end mt-4">
              <button
                className="bg-green-500 text-white px-3 py-2 rounded"
                onClick={handleSubmit}
              >
                Submit
              </button>
              <button
                className="ml-2 px-3 py-2 border rounded"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewGroupButton;
