"use client";

export default function Dashboard() {
  const openLink = (url: string) => {
    window.open(url, "_blank"); // Opens in new tab
  };

  return (
    <div className="flex flex-col gap-6 items-center justify-center h-full">
      <h1 className="text-3xl font-bold text-gray-800">
        AI Automation Dashboard
      </h1>

      <button
        onClick={() =>
          openLink(
            "https://appsynergiespdfgenerator-9wl7aqdxamkbfkdlsp3wjj.streamlit.app/"
          )
        }
        className="px-8 py-2 rounded-full bg-linear-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
      >
        Pdf Gen 1
      </button>

      <button
        onClick={() =>
          openLink("https://client-agreement-app-ps5c2te3ja-uc.a.run.app/")
        }
        className="px-8 py-2 rounded-full bg-linear-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
      >
        Pdf Gen 2
      </button>
    </div>
  );
}
