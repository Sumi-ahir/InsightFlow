import { Router } from "express";
import {
  getChats,
  getMessages,
  sendMessage,
  deleteChat,
} from "../controllers/chat.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import multer from "multer";

const chatRouter = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });
chatRouter.post("/message", authUser, upload.single("file"), sendMessage);
chatRouter.get("/", authUser, getChats);
chatRouter.get("/:chatId/messages", authUser, getMessages);
chatRouter.delete("/delete/:chatId", authUser, deleteChat);

export default chatRouter;
