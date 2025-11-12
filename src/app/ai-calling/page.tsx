"use client";
import { useState } from "react";
import {
  Phone,
  Radio,
  Users,
  Globe,
  Hash,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function AICalling() {
  const [callType, setCallType] = useState("");
  const [agentGender, setAgentGender] = useState("");
  const [agentAccent, setAgentAccent] = useState("");
  const [knowledgeBaseId, setKnowledgeBaseId] = useState("");
  const [prompt, setPrompt] = useState("");
  const [callFowarding, setCallFowarding] = useState(false);
  const [callForwoardingNumber, setCallFowardingNumber] = useState("");
  const [callTransfer, setCallTransfer] = useState(false);
  const [fromNumber, setFromNumber] = useState("");
  const [userNumber, setUserNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!callType) newErrors.callType = "Call type is required";
    if (!agentGender) newErrors.agentGender = "Agent gender is required";
    if (!agentAccent) newErrors.agentAccent = "Agent accent is required";
    if (!fromNumber) newErrors.fromNumber = "From number is required";
    if (!userNumber) newErrors.userNumber = "Phone number is required";
    if (callFowarding && !callForwoardingNumber) {
      newErrors.callForwoardingNumber = "Forwarding number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCall = async () => {
    if (!validateForm()) {
      setMessage("");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        "https://n8n.srv1028016.hstgr.cloud/webhook/as-ai-calling-bot-webhook",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            callType,
            fromNumber,
            userNumber,
            agentGender,
            agentAccent,
            knowledgeBaseId: knowledgeBaseId || null,
            prompt: prompt || null,
            callFowarding,
            callForwoardingNumber,
            callTransfer,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to make call");

      const data = await res.json();
      console.log("Call initiated:", data);

      setMessage(
        `success:Call initiated successfully! Call ID: ${
          data.callId || Math.random().toString(36).substring(7)
        }`
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setMessage("error:Failed to initiate call. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-center text-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              AI Calling System
            </h1>
            <p className="text-gray-600">
              Configure and initiate your AI-powered call
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Call Type */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Radio className="w-4 h-4 text-blue-600" />
                Call Type *
              </label>
              <select
                value={callType}
                onChange={(e) => setCallType(e.target.value)}
                className={`w-full rounded-xl border ${
                  errors.callType ? "border-red-300" : "border-gray-200"
                } p-3 text-gray-700 bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none`}
              >
                <option value="">Select call type</option>
                <option value="ai-demo">AI Demo</option>
                <option value="customer">Customer Support</option>
              </select>
              {errors.callType && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  {errors.callType}
                </p>
              )}
            </div>

            {/* Agent Gender */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Users className="w-4 h-4 text-blue-600" />
                Agent Gender *
              </label>
              <select
                value={agentGender}
                onChange={(e) => setAgentGender(e.target.value)}
                className={`w-full rounded-xl border ${
                  errors.agentGender ? "border-red-300" : "border-gray-200"
                } p-3 text-gray-700 bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none`}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.agentGender && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  {errors.agentGender}
                </p>
              )}
            </div>

            {/* Agent Accent */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Globe className="w-4 h-4 text-blue-600" />
                Agent Accent *
              </label>
              <select
                value={agentAccent}
                onChange={(e) => setAgentAccent(e.target.value)}
                className={`w-full rounded-xl border ${
                  errors.agentAccent ? "border-red-300" : "border-gray-200"
                } p-3 text-gray-700 bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none`}
              >
                <option value="">Select accent</option>
                <option value="us">US</option>
                <option value="uk">UK</option>
                <option value="au">AU</option>
              </select>
              {errors.agentAccent && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  {errors.agentAccent}
                </p>
              )}
            </div>

            {/* From Number */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Phone className="w-4 h-4 text-blue-600" />
                Call From Number *
              </label>
              <select
                value={fromNumber}
                onChange={(e) => setFromNumber(e.target.value)}
                className={`w-full rounded-xl border ${
                  errors.fromNumber ? "border-red-300" : "border-gray-200"
                } p-3 text-gray-700 bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none`}
              >
                <option value="">Select from number</option>
                <option value="+12088436040">+1 208 843 6040</option>
              </select>
              {errors.fromNumber && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  {errors.fromNumber}
                </p>
              )}
            </div>

            {/* User Number */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Phone className="w-4 h-4 text-blue-600" />
                Your Phone Number *
              </label>
              <input
                type="tel"
                value={userNumber}
                onChange={(e) => setUserNumber(e.target.value)}
                placeholder="+1 234 567 8900"
                className={`w-full rounded-xl border ${
                  errors.userNumber ? "border-red-300" : "border-gray-200"
                } p-3 text-gray-700 bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none`}
              />
              {errors.userNumber && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  {errors.userNumber}
                </p>
              )}
            </div>

            {/* Knowledge Base ID (Optional) */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Hash className="w-4 h-4 text-gray-400" />
                Knowledge Base ID
                <span className="text-xs text-gray-400 font-normal">
                  (Optional)
                </span>
              </label>
              <input
                type="text"
                value={knowledgeBaseId}
                onChange={(e) => setKnowledgeBaseId(e.target.value)}
                placeholder="Enter Knowledge Base ID"
                className="w-full rounded-xl border border-gray-200 p-3 text-gray-700 bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
              />
            </div>

            {/* Custom Prompt (Optional) */}
            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                Custom Prompt
                <span className="text-xs text-gray-400 font-normal">
                  (Optional)
                </span>
              </label>

              {/* Input */}
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter custom prompt for the AI agent"
                className="w-full rounded-xl border border-gray-200 p-3 text-gray-700 bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
              />

              {/* Prompt Hints */}
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  "Ask the customer about their product issue politely.",
                  "Confirm the user's booking details before ending the call.",
                  "Guide the customer through troubleshooting steps step-by-step.",
                ].map((hint, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(hint)}
                    className="text-xs px-3 py-1 rounded-full border border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-all"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles Section */}
            <div className="md:col-span-2 bg-linear-to-r from-gray-50 to-blue-50 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Additional Options
              </h3>

              <div className="flex flex-col sm:flex-row gap-6">
                {/* Call Forwarding Toggle */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={callFowarding}
                      onChange={(e) => setCallFowarding(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Enable Call Forwarding
                  </span>
                </label>

                {/* Call Transfer Toggle */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={callTransfer}
                      onChange={(e) => setCallTransfer(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Enable Call Transfer
                  </span>
                </label>
              </div>

              {/* Forwarding Number (Conditional) */}
              {callFowarding && (
                <div className="space-y-2 pt-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                    Forwarding Number *
                  </label>
                  <input
                    type="tel"
                    value={callForwoardingNumber}
                    onChange={(e) => setCallFowardingNumber(e.target.value)}
                    placeholder="+1 234 567 8900"
                    className={`w-full rounded-xl border ${
                      errors.callForwoardingNumber
                        ? "border-red-300"
                        : "border-gray-200"
                    } p-3 text-gray-700 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none`}
                  />
                  {errors.callForwoardingNumber && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {errors.callForwoardingNumber}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Call Button */}
          <button
            onClick={handleCall}
            disabled={loading}
            className="w-full mt-8 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 py-4 text-white font-semibold text-lg transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-none flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Initiating Call...
              </>
            ) : (
              <>
                <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Initiate Call
              </>
            )}
          </button>

          {/* Message */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${
                message.startsWith("success:")
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              {message.startsWith("success:") ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 shrink-0" />
              )}
              <p
                className={`text-sm font-medium ${
                  message.startsWith("success:")
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {message.replace("success:", "").replace("error:", "")}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          * Required fields must be filled to initiate a call
        </p>
      </div>
    </main>
  );
}
