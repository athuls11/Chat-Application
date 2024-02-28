import jwt from "jsonwebtoken";
const generateToken = async (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
  console.log("token", token);

  res.cookie("jwt", token, {
    maxAge: 3 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
  });
  return token;
};

export default generateToken;
