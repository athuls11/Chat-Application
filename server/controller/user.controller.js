import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const userRegister = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    return res.status(200).json({
      success: true,
      message: `Registered Successfully.`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `${error}`,
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: `Incorrect username`,
      });
    }
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: `Incorrect password`,
      });
    }
    // const token = jwt.sign({ username: user.username }, SECRET_KEY, {
    //   expiresIn: JWT_EXPIRATION,
    // });
    const token = await generateToken(user._id, res);
    return res.status(200).json({
      success: true,
      message: `Hurry! you are now logged in.`,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `${error}`,
    });
  }
};

export const userLogout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({
      success: true,
      message: `Logged out successfully.`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `${error}`,
    });
  }
};

export const getUserList = async (req, res) => {
  try {
    const loggedInUser = req.user.userId;
    const filetredUsers = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");
    return res.status(200).json({
      success: true,
      message: `Fetch the users details succesfully.`,
      data: filetredUsers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `${error}`,
    });
  }
};
