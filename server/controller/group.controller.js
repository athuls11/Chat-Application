import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import GroupMessage from "../models/groupMessage.model.js";
import { io } from "../socket/socket.js";

export const createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const currentUserId = req.user.userId;
    const existingGroup = await Group.findOne({ name });
    if (existingGroup) {
      return res.status(400).json({
        succsss: false,
        message: "Group with this name already exists.",
      });
    }
    const newGroup = new Group({
      name,
      members: [currentUserId],
    });

    await newGroup.save();

    io.emit("updateGroups", newGroup);

    return res.status(201).json({
      success: true,
      message: "Group created successfully.",
      group: newGroup,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const { name } = req.body;
    const currentUserId = req.user.userId;

    const group = await Group.findById(groupId);
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found." });
    }

    if (!group.members.includes(currentUserId)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this group.",
      });
    }

    group.name = name;
    await group.save();

    return res.status(200).json({
      success: true,
      message: "Group settings updated successfully.",
      group,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addNewMember = async (req, res) => {
  try {
    const groupId = req.params.id;
    const { membersToAdd } = req.body;
    const currentUserId = req.user.userId;

    const group = await Group.findById(groupId);
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found." });
    }

    if (!group.members.includes(currentUserId)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to add members to this group.",
      });
    }

    if (!membersToAdd || !Array.isArray(membersToAdd)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request. Please provide an array of members to add.",
      });
    }

    const validMembers = await User.find({ _id: { $in: membersToAdd } });
    if (validMembers.length !== membersToAdd.length) {
      return res
        .status(400)
        .json({ success: false, message: "One or more members do not exist." });
    }

    const uniqueMembersToAdd = [...new Set(membersToAdd)];

    const existingMembers = await Group.find({
      members: { $in: uniqueMembersToAdd },
    });

    if (existingMembers.length > 0) {
      return res.status(400).json({
        success: false,
        message: "This users are already in the group",
      });
    }

    const membersNotInGroup = uniqueMembersToAdd.filter(
      (member) => !group.members.includes(member)
    );
    await Group.findByIdAndUpdate(groupId, {
      $addToSet: { members: { $each: membersToAdd } },
    });

    return res.status(200).json({
      success: true,
      message: "Members added to the group successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeMember = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const memberIdToRemove = req.params.userId;
    const currentUserId = req.user.userId;

    const group = await Group.findById(groupId);
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found." });
    }

    if (!group.members.includes(currentUserId)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to remove members from this group.",
      });
    }

    if (!group.members.includes(memberIdToRemove)) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found in the group." });
    }
    await Group.findByIdAndUpdate(groupId, {
      $pull: { members: memberIdToRemove },
    }).lean();

    return res.status(200).json({
      success: true,
      message: "Member removed from the group successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const groupId = req.params.groupId;
    const senderId = req.user.userId;

    let groupMessage = await Group.findById(groupId);

    const newGroupMessage = new GroupMessage({
      senderId,
      groupId,
      message,
    });

    if (newGroupMessage) {
      groupMessage.messages.push(newGroupMessage._id);
    }

    await Promise.all([groupMessage.save(), newGroupMessage.save()]);

    io.to(groupId).emit("newGroupMessage", newGroupMessage);

    return res.status(201).json(newGroupMessage);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const groupId = req.params.id;
    const groupWithMessages = await Group.findById(groupId).populate(
      "messages"
    );
    if (!groupWithMessages) {
      return res.status(200).json([]);
    }
    const messages = groupWithMessages.messages;
    return res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const allGroupsOfSingleUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userGroups = await Group.find({ members: userId })
      .select("_id name")
      .lean();
    const formattedUserGroups = userGroups.map((group) => ({
      ...group,
      _id: group._id.toString(),
    }));

    return res.status(200).json({
      success: true,
      message: `Fetch the groups details succesfully.`,
      data: formattedUserGroups,
    });
  } catch (error) {
    console.log("error", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
