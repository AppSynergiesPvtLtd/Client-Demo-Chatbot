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
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUserFields, setShowUserFields] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({
    userId: false,
    userEmail: false,
  });
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Validate required fields
    const errors = {
      userId: !userId.trim(),
      userEmail: !userEmail.trim() || !validateEmail(userEmail.trim()),
    };

    setFieldErrors(errors);

    // If any field has error, don't send message
    if (errors.userId || errors.userEmail) {
      // Show the user fields section if hidden
      if (!showUserFields) {
        setShowUserFields(true);
      }
      return;
    }

    const userMessage: Message = {
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput(""); // Only clear the message input
    setLoading(true);

    try {
      const requestBody = {
        Question: userMessage.text,
        userId: userId.trim(),
        userEmail: userEmail.trim(),
      };

      const res = await axios.post(
        "https://n8n.srv1028016.hstgr.cloud/webhook/chatbot-testing",
        requestBody,
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
      console.error(err);
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
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 p-3 sm:p-4 md:p-6">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-3xl lg:max-w-4xl h-[98vh] sm:h-[95vh] bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/20 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">
                  Client Chatbot Demo - AI Assistant
                </h1>
                <p className="text-xs sm:text-sm text-white/80">
                  Always here to help
                </p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
              title="Clear chat"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-linear-to-b from-gray-50/50 to-white/50">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  Welcome to AI Assistant
                </h2>
                <p className="text-sm sm:text-base text-gray-500">
                  Please fill in your details below to start chatting
                </p>
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              } animate-fadeIn`}
            >
              <div
                className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl shadow-lg text-sm sm:text-base whitespace-pre-wrap wrap-break-word ${
                    msg.sender === "user"
                      ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-br-md"
                      : "bg-white text-gray-800 rounded-bl-md border border-gray-100"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-xs text-gray-400 mt-1.5 px-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-lg border border-gray-100">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef}></div>
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-white/90 backdrop-blur-lg border-t border-gray-100">
          {/* User Fields Toggle */}
          <div className="mb-3">
            <button
              onClick={() => setShowUserFields(!showUserFields)}
              className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-1 transition-colors duration-200"
            >
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  showUserFields ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              <span>
                {showUserFields ? "Hide" : "Show"} User Details{" "}
                <span className="text-red-500">*</span>
              </span>
            </button>
          </div>

          {/* User Details Input Fields */}
          {showUserFields && (
            <div className="mb-3 space-y-3 animate-fadeIn">
              {/* User ID Field */}
              <div className="relative">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  User ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    if (fieldErrors.userId && e.target.value.trim()) {
                      setFieldErrors((prev) => ({ ...prev, userId: false }));
                    }
                  }}
                  placeholder="Enter your user ID..."
                  className={`w-full border ${
                    fieldErrors.userId
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-200 focus:ring-indigo-400"
                  } rounded-xl px-4 py-2.5 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200 pr-10`}
                />
                <svg
                  className={`w-5 h-5 ${
                    fieldErrors.userId ? "text-red-400" : "text-gray-400"
                  } absolute right-3 top-9 transform`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                  />
                </svg>
                {fieldErrors.userId && (
                  <p className="text-xs text-red-500 mt-1">
                    User ID is required
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="relative">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => {
                    setUserEmail(e.target.value);
                    if (
                      fieldErrors.userEmail &&
                      e.target.value.trim() &&
                      validateEmail(e.target.value.trim())
                    ) {
                      setFieldErrors((prev) => ({ ...prev, userEmail: false }));
                    }
                  }}
                  placeholder="Enter your email address..."
                  className={`w-full border ${
                    fieldErrors.userEmail
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-200 focus:ring-indigo-400"
                  } rounded-xl px-4 py-2.5 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200 pr-10`}
                />
                <svg
                  className={`w-5 h-5 ${
                    fieldErrors.userEmail ? "text-red-400" : "text-gray-400"
                  } absolute right-3 top-9 transform`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {fieldErrors.userEmail && (
                  <p className="text-xs text-red-500 mt-1">
                    {!userEmail.trim()
                      ? "Email is required"
                      : "Please enter a valid email address"}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm sm:text-base text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all duration-200 pr-12"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-linear-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                title="Send message"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Info text */}
          <p className="text-xs text-gray-400 mt-2 text-center">
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}
