"use client";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const openLink = (url: string) => {
    window.open(url, "_blank"); // Opens in new tab
  };
  const openInternal = (path: string) => {
    router.push(path); // navigates to another page within your Next.js app
  };

  const cards = [
    {
      id: "pdf-extractor",
      label: "Pdf Extractor",
      gradient: "linear-gradient(180deg, #6c2bd7 0%, #7a3bd8 40%, #7b3dd8 60%)",
      onClick: () => openInternal("/ocr-file-extractor"),
      icon: (
        <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="2" y="3" width="20" height="18" rx="2" stroke="rgba(255,255,255,0.95)" strokeWidth="1.6" fill="none"/>
          <path d="M6 8h6" stroke="rgba(255,255,255,0.95)" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M7.5 13.5h9" stroke="rgba(255,255,255,0.95)" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M9 16h6" stroke="rgba(255,255,255,0.95)" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      id: "ai-calling",
      label: "AI Calling",
      gradient: "linear-gradient(180deg, #2b2931 0%, #3b3941 40%, #6c6a6f 100%)",
      onClick: () => openInternal("/ai-calling"),
      icon: (
        <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="9.5" cy="9.5" r="3" stroke="rgba(255,255,255,0.95)" strokeWidth="1.6" fill="none"/>
          <path d="M2 14s3-1 6-1 6 1 8 1" stroke="rgba(255,255,255,0.95)" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M15 9h6v6" stroke="rgba(255,255,255,0.95)" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      id: "chatbots",
      label: "Chatbots",
      gradient: "linear-gradient(180deg, #5fb75f 0%, #59b559 40%, #4aa64a 100%)",
      onClick: () => openInternal("/chat-bot"),
      icon: (
        <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="3" y="5" width="12" height="10" rx="2" stroke="rgba(255,255,255,0.95)" strokeWidth="1.6" fill="none"/>
          <path d="M7 19l3-3" stroke="rgba(255,255,255,0.95)" strokeWidth="1.6" strokeLinecap="round"/>
          <rect x="13" y="3" width="8" height="12" rx="2" stroke="rgba(255,255,255,0.95)" strokeWidth="1.6" fill="none"/>
        </svg>
      ),
    },
    {
      id: "proposal-gen",
      label: "Go to Proposal Gen Page",
      gradient: "linear-gradient(180deg, #c04848 0%, #8f2430 60%, #5b1d2b 100%)",
      onClick: () => openInternal("/proposal-gen"),
      icon: (
        <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M6 4h9l3 3v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="rgba(255,255,255,0.95)" strokeWidth="1.5" fill="none"/>
          <path d="M8 9h6M8 12h5" stroke="rgba(255,255,255,0.95)" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      id: "pdf-gen-1",
      label: "PDF Gen 1",
      gradient: "linear-gradient(180deg, #1273d6 0%, #0b59bd 60%, #0a4ea0 100%)",
      onClick: () => openLink("https://appsynergiespdfgenerator-9wl7aqdxamkbfkdlsp3wjj.streamlit.app/"),
      icon: (
        <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="4" y="3" width="12" height="18" rx="2" stroke="rgba(255,255,255,0.95)" strokeWidth="1.5" fill="none"/>
          <path d="M8 9h8M8 13h6" stroke="rgba(255,255,255,0.95)" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M16 17l2 2" stroke="rgba(255,255,255,0.95)" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      id: "pdf-gen-2",
      label: "PDF Gen 2",
      gradient: "linear-gradient(180deg, #2f9aa0 0%, #2a8b8d 60%, #1f6f72 100%)",
      onClick: () => openLink("https://client-agreement-app-ps5c2te3ja-uc.a.run.app/"),
      icon: (
        <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M6 3h9l3 3v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" stroke="rgba(255,255,255,0.95)" strokeWidth="1.5" fill="none"/>
          <circle cx="12" cy="12" r="1.8" stroke="rgba(255,255,255,0.95)" strokeWidth="1.4" fill="none"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f8] flex items-center justify-center p-9 font-[var(--font-poppins),system-ui,-apple-system,'Segoe_UI',Roboto,'Helvetica_Neue',Arial] antialiased">
      <div className="w-[980px] border-4 border-[#111] bg-white p-9 pb-14 rounded-md shadow-[0_6px_28px_rgba(0,0,0,0.08)]">
        <h1 className="text-center text-[40px] mt-1 mb-7 font-bold">AI Automation Dashboard</h1>
        
        <div className="grid grid-cols-3 gap-[22px_28px]" aria-label="AI Automation Dashboard cards">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={card.onClick}
              className="card rounded-[14px] h-[150px] flex flex-col items-center justify-center text-white relative p-[18px] shadow-[0_6px_8px_rgba(0,0,0,0.15),inset_0_-6px_14px_rgba(0,0,0,0.06)] transition-all duration-[180ms] hover:-translate-y-[6px] hover:shadow-[0_12px_20px_rgba(0,0,0,0.18)] focus:outline-none focus:ring-2 focus:ring-white/50"
              style={{ background: card.gradient }}
              tabIndex={0}
            >
              <div className="w-14 h-14 mb-3 opacity-[0.98]">
                {card.icon}
              </div>
              <div className="font-semibold text-lg text-center px-1.5" style={{ textShadow: '0 1px 0 rgba(0,0,0,0.18)' }}>
                {card.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .icon {
          width: 56px;
          height: 56px;
        }
        @media (max-width: 900px) {
          .w-\\[980px\\] {
            width: 92vw;
            padding: 28px;
          }
          .grid-cols-3 {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 520px) {
          .grid-cols-3 {
            grid-template-columns: 1fr;
          }
          .h-\\[150px\\] {
            height: 120px;
          }
        }
      `}</style>
    </div>
  );
}
