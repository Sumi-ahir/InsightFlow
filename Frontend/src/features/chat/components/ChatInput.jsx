import { useState ,useRef} from "react";
import { useDispatch, useSelector} from "react-redux";
import {
  addNewMessages,
  setCurrentChatId,
  createNewChat,
  setLoading,updateChatTitle,updateChatId
} from "../chat.slice";
import { sendMessage } from "../service/chat.api";
import { RiAddLine, RiArrowUpLine } from "@remixicon/react";
import { useNavigate } from "react-router";

const ChatInput = () => {
  const navigate=useNavigate();
  const dispatch = useDispatch();
  const [file, setfile] = useState(null)
  const [showLoginModal, setshowLoginModal] = useState(false)
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const user = useSelector((state) => state.auth.user);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);
// attachment
const handleAttachClick = () => {
  fileInputRef.current.click();
};

const handleSend = async () => {
  if (!message.trim()) return;

  if (!user) {
    setshowLoginModal(true);
    return;
  }

  const userMessage = message;
  setMessage("");

const tempChatId = currentChatId || "temp-chat";
dispatch(
  addNewMessages({
    chatId: tempChatId,
    role: "user",
    content: userMessage,
  })
);

  dispatch(setLoading(true));

  try {
    const response = await sendMessage({
  message: userMessage,
  chatId: currentChatId === "temp-chat" ? null : currentChatId,
});

    const actualChatId = response.chatId || response.chat?._id;

    // New Chat Create
   if (tempChatId === "temp-chat" && actualChatId) {
  dispatch(
    updateChatId({
      oldChatId: "temp-chat",
      newChatId: actualChatId,
    })
  );

  dispatch(
    updateChatTitle({
      chatId: actualChatId,
      title: response.title || "New Chat",
    })
  );
}

    // User Message
    // dispatch(
    //   addNewMessages({
    //     chatId: actualChatId,
    //     role: "user",
    //     content: userMessage,
    //   })
    // );

    // AI Message
    dispatch(
      addNewMessages({
        chatId: actualChatId,
        role: "ai",
        content: response.message.content,
      })
    );

    // Update Title
    if (response.title) {
      dispatch(
        updateChatTitle({
          chatId: actualChatId,
          title: response.title,
        })
      );
    }
  } catch (error) {
    console.log(
      "SEND ERROR:",
      error?.response?.data || error.message
    );
  } finally {
    dispatch(setLoading(false));
  }
};

return (
  <>
    <div className="max-w-3xl w-full mx-auto pb-5 flex justify-center items-center">
      <div className="bg-[#1E1D1B] flex items-center w-full rounded-3xl border border-zinc-800 p-4 gap-3">

{/* ATTACH BUTTON */}
       {/* <div className="relative group" onClick={handleAttachClick}>
  <RiAddLine
    size={22}
    className="text-zinc-600 cursor-pointer dark:text-zinc-400"
  />

  <div className="absolute w-fit left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition">
    Add Attachment
  </div>

  <input
    type="file"
    ref={fileInputRef}
    hidden
    onChange={(e) => setfile(e.target.files[0])}
  />
</div> */}

        <textarea
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask anything..."
          className="w-full bg-transparent outline-none text-white resize-none"
        />

        <div className="relative group">
          <input type="file"
          hidden 
          onChange={(e)=>setfile(e.target.files[0])}
          />
          <button
            onClick={handleSend}
            className="w-10 h-9 flex items-center justify-center rounded-full
            bg-black dark:bg-white/50 text-white dark:text-black
            cursor-pointer transition-all duration-200
            hover:scale-105 active:scale-95"
          >
            <RiArrowUpLine size={18} />
          </button>
             {file && (
  <div className="text-xs text-zinc-400 mt-2">
    📎 {file.name}
  </div>
)}
          

          <div
            className="
            absolute left-1/2 -translate-x-1/2
            bg-zinc-800 text-white text-xs
            px-3 py-1 rounded-md
            opacity-0 group-hover:opacity-100
            pointer-events-none
            transition-opacity duration-200
            whitespace-nowrap"
          >
            Send Query
          </div>
        </div>

      </div>
   
    </div>

    {/* LOGIN MODAL */}
    {showLoginModal && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="w-[70%] max-w-md bg-[#1E1D1B] border border-zinc-700 rounded-2xl p-6 shadow-2xl">

          <h2 className="text-2xl font-semibold text-white  ">
            Sign in to continue
          </h2>

          <p className="text-zinc-400 mt-3 text-sm">
            Create an account to start conversations, save chat history, and unlock all features.
          </p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => navigate("/login")}
              className="flex-1 bg-[#674188] hover:bg-[#7a4fa0] cursor-pointer text-white py-3 rounded-lg font-medium"
            >
              Sign In
            </button>

            <button
              onClick={() => setshowLoginModal(false)}
              className="flex-1 border border-zinc-700 cursor-pointer text-white py-3 rounded-lg"
            >
              Maybe Later
            </button>
          </div>

        </div>
      </div>
    )}
  </>
);
};

export default ChatInput;