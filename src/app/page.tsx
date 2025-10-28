"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://n8n.srv1028016.hstgr.cloud/webhook/chatbot-testing",
        { Question: userMessage.text },
        { headers: { "Content-Type": "application/json" } }
      );

      const botResponse =
        typeof res.data === "object" && res.data.Response
          ? res.data.Response
          : "Sorry, I couldn't get a valid response.";

      const botMessage: Message = {
        sender: "bot",
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMsg: Message = {
        sender: "bot",
        text: "⚠️ Something went wrong. Please try again later.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl h-full max-h-[95vh] bg-white shadow-lg rounded-2xl p-4 sm:p-6 flex flex-col">
        <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center text-blue-600">
          AI Chatbot
        </h1>

        {/* Chat window */}
        <div className="flex-1 overflow-y-auto mb-3 sm:mb-4 p-3 border border-gray-200 rounded-xl bg-gray-50 space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl text-sm max-w-[80%] whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-xs text-gray-400 mt-1">
                {msg.timestamp}
              </span>
            </div>
          ))}
          {loading && (
            <div className="text-sm text-gray-400 italic">Bot is typing...</div>
          )}
          <div ref={chatEndRef}></div>
        </div>

        {/* Input section */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
