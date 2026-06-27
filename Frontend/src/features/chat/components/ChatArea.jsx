import EmptyState from "./EmptyState";
import ChatInput from "./ChatInput";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
const ChatArea = () => {
  const { chats, currentChatId,loading } = useSelector(
    (state) => state.chat
  );
// const currentChat = currentChatId ? chats[currentChatId] : null;
const currentChat =
  currentChatId
    ? chats[currentChatId]
    : chats["temp-chat"] || null;
  // const currentChat = chats?.[currentChatId] || {};
  const messages = currentChat?.messages || [];
  const hasMessages =
    currentChat?.messages?.length > 0;

  return (
    <div className="h-full flex flex-col bg-[#171615] ">

      {!hasMessages ? (
        <>
          <div className="flex-1 flex flex-col items-center justify-center">
            <EmptyState />
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-hide p-10">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {currentChat?.messages?.map((msg, index) => (
              <div
                key={index}
                className={`flex w-full mb-5 ${msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
              >
               <div
  className={
    msg.role === "user"
      ? "bg-white/10 text-white px-4 py-2 rounded-2xl max-w-[70%]"
      : "text-white w-full"
  }
>
  <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-zinc-200 prose-strong:text-white prose-code:text-green-400 prose-pre:bg-transparent  prose-li:text-zinc-200">
   <ReactMarkdown
  components={{
    code({ inline, className, children }) {
      const match = /language-(\w+)/.exec(className || "");

      if (!inline && match) {
        return (
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        );
      }

      return (
        <code className="text-green-400  rounded">
          {children}
        </code>
      );
    },
  }}
>
  {msg.content}
</ReactMarkdown>
  </div>
</div>
              </div>
            ))}

            {/* ai thinking animation */}

            {loading && (
              <div className="flex justify-start mt-5">
                <div className="text-white/40 flex items-center gap-2">
                
                  <div className="flex gap-1">
                    <span 
                      className="w-1 h-1 bg-[white] rounded-full animate-bounce"
                    />
                    <span 
                      className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:200ms]"
                    />
                    <span 
                      className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:400ms]"
                    />

                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="w-full px-4 ">
        <ChatInput />       
      </div>
      <div className="flex justify-center w-full px-4 pb-3">
         <p className="text-xs text-white/40 text-center max-w-md leading-relaxed">
          InsightFlow AI can make mistakes and may provide outdated information.
Always verify critical details from reliable sources.</p>
</div>


    </div>
  );
};

export default ChatArea;