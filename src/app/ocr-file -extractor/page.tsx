"use client";

import { useState, ChangeEvent, DragEvent } from "react";
import {
  X,
  Upload,
  Loader2,
  Copy,
  CheckCircle,
  FileText,
  Sparkles,
} from "lucide-react";

interface ExtractedEntity {
  Address: string;
  "Bill To": string;
  "Company Name": string;
  Email: string;
  Invoice: string;
  "Invoice Date": string;
  "Mobile No": string;
  "Total Amount": string;
}

interface Result {
  filename: string;
  extracted_entities: ExtractedEntity;
}

interface ApiResponse {
  results?: Result[];
  message?: string;
  error?: string;
}

export default function FileUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(
      (file) =>
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    setFiles((prev) => [...prev, ...validFiles]);
    e.target.value = "";
  };

  const handleDrag = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const validFiles = droppedFiles.filter(
        (file) =>
          file.type === "application/pdf" ||
          file.type === "application/msword" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert("Please select at least one file");
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

      const res = await fetch(
        "https://n8n.srv1028016.hstgr.cloud/webhook/fe263796-2e1e-4918-a227-fe7a667d1224",
        {
          method: "POST",
          body: formData,
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: ApiResponse = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("Error:", error);
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          setResponse({
            error:
              "Request timed out. The server took too long to respond. Please try again with fewer or smaller files.",
          });
        } else if (error.message.includes("Failed to fetch")) {
          setResponse({
            error:
              "Network error. Please check your internet connection and try again. The server might also be temporarily unavailable.",
          });
        } else {
          setResponse({ error: `Error: ${error.message}. Please try again.` });
        }
      } else {
        setResponse({
          error: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8">
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 border-2 border-purple-200 shadow-2xl">
            <div className="relative">
              <Loader2 className="w-20 h-20 text-purple-600 animate-spin" />
              <div className="absolute inset-0 w-20 h-20 bg-purple-200 rounded-full animate-ping opacity-20" />
            </div>
            <p className="mt-6 text-xl font-semibold text-gray-800">
              Processing your files...
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Extracting data with AI
            </p>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-2xl mb-4 border border-purple-200">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            Document Extractor
          </h1>
          <p className="text-xl text-gray-600">
            Upload documents and extract data instantly with AI
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-8 sm:p-10 mb-8">
          <div className="mb-8">
            <label
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className="block"
            >
              <div
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                  dragActive
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
                }`}
              >
                <div className="relative inline-block mb-4">
                  <Upload className="w-16 h-16 text-purple-500 mx-auto" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">+</span>
                  </div>
                </div>
                <p className="text-gray-800 text-lg font-semibold mb-2">
                  Drop files here or click to browse
                </p>
                <p className="text-gray-500 text-sm mb-3">
                  Supports PDF, DOC, and DOCX files
                </p>
                <div className="inline-flex items-center px-4 py-2 bg-purple-50 rounded-full border border-purple-200">
                  <FileText className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-purple-700 text-sm font-medium">
                    Multiple files supported
                  </span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  multiple
                  onChange={handleFileSelect}
                />
              </div>
            </label>
          </div>

          {files.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-600" />
                  Selected Files ({files.length})
                </h3>
                <button
                  onClick={() => setFiles([])}
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-3">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                        <span className="text-white font-bold text-xs">
                          {file.name.split(".").pop()?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors ml-4 p-2 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={files.length === 0 || loading}
            className="w-full bg-linear-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
          >
            {files.length === 0
              ? "Select Files to Continue"
              : "Extract Data from Files"}
          </button>
        </div>

        {response && (
          <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-8 sm:p-10 animate-in fade-in slide-in-from-bottom duration-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <Sparkles className="w-6 h-6 mr-3 text-purple-600" />
                Extracted Data
              </h3>
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-5 py-3 rounded-xl transition-all duration-200 border border-gray-300 hover:border-gray-400 group"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      Copied!
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                      Copy JSON
                    </span>
                  </>
                )}
              </button>
            </div>

            {response.error ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <p className="text-red-700 font-medium">{response.error}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {response.results?.map((result, index) => (
                  <div
                    key={index}
                    className="bg-linear-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-300 transition-all duration-200"
                  >
                    <div className="flex items-center mb-6 pb-4 border-b-2 border-gray-200">
                      <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg mr-4">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">
                          {result.filename}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Document {index + 1} of {response.results?.length}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(result.extracted_entities).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200"
                          >
                            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-2">
                              {key}
                            </p>
                            <p
                              className={`text-base ${
                                value === "Not found"
                                  ? "text-gray-400 italic"
                                  : "text-gray-900 font-semibold"
                              }`}
                            >
                              {value}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {response.message && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 shrink-0 mt-0.5" />
                <p className="text-green-700 text-sm font-medium">
                  {response.message}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
