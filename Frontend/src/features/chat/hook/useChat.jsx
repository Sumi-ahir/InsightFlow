import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deletechat } from "../service/chat.api";
import { setLoading, setError, setChats, setCurrentChatId, createNewChat, addNewMessages, addMessages } from "../chat.slice";
import { useDispatch } from "react-redux";
const useChat = () => {

  const dispatch = useDispatch();
  async function handleSendMessage({ message, chatId }) {

    dispatch(setLoading(true))
    const data = await sendMessage({ message, chatId })
    console.log("sendMessage res:", data);
    const chat = data.chat;
    const aiMessage = data.message;
    const chatsRes = await getChats();
    dispatch(setChats(chatsRes.chats));
    if (!chatId) {
      dispatch(createNewChat({
        chatId: chat._id,
        title: chat.title
      }))
    }
    console.log("CHAT FROM BACKEND:", chat);
    console.log("CHAT TITLE:", chat.title);

    dispatch(addNewMessages({
      chatId: chat._id,
      content: message,
      role: 'user'
    }))
    dispatch(addNewMessages({
      chatId: chatId || chat._id,
      content: aiMessage.content,
      role: aiMessage.role
    }))
    dispatch(setCurrentChatId(chat._id))
  }
  function initializeSocketConnection() {
    console.log("socket ready");
  }
  async function handleGetChats() {
    dispatch(setLoading(true))
    const data = await getChats()
    const { chats } = data
    dispatch(setChats(chats.reduce((acc, chat) => {
      acc[chat._id] = {
        id: chat._id,
        title: chat.title,
        messages: [],
        lastUpdated: chat.updateAt,
      }
      return acc
    }, {})))
    dispatch(setLoading(false))
  }
  async function handleOpenChat(chatId, chats) {
    if (!chats || !chats[chatId]) {
      dispatch(setCurrentChatId(chatId))
      return
    }

    if (chats[chatId].messages.length === 0) {
      const data = await getMessages(chatId)
      const { messages } = data
      const formatedMessages = messages.map(msg => ({
        content: msg.content,
        role: msg.role
      }))
      dispatch(addMessages({
        chatId,
        messages: formatedMessages
      }))
    }
    dispatch(setCurrentChatId(chatId))
  }
  return {
    initializeSocketConnection, handleSendMessage, handleGetChats, handleOpenChat
  }
}

export default useChat