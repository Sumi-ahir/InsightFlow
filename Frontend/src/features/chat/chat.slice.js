import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: {},
    currentChatId: null,
    error: null,
    loading: false,
    guestCount: 0,
  },
  reducers: {
    createNewChat: (state, action) => {
      const { chatId, title } = action.payload;
      state.chats[chatId] = {
        _id: chatId,
        title,
        messages: [],
        lastUpdated: new Date().toISOString(),
      };
    },
    
    addNewMessages: (state, action) => {
      const { chatId, content, role } = action.payload;

      if (!chatId) return;

      if (!state.chats[chatId]) {
        state.chats[chatId] = {
          id: chatId,
          title: "New Chat",
          messages: [],
          guestCount: 0,
          lastUpdated: new Date().toISOString(),
        };
      }

      state.chats[chatId].messages.push({
        role,
        content,
      });
    },
    addMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      if (!state.chats[chatId]) return;

      state.chats[chatId].messages = messages;
    },
    // remove chat
    removeChat: (state, action) => {
      delete state.chats[action.payload];
    },
    updateChatTitle: (state, action) => {
      const { chatId, title } = action.payload;
      if (state.chats[chatId]) {
        state.chats[chatId].title = title;
      }
    },
    updateChatId: (state, action) => {
  const { oldChatId, newChatId } = action.payload;

  if (!state.chats[oldChatId]) return;

  state.chats[newChatId] = {
    ...state.chats[oldChatId],
    _id: newChatId,
  };

  delete state.chats[oldChatId];

  state.currentChatId = newChatId;
},
    setChats: (state, action) => {
      const chatsArray = action.payload || [];

      const chatsObject = {};

      chatsArray.forEach((chat) => {
        chatsObject[chat._id] = {
          _id: chat._id,
          title: chat.title,
          messages: chat.messages || [],
          lastUpdated: chat.updatedAt,
        };
      });

      state.chats = chatsObject;
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    incGuestCount: (state) => {
      state.guestCount += 1;
    },
    resetGuestMsg: (state) => {
      state.guestCount = 0;
    },
  },
});
export const {
  setChats,
  setCurrentChatId,
  setLoading,
  setError,
  createNewChat,
  addNewMessages,
  addMessages,
  removeChat,
  updateChatTitle,
  incGuestCount,
  resetGuestMsg,
  updateChatId
} = chatSlice.actions;
export default chatSlice.reducer;
