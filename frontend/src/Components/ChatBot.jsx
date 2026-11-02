import React, { useState } from "react";
import chatLogo from "../assets/Logo.jpg"; // your chatbot logo

const ChatBot = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const handleChatSend = () => {
    if (chatInput.trim() === "") return;

    // Add user message
    setChatMessages((prev) => [...prev, { text: chatInput, type: "user" }]);

    // Add bot response after short delay
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { text: "Hello! How can I assist you today?", type: "bot" },
      ]);
    }, 500);

    setChatInput("");
  };

  return (
    <>
      {/* Chat Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        <div
          onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition overflow-hidden ring-2 ring-[#F5A623]/40"
        >
          <img
            src={chatLogo}
            alt="AI Chatbot"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

     
      {chatOpen && (
        <div className="fixed bottom-20 right-6 w-80 h-[400px] bg-white shadow-lg rounded-xl flex flex-col overflow-hidden z-50 border border-[#E2E8F0]">
          <div className="bg-[#0B1F3A] text-white p-4 font-semibold">
            Study Fusion Support
          </div>
          <div className="flex-1 p-2 overflow-y-auto space-y-2">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-md ${
                  msg.type === "user"
                    ? "bg-[#FFF3DF] text-[#0B1F3A] self-end"
                    : "bg-[#EAF0FA] text-[#0B1F3A] self-start"
                } max-w-[80%]`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex p-2 space-x-2 border-t border-[#E2E8F0]">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-[#0B1F3A]"
            />
            <button
              onClick={handleChatSend}
              className="bg-gradient-to-r from-[#F5A623] to-[#FFC15E] text-[#0B1F3A] px-3 py-1 rounded-md text-sm font-semibold"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
