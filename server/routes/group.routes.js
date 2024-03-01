import express from "express";
import {
  createGroup,
  updateGroup,
  addNewMember,
  removeMember,
  sendGroupMessage,
  getGroupMessages,
  allGroupsOfSingleUser,
  sendGroupMessagesToUserGroups,
} from "../controller/group.controller.js";
import verifyToken from "../middleware/auth.js";
const router = express.Router();

router.post("/", verifyToken, createGroup);
router.put("/:id", verifyToken, updateGroup);
router.get("/", verifyToken, allGroupsOfSingleUser);

router.post("/add-member/:id", verifyToken, addNewMember);
router.delete("/remove-member/:groupId/:userId", verifyToken, removeMember);

router.post("/send/all", verifyToken, sendGroupMessagesToUserGroups);
router.post("/send/:groupId", verifyToken, sendGroupMessage);
router.get("/:id", verifyToken, getGroupMessages);

export default router;
