import express from "express";
import {
  userRegister,
  userLogin,
  userLogout,
  getUserList,
} from "../controller/user.controller.js";
import verifyToken from "../middleware/auth.js";
const router = express.Router();

// Authentications
router.post("/signup", userRegister);
router.post("/login", userLogin);
router.post("/logout", userLogout);

//
router.get("/", verifyToken, getUserList);

export default router;
