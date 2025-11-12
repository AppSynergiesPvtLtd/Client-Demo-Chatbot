"use client";

import { useState } from "react";
// import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
// import {
//   LayoutDashboard,
//   MessageSquare,
//   PhoneCall,
//   Folder,
//   UploadIcon,
// } from "lucide-react";

// import ChatbotPage from "./chat-bot/page";
import Dashboard from "./dashboard/page";
// import AICalling from "./ai-calling/page";
// import ProposalGenerator from "./proposal-gen/page";
// import FileUploader from "./ocr-file -extractor/page";

export default function RootPage() {
  // const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <Dashboard />
    // <div className="flex h-screen w-full overflow-hidden bg-gray-100 dark:bg-neutral-900">
    //   <Sidebar activeTab={activeTab} setActiveTab={setActiveTab}>
    //     <SidebarBody>
    //       <SidebarLink
    //         link={{
    //           key: "dashboard",
    //           label: "Dashboard",
    //           icon: <LayoutDashboard size={20} />,
    //           href: "#",
    //         }}
    //       />
    //       <SidebarLink
    //         link={{
    //           key: "chatbot",
    //           label: "Chatbot",
    //           icon: <MessageSquare size={20} />,
    //           href: "#",
    //         }}
    //       />
    //       <SidebarLink
    //         link={{
    //           key: "ai-calling",
    //           label: "AI Calling",
    //           icon: <PhoneCall size={20} />,
    //           href: "#",
    //         }}
    //       />
    //       <SidebarLink
    //         link={{
    //           key: "proposal-gen",
    //           label: "Proposal Generator",
    //           icon: <Folder size={20} />,
    //           href: "#",
    //         }}
    //       />
    //       <SidebarLink
    //         link={{
    //           key: "file-uploader",
    //           label: "File Uploader",
    //           icon: <UploadIcon size={20} />,
    //           href: "#",
    //         }}
    //       />
    //     </SidebarBody>
    //   </Sidebar>

    //   <main className="flex-1 overflow-y-auto">
    //     {activeTab === "dashboard" && <Dashboard />}
    //     {activeTab === "chatbot" && <ChatbotPage />}
    //     {activeTab === "ai-calling" && <AICalling />}
    //     {activeTab === "proposal-gen" && <ProposalGenerator />}
    //     {activeTab === "file-uploader" && <FileUploader />}
    //   </main>
    // </div>
  );
}
