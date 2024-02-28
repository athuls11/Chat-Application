import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";
import groupRoutes from "./routes/group.routes.js";
import connectToMongoDB from "./db/mongoose.js";
import { app, server } from "./socket/socket.js";

const PORT = process.env.PORT || 5000;
// const app = express();
config();

app.use(express.json());
app.use(cookieParser());
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/group", groupRoutes);

server.listen(5000, () => {
  connectToMongoDB();
  console.log(`server is running on port ${PORT}`);
});
