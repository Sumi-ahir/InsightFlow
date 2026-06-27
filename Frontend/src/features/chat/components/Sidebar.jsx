
import { useState } from "react";
import {
  RiChatNewLine,
  RiMenuLine,
  RiCloseLine,
} from "@remixicon/react";
import { LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages, deletechat } from "../service/chat.api";
import { clearUser } from "../../auth/auth.slice";
import { createNewChat, setCurrentChatId, addMessages,removeChat } from "../chat.slice";
import { RiDeleteBinLine } from "@remixicon/react";
import { useNavigate } from "react-router-dom";
import login from '../../auth/pages/Login'
import { useAuth } from "../../auth/hook/useAuth";
const Sidebar = () => {

  const {handleLogout}=useAuth();
  const user=useSelector((state)=>state.auth.user)
   const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deleteChatId, setDeleteChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { chats, currentChatId } = useSelector((state) => state.chat);

  //covert object into array (bcz map is only run in array and chats is object in redux/toolkit)
  const chatList = Object.values(chats || {})
  const handleChatClick = async (chatId) => {
    if (!chatId) return;
    try {
      dispatch(setCurrentChatId(chatId));

      const res = await getMessages(chatId);

      dispatch(
        addMessages({
          chatId,
          messages: res.messages || [],
        })
      );
      setSidebarOpen(false);
    } catch (err) {
      console.log(err);
    }
  }

  // const handleNewChat = () => {
  //   dispatch(setCurrentChatId(null));
  //   setSidebarOpen(false);
  // };
  const handleNewChat = () => {
  const tempChatId = "temp-chat";

  dispatch(
    createNewChat({
      chatId: tempChatId,
      title: "New Chat",
    })
  );

  dispatch(setCurrentChatId(tempChatId));

  setSidebarOpen(false);
};

  // handleDelete
  const handleDeleteChat = async (chatId) => {
    try {
      const res = await deletechat(chatId);
      dispatch(removeChat(chatId));
      
      if(currentChatId === chatId){
      dispatch(setCurrentChatId(null));
    }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#1E1D1B] p-2 rounded-lg text-white"
      >
        <RiMenuLine size={22} />
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static
          top-0 left-0
          h-screen
          w-64
          flex flex-col
          bg-[#1E1D1B]
          border-r border-zinc-800
          text-white/90
          z-50
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4 md:hidden">
          <RiCloseLine
            size={24}
            className="cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
        {/* new chat */}
        <div className="px-6">

          <button
            onClick={handleNewChat}
            className="w-full hover:bg-[#85807715]  border md:mt-5 border-zinc-700 cursor-pointer flex gap-2 items-center justify-center p-2 rounded-lg"
          >
            <RiChatNewLine size={18} />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 mt-6">
          <p className="text-zinc-400 text-xs mb-1">RECENT</p>

          {chatList.length === 0 ? (
            <div className="mt-3">
              <div className="py-10">
                <p className="text-zinc-300 text-sm font-medium">
                  It's quiet in here...
                </p>

                <p className="text-zinc-500 text-xs mt-2">
                  Start a new chat to spark some ideas!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {chatList.map((chat, index) => (
                <div
                  key={chat._id}
                  className="group flex items-center justify-between p-2 rounded hover:bg-[#85807715] cursor-pointer"
                  onClick={() =>
                    handleChatClick(chat._id)
                  }
                >
                  <span className="truncate">
                    {chat.title || "New Chat"}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()//for not allow to open chat
                      setDeleteChatId(chat._id)
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity ">
                    <RiDeleteBinLine size={16} className="hover:text-red-500 cursor-pointer" />
                  </button>
                </div>
              ))}

            </div>
          )}
        </div>
       <div className="border-t border-zinc-800 p-4 mt-auto">
  {user ? (
    <div className="space-y-3 flex gap-5 ">

      <div className="flex items-center gap-3 ">
        <div className="w-9 h-9 rounded-full bg-[#674188] flex items-center justify-center text-white font-semibold">
          {user.username?.charAt(0)?.toUpperCase()}
        </div>

        <div>
          <p className="text-white text-sm font-medium">
            {user.username}
          </p>

          <p className="text-zinc-500 text-xs">
            {user.email}
          </p>
        </div>
      </div>

      <button
        onClick={async () => {
          await handleLogout();
          dispatch(clearUser());
          navigate("/login");
        }}
        className=" cursor-pointer px-2 rounded-full  text-red-400 hover:bg-red-500/10">
          <LogOut size={20} />

      </button>
    </div>
  ) : (
    <button
      onClick={() => navigate("/login")}
      className="cursor-pointer w-30  flex justify-center p-2 rounded-lg bg-[#674188] hover:bg-[#5a3870] text-white"
    >
      Sign In
    </button>
  )}
</div>
      </div>
      {deleteChatId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999]">
          <div className="bg-[#1E1D1B] border border-zinc-700 rounded-xl p-6 w-[400px]">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-xl font-semibold">
                Delete Chat
              </h2>

              <button
                onClick={() => setDeleteChatId(null)}
                className="text-zinc-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <p className="text-zinc-400 mt-4">
              Are you sure you want to delete this chat?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteChatId(null)}
                className="px-4 py-2 cursor-pointer border border-zinc-700 rounded-lg text-white"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleDeleteChat(deleteChatId);
                  setDeleteChatId(null);
                }}
                className="px-4 cursor-pointer py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default Sidebar;        
