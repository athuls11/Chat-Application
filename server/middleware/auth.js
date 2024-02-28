import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  try {
    // const authHeader = req.headers["authorization"];
    // const token = authHeader && authHeader.split(" ")[1];
    const token = req.cookies.jwt;
    if (token == null)
      return res
        .sendStatus(401)
        .json({ success: false, message: "Unautherized" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err)
        return res
          .sendStatus(403)
          .json({ success: false, message: "Unautherized" });
      req.user = user;
      next();
    });
  } catch (error) {
    return res
      .status(401)
      .json({ status: "error", message: "Unauthenticated" });
  }
};

export default verifyToken;
