import { genrateResponse, genrateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
  const { message, chat: chatId } = req.body;
  const file = req.file;
  let title = null;
  let chat = null;

  // create chat if not exist
  if (!chatId) {
    title = await genrateChatTitle(message);

    chat = await chatModel.create({
      user: req.user.id,
      title,
    });
  } else {
    chat = await chatModel.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
  }
  const finalChatId = chatId || chat._id;

  // save user message
  await messageModel.create({
    chat: finalChatId,
    content: message,
    role: "user",
  });

  // get chat history
  const getMessages = await messageModel.find({ chat: finalChatId });

  // convert to LangChain format
  const messages = getMessages.map((m) =>
    m.role === "user" ? new HumanMessage(m.content) : new AIMessage(m.content),
  );

  // AI response
  const result = await genrateResponse(messages);

  // save AI message
  const aiMsg = await messageModel.create({
    chat: finalChatId,
    content: result,
    role: "ai",
  });

  res.json({
    title: title || chat.title,
    chatId: finalChatId,
    message: aiMsg,
  });
}
// get user chats
export async function getChats(req, res) {
  console.log("USER:", req.user);
  const user = req.user;
  const chats = await chatModel.find({ user: user.id });
  res.status(200).json({
    message: "chat retrived successfully !",
    chats,
  });
}
// get messages
export async function getMessages(req, res) {
  const { chatId } = req.params;

  const chat = await chatModel.findOne({ user: req.user.id, _id: chatId });

  if (!chat) {
    return res.status(404).json({ message: "Chat not found !" });
  }

  const messages = await messageModel.find({
    chat: chatId,
  });
  res.status(200).json({
    message: "message retrived successfully !",
    messages,
  });
}
// delete chat
export async function deleteChat(req, res) {
  const { chatId } = req.params;

  const chat = await chatModel.findOneAndDelete({
    _id: chatId,
    user: req.user.id,
  });

  if (!chat) {
    return res.status(404).json({ message: "Chat not found !" });
  }
  await messageModel.deleteMany({
    chat: chatId,
  });
  res.status(200).json({
    message: "chat deleted successfully !",
  });
}
