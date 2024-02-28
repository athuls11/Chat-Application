import express from "express";
import {
  createGroup,
  updateGroup,
  addNewMember,
  removeMember,
  sendGroupMessage,
  getGroupMessages,
  allGroupsOfSingleUser,
} from "../controller/group.controller.js";
import verifyToken from "../middleware/auth.js";
const router = express.Router();

router.post("/", verifyToken, createGroup);
router.put("/:id", verifyToken, updateGroup);
router.get("/", verifyToken, allGroupsOfSingleUser);

router.post("/add-member/:id", verifyToken, addNewMember);
router.delete("/remove-member/:groupId/:userId", verifyToken, removeMember);

router.get("/:id", verifyToken, getGroupMessages);
router.post("/send/:groupId", verifyToken, sendGroupMessage);

export default router;
