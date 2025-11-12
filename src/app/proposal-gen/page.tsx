"use client";
import React, { useEffect, useState } from "react";

interface SuggestionCategory {
  id: string;
  heading: string;
  icon: string;
  options: string[];
  multiSelect?: boolean;
}

const suggestionCategories: SuggestionCategory[] = [
  {
    id: "platforms",
    heading: "Platforms",
    icon: "💻",
    multiSelect: true,
    options: [
      "Landing Page Website",
      "Fully Functional Website",
      "Admin Panel",
      "Android & iOS Apps",
    ],
  },
  {
    id: "vendorType",
    heading: "Type of Vendor",
    icon: "🛍️",
    options: ["Single Vendor", "Multi Vendor"],
  },
  {
    id: "projectType",
    heading: "Type of Project",
    icon: "🚀",
    multiSelect: true,
    options: ["Software Development", "AI Automations"],
  },
  {
    id: "automationsCovered",
    heading: "Automations Covered",
    icon: "🤖",
    options: ["Manychats", "CRM Automation", "AI Calling"],
  },
  {
    id: "aiAutomationPlatforms",
    heading: "AI Automations Platforms Used",
    icon: "⚡",
    multiSelect: true,
    options: [
      "GHL",
      "Hubspot",
      "Monday CRM",
      "Google Sheets",
      "QuickBooks",
      "Make.com",
      "N8N",
      "Retell AI",
      "Manychats",
      "Twilio",
      "Odoo CRM",
      "Zoho CRM",
    ],
  },
  {
    id: "platformType",
    heading: "Type of Platform",
    icon: "🏢",
    options: [
      "Property Listing",
      "Property Selling & Rental",
      "Service Provider",
      "Ecommerce",
      "Sales Management",
      "CRM",
      "Car Listing Platform",
      "Bidding Platform",
      "Courses Selling",
      "Seminar Registration",
      "Matrimony",
      "Dating Platform",
    ],
  },
  {
    id: "techType",
    heading: "Type of Tech",
    icon: "🔧",
    options: ["Shopify", "Next Js", "Wordpress"],
  },
  {
    id: "servicesIncluded",
    heading: "Services Included",
    icon: "📋",
    multiSelect: true,
    options: [
      "UI UX Designs",
      "Website Development",
      "App Development",
      "Testing",
      "Maintenance",
      "Deployment",
    ],
  },
];

const promptHints = [
  "Create a fully functional e-commerce website with product catalog, shopping cart, and payment gateway integration",
  "Develop a mobile app for iOS and Android with user authentication, real-time notifications, and social media integration",
  "Build an AI-powered chatbot for customer service automation with multi-language support and CRM integration",
  "Design and develop a property listing platform with advanced search filters, map integration, and booking system",
];

const ProposalGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [selections, setSelections] = useState<
    Record<string, string | string[]>
  >({});

  const getErrorMessage = (e: unknown) => {
    if (e instanceof Error) return e.message;
    try {
      return JSON.stringify(e);
    } catch {
      return String(e);
    }
  };

  const handleSelectionChange = (
    categoryId: string,
    value: string,
    isMultiSelect: boolean
  ) => {
    setSelections((prev) => {
      if (isMultiSelect) {
        const currentValues = (prev[categoryId] as string[]) || [];
        const newValues = currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value];
        return {
          ...prev,
          [categoryId]: newValues,
        };
      } else {
        return {
          ...prev,
          [categoryId]: value,
        };
      }
    });
  };

  const handleHintClick = (hint: string) => {
    setPrompt(hint);
  };

  const buildCombinedPrompt = (): string => {
    const selectedOptions = Object.entries(selections)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, value]) => {
        if (Array.isArray(value)) return value.length > 0;
        return value !== "";
      })
      .map(([categoryId, value]) => {
        const category = suggestionCategories.find(
          (cat) => cat.id === categoryId
        );
        if (Array.isArray(value)) {
          return `${category?.heading}: ${value.join(", ")}`;
        }
        return `${category?.heading}: ${value}`;
      });

    let combinedPrompt = "";

    if (prompt.trim()) {
      combinedPrompt = prompt.trim();
    }

    if (selectedOptions.length > 0) {
      const optionsText = selectedOptions.join("; ");
      if (combinedPrompt) {
        combinedPrompt = `${combinedPrompt}\n\nAdditional Requirements:\n${optionsText}`;
      } else {
        combinedPrompt = `Generate a proposal with the following specifications:\n${optionsText}`;
      }
    }

    return combinedPrompt;
  };

  const generate = async () => {
    setError(null);
    setResult("");

    const finalPrompt = buildCombinedPrompt();

    if (!finalPrompt.trim()) {
      return setError("Please enter a prompt or select at least one option.");
    }

    try {
      setLoading(true);
      const res = await fetch("https://proposal-generation.onrender.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: finalPrompt }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Request failed");
      }

      const data = await res.json();
      setResult(data.answer ?? JSON.stringify(data, null, 2));
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setToast("✓ Copied to clipboard");
    } catch (err) {
      console.error(err);
      setToast("✗ Failed to copy");
    }
  };

  const clearAll = () => {
    setPrompt("");
    setResult("");
    setError(null);
    setSelections({});
  };

  const formatMarkdownToHTML = (markdown: string) => {
    if (!markdown) return "";

    let html = markdown;

    // Convert headers
    html = html.replace(
      /^### (.*$)/gim,
      '<h3 class="text-lg font-bold text-gray-900 mt-6 mb-3">$1</h3>'
    );
    html = html.replace(
      /^## (.*$)/gim,
      '<h2 class="text-xl font-bold text-gray-900 mt-8 mb-4">$1</h2>'
    );
    html = html.replace(
      /^# (.*$)/gim,
      '<h1 class="text-2xl font-bold text-indigo-600 mt-6 mb-4">$1</h1>'
    );

    // Convert bold text
    html = html.replace(
      /\*\*(.*?)\*\*/gim,
      '<strong class="font-semibold text-gray-900">$1</strong>'
    );

    // Convert numbered lists
    html = html.replace(
      /^\d+\.\s+(.*)$/gim,
      '<li class="ml-6 mb-2 text-gray-700">$1</li>'
    );

    // Wrap consecutive list items in ol tags
    html = html.replace(
      /(<li class="ml-6 mb-2 text-gray-700">.*<\/li>\s*)+/gim,
      (match) => {
        return '<ol class="list-decimal mb-4">' + match + "</ol>";
      }
    );

    // Convert bullet points
    html = html.replace(
      /^[-*]\s+(.*)$/gim,
      '<li class="ml-6 mb-2 text-gray-700">$1</li>'
    );

    // Convert paragraphs (lines that aren't headers or lists)
    const lines = html.split("\n");
    const formattedLines = lines.map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "<br/>";
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<li") ||
        trimmed.startsWith("<ol") ||
        trimmed.startsWith("</ol>") ||
        trimmed.startsWith("<strong")
      ) {
        return line;
      }
      return `<p class="mb-3 text-gray-700 leading-relaxed">${line}</p>`;
    });

    html = formattedLines.join("\n");

    return html;
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const selectedCount = Object.values(selections).filter((v) => {
    if (Array.isArray(v)) return v.length > 0;
    return v !== "";
  }).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-6xl space-y-8">
          {/* Header with elegant design */}
          <div className="text-center space-y-4 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Smart Proposal Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Craft professional proposals with AI-powered intelligence. Type
              freely or choose from curated options.
            </p>
          </div>

          {/* Quick Suggestions Card - Now on Top */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-slide-up">
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-3xl">🎯</span>
                    Quick Suggestions
                  </h2>
                  <p className="text-sm text-gray-600">
                    Select options to automatically build your requirements
                  </p>
                </div>
                {selectedCount > 0 && (
                  <div className="bg-linear-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    {selectedCount} selected
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {suggestionCategories.map((category, index) => (
                  <div
                    key={category.id}
                    className="bg-linear-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-md animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{category.icon}</span>
                        <h3 className="font-semibold text-gray-800 text-base">
                          {category.heading}
                        </h3>
                      </div>
                      {category.multiSelect && (
                        <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full">
                          Select Multiple
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {category.options.map((option) => {
                        const isMultiSelect = category.multiSelect || false;
                        const isSelected = isMultiSelect
                          ? (
                              (selections[category.id] as string[]) || []
                            ).includes(option)
                          : selections[category.id] === option;

                        return (
                          <label
                            key={option}
                            className={`flex items-center space-x-2 cursor-pointer p-2.5 rounded-lg transition-all duration-200 ${
                              isSelected
                                ? "bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                                : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-indigo-200"
                            }`}
                          >
                            <input
                              type={isMultiSelect ? "checkbox" : "radio"}
                              name={isMultiSelect ? undefined : category.id}
                              value={option}
                              checked={isSelected}
                              onChange={() =>
                                handleSelectionChange(
                                  category.id,
                                  option,
                                  isMultiSelect
                                )
                              }
                              className="w-3.5 h-3.5 text-indigo-600 focus:ring-indigo-500 focus:ring-2 rounded shrink-0"
                            />
                            <span
                              className={`text-xs font-medium leading-tight ${
                                isSelected ? "text-white" : ""
                              }`}
                            >
                              {option}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    {((category.multiSelect &&
                      Array.isArray(selections[category.id]) &&
                      (selections[category.id] as string[]).length > 0) ||
                      (!category.multiSelect && selections[category.id])) && (
                      <button
                        onClick={() => {
                          if (category.multiSelect) {
                            setSelections((prev) => ({
                              ...prev,
                              [category.id]: [],
                            }));
                          } else {
                            setSelections((prev) => ({
                              ...prev,
                              [category.id]: "",
                            }));
                          }
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium mt-3 transition-colors flex items-center gap-1"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        <span>Clear selection</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Custom Prompt Card - Now Below with Hints */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden animate-slide-up animation-delay-200">
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <span className="text-2xl">✍️</span>
                  <span>Your Custom Prompt</span>
                </label>
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Optional
                </span>
              </div>

              {/* Hints Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-4 h-4 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">
                    Quick Hints - Click to use:
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {promptHints.map((hint, index) => (
                    <button
                      key={index}
                      onClick={() => handleHintClick(hint)}
                      className="text-left p-3 rounded-lg bg-linear-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-200 hover:border-indigo-300 transition-all duration-200 group/hint"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-600 font-semibold text-xs mt-0.5 shrink-0">
                          {index + 1}.
                        </span>
                        <span className="text-xs text-gray-700 leading-relaxed group-hover/hint:text-gray-900">
                          {hint}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your project in detail... (e.g., I need a mobile app for fitness tracking with social features and gamification...)"
                className="w-full h-36 rounded-xl border-2 border-gray-200 p-4 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 resize-none bg-white transition-all duration-300 text-gray-700 placeholder-gray-400"
              />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <button
                  onClick={generate}
                  disabled={loading}
                  className="group relative px-8 py-3.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-base hover:scale-105 disabled:hover:scale-100"
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
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
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        <span>Generate Proposal</span>
                      </>
                    )}
                  </span>
                </button>

                <button
                  onClick={clearAll}
                  className="px-8 py-3.5 bg-white text-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-base border-2 border-gray-200 hover:border-gray-300 hover:scale-105"
                >
                  <span className="flex items-center justify-center gap-2">
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
                    <span>Clear All</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 animate-shake">
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-red-800 font-semibold">Error</h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Result Section */}
          {result && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-slide-up">
              <div className="bg-linear-to-r from-indigo-500 to-purple-600 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <span>✨</span>
                      <span>Your Generated Proposal</span>
                    </h2>
                    <p className="text-indigo-100 text-sm mt-1">
                      AI-crafted and ready to use
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={copyToClipboard}
                      className="px-5 py-2.5 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-300 font-medium shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105"
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
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Copy</span>
                    </button>
                    <button
                      onClick={() =>
                        navigator.share
                          ? navigator.share({ text: result })
                          : setToast("✗ Share not supported")
                      }
                      className="px-5 py-2.5 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-300 font-medium shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105"
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
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="prose prose-lg max-w-none">
                  <div
                    className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-8 leading-relaxed shadow-inner border border-gray-200"
                    dangerouslySetInnerHTML={{
                      __html: formatMarkdownToHTML(result),
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      <div className="fixed bottom-8 right-8 z-50 pointer-events-none">
        <div
          className={`transform transition-all duration-300 ease-out pointer-events-auto ${
            toast
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-4 scale-95"
          }`}
        >
          {toast && (
            <div className="bg-linear-to-r from-gray-900 to-gray-800 text-white px-6 py-4 rounded-xl shadow-2xl font-medium flex items-center gap-3 border border-gray-700">
              <span className="text-lg">{toast}</span>
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-linear-to-br from-indigo-900/40 via-purple-900/40 to-pink-900/40 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center space-y-6 animate-scale-in">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin animation-delay-150"></div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Generating Your Proposal
              </h3>
              <p className="text-gray-600">
                AI is crafting something amazing...
              </p>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce animation-delay-200"></div>
              <div className="w-3 h-3 bg-pink-600 rounded-full animate-bounce animation-delay-400"></div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
          animation-fill-mode: both;
        }
        .animation-delay-150 {
          animation-delay: 0.15s;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
        .hover\:scale-105:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default ProposalGenerator;
